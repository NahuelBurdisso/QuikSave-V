import { Download, Microphone, Pause, Trash } from "@phosphor-icons/react";
import Button from "./shared/Button";
import { FC, useEffect, useRef, useState } from "react";
import moment from "moment";
import AudioWaveForm from "./AudioWaveForm";
import { useTranslation } from "react-i18next";

const AUDIO_WAVE_MIN_WIDTH = 500;
const DATA_ACTUALIZATION_RATE = 1;

const RecordingSection: FC = () => {
  const { t } = useTranslation();
  const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array());
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState<Date>(new Date(0));
  const [uploadedAudio, setUploadedAudio] = useState<Blob | null>(null);
  const [size, setSize] = useState(0); // In MB
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (isRecording) {
      resetRecording();
      const interval = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = new Date(prev.getTime() + 1000);
          return newTime;
        });
      }, 1000);

      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          mediaRecorder.current = new MediaRecorder(stream);
          mediaRecorder.current.start(DATA_ACTUALIZATION_RATE);

          const audioChunks: Blob[] = [];
          const audioContext = new AudioContext();
          const track = audioContext.createMediaStreamSource(stream);
          const analyser = audioContext.createAnalyser();
          track.connect(analyser);
          analyser.connect(audioContext.destination);

          mediaRecorder.current.addEventListener("dataavailable", (event) => {
            audioChunks.push(event.data);
            setAudioChunks(audioChunks);

            // Calculate the total size of all chunks
            const totalSize = audioChunks.reduce(
              (total, chunk) => total + chunk.size,
              0
            );
            const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
            setSize(parseFloat(sizeInMB));

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            analyser.getByteTimeDomainData(dataArray);
            setAudioData(dataArray);
          });
        })
        .catch((err) => {
          console.error(err);
        });

      return () => clearInterval(interval);
    } else {
      setAudioData(new Uint8Array());
      setAudioChunks([]);
    }
  }, [isRecording]);

  const resetRecording = () => {
    setRecordingTime(new Date(0));
    setAudioChunks([]);
    setUploadedAudio(null);
    setSize(0);
  };

  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);

      // Stop the media stream
      mediaRecorder.current.stream.getTracks().forEach((track) => {
        track.stop();
      });

      // Create a blob from the audio chunks
      const blob = new Blob(audioChunks, {
        type: "audio/wav",
      });

      // Save the blob to the state
      setUploadedAudio(blob);
    }
  };
  const saveToFileSystem = () => {
    if (uploadedAudio) {
      const url = URL.createObjectURL(uploadedAudio);
      const a = document.createElement("a");
      a.href = url;
      a.download = "audio.wav";
      a.click();
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center mt-10">
      <Button
        onClick={() => {
          if (isRecording) {
            stopRecording();
          } else {
            startRecording();
          }
        }}
        className="relative mb-12"
      >
        {isRecording ? (
          <Pause color="#1b2e75" className="w-20 h-20 md:w-16 md:h-16" />
        ) : (
          <Microphone color="#1b2e75" className="w-20 h-20 md:w-16 md:h-16" />
        )}
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
          {isRecording && (
            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-800 opacity-75" />
          )}
          <div className="absolute inline-flex rounded-full w-44 h-44 md:h-32 md:w-32 border-4 border-blue-800 hover:bg-purple-600/20" />
        </div>
      </Button>
      <AudioWaveForm
        audioData={audioData}
        height={100}
        width={
          window.innerWidth < AUDIO_WAVE_MIN_WIDTH
            ? window.innerWidth - 40
            : AUDIO_WAVE_MIN_WIDTH
        }
        isRecording={isRecording}
        className="my-8"
      />
      <div className="text-blue-800 text-center mb-6 text-4xl md:text-2xl font-semibold">
        <span>{moment(recordingTime).format("mm:ss")}</span>
        <span> / </span>
        <span>{size} MB</span>
      </div>
      <div className="h-24">
        {uploadedAudio && (
          <div className="flex items-center justify-center w-full space-x-4 py-4">
            <Button
              className="bg-blue-300 hover:bg-blue-400 text-blue-900 rounded-md px-4 py-2 space-x-2"
              onClick={() => {
                resetRecording();
              }}
            >
              <Trash size={18}></Trash>
              <span>{t("delete")}</span>
            </Button>
            <Button
              className="bg-blue-800 hover:bg-blue-900 text-blue-100 rounded-md px-4 py-2 space-x-2"
              onClick={() => {
                saveToFileSystem();
              }}
            >
              <Download size={18}></Download>
              <span>{t("save")}</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordingSection;
