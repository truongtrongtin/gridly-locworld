import { motion } from "framer-motion";
import SnowFlakes from "../SnowFlakes";
import hallOfFame from "../assets/hall-of-fame.svg";
import startBg from "../assets/start-bg.png";
import startButton from "../assets/start-button.svg";

type StartScreenProps = {
  onStart: () => void;
  onHallClick: () => void;
};

export default function StartScreen({
  onStart,
  onHallClick,
}: StartScreenProps) {
  return (
    <div
      className="h-full bg-[#261855] bg-center bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(${startBg})` }}
    >
      <motion.button
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={onHallClick}
        className="absolute top-10 right-10"
      >
        <img src={hallOfFame} />
      </motion.button>
      <p className="absolute left-1/2 -translate-x-1/2 bottom-10 text-3xl text-white">
        2023
      </p>
      <div className="h-full flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-white uppercase text-9xl">Fantasy Fight</h1>
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={onStart}
            className="mt-10"
          >
            <img src={startButton} className="w-[200px]" />
          </motion.button>
        </div>
      </div>
      <SnowFlakes />
    </div>
  );
}
