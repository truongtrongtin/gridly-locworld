import SnowFlakes from "./SnowFlakes";
import startButton from "./assets/start-button.svg";
import { motion } from "framer-motion";
import startBg from "./assets/start-bg.png";

type StartScreenProps = {
  onStart: () => void;
};

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div
      className="h-full bg-[#261855] bg-center bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(${startBg})` }}
    >
      <p className="absolute left-1/2 -translate-x-1/2 bottom-10 text-3xl text-white">
        2023
      </p>
      <div className="h-full flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-white uppercase text-9xl">Fantasy Fight</h1>
          <motion.div animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <button onClick={onStart} className="mt-10">
              <img src={startButton} className="w-[200px]" />
            </button>
          </motion.div>
        </div>
      </div>
      <SnowFlakes />
    </div>
  );
}
