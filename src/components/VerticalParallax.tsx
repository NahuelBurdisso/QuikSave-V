import { Lightbulb } from "@phosphor-icons/react";
import { motion } from "framer-motion";

const VerticalParallax = () => {
  const numIcons = 150; // Number of icons
  const icons = Array(numIcons).fill(Lightbulb);

  // Function to generate random styles and animation properties
  const randomizeIcon = () => {
    return {
      left: `${Math.floor(Math.random() * 100)}vw`,
      initialY: Math.floor(Math.random() * -400) - 50,
      delay: Math.random() * 2,
    };
  };

  return (
    <div className="z-10 fixed top-0 left-0 w-screen h-screen pointer-events-none">
      {icons.map((Icon, index) => {
        const { left, initialY, delay } = randomizeIcon();

        return (
          <motion.div
            key={index}
            initial={{ y: initialY }}
            animate={{ y: [null, window.innerHeight + 200] }}
            transition={{
              repeat: Infinity,
              repeatDelay: delay,
              duration: Math.random() * 5 + 5,
              ease: "linear",
              delay: delay,
            }}
            className="absolute"
            style={{ left: left }}
          >
            <Icon className="w-5 h-5 text-blue-300" />
          </motion.div>
        );
      })}
    </div>
  );
};
export default VerticalParallax;
