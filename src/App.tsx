import { GithubLogo } from "@phosphor-icons/react";
import "./App.css";
import RecordingSection from "./components/RecordingSection";
import { useTranslation } from "react-i18next";
import "./i18n/config";
import favIcon from "./assets/favicon.ico";

function App() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center h-screen w-screen from-purple-300 to-blue-300 bg-gradient-to-b">
      <div className="h-full w-4/5 md:w-1/2 text-center flex flex-col items-center justify-center">
        <div className="mb-24 md:mb-14 space-y-4">
          <h1 className="text-6xl md:text-4xl flex items-center justify-center">
            <img
              src={favIcon}
              alt="QuikSave"
              className="h-16 md:w-10 w-16 md:h-10 mr-1"
            />
            uikSave
          </h1>
          <h2 className="text-lg">
            <span className="italic">{t("famousQuote")}</span>
          </h2>
        </div>
        <RecordingSection />
      </div>
      <footer className="absolute bottom-0 left-0 right-0 flex items-center justify-end text-xs text-blue-100 bg-blue-900 p-2">
        <GithubLogo size={16} className="mx-1" />
        <span>{t("by")}</span>
        <a
          href="https://github.com/NahuelBurdisso"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-1 text-blue-100 hover:text-blue-300"
        >
          @NahuelBurdisso
        </a>
      </footer>
    </div>
  );
}

export default App;
