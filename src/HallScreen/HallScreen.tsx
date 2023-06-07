import { motion } from "framer-motion";
import SnowFlakes from "../SnowFlakes";
import mainScreen from "../assets/go-to-start.svg";
import hallBg from "../assets/hall-bg.png";

type HallScreenProps = {
  onBack: () => void;
};

export default function HallScreen({ onBack }: HallScreenProps) {
  return (
    <div
      className="h-full flex justify-center items-center bg-[#ECEBFF] p-10 bg-center bg-no-repeat bg-cover"
      style={{ backgroundImage: `url(${hallBg})` }}
    >
      <motion.button
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={onBack}
        className="absolute top-10 right-10"
      >
        <img src={mainScreen} />
      </motion.button>
      <div className="w-full h-full flex flex-col gap-[60px]">
        <h2 className="text-5xl text-[#452B9F] text-center">HALL OF FAME</h2>
        <iframe
          className="h-full rounded"
          src={import.meta.env.VITE_HALL_GRID_URL}
          allow="clipboard-read; clipboard-write"
        />
      </div>
      <SnowFlakes />
    </div>
  );
}
