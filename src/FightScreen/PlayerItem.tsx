import { forwardRef } from "react";
import playerCard from "../assets/player-card.svg";
import { motion } from "framer-motion";

type PlayerItemProps = {
  name: string;
  imageUrl: string;
  health: number;
  strength: number;
  quote?: string;
  hit?: string;
  critical?: boolean;
};

const PlayerItem = forwardRef<HTMLDivElement, PlayerItemProps>(function (
  { name, imageUrl, health, strength, quote, hit, critical },
  ref
) {
  return (
    <div className="relative" ref={ref}>
      {quote && (
        <motion.div className="w-[150%] absolute -top-2 -translate-y-full left-[50%] -translate-x-1/2 border-[5px] rounded-[10px] border-[#D55CFF] px-8 py-6 bg-white text-xl text-center">
          {quote}
        </motion.div>
      )}
      {hit && (
        <motion.div
          className={`absolute -top-2 -translate-y-full left-[50%] -translate-x-1/2 border-[5px] rounded-[10px] border-[#D55CFF] px-8 py-6 bg-white ${
            critical ? "text-6xl" : "text-3xl"
          } text-center text-red-500`}
        >
          {hit}
          {critical ? "!!!" : ""}
        </motion.div>
      )}
      <div className={`${health <= 0 ? "grayscale" : ""}`}>
        <p className="absolute text-white top-[13px] left-[50%] -translate-x-1/2 text-xl whitespace-nowrap">
          {name}
        </p>
        <img src={playerCard} className="w-[300px]" />
        <img
          src={imageUrl}
          className="absolute w-[200px] h-[200px] top-[60px] left-[50%] -translate-x-1/2"
        />
        <p className="absolute text-[#2B167D] bottom-[50px] right-[60px] text-xl">
          {health}
        </p>
        <p className="absolute text-[#2B167D] bottom-[25px] right-[60px] text-xl">
          {strength}
        </p>
      </div>
    </div>
  );
});

export default PlayerItem;
