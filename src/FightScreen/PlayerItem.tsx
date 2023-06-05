import { forwardRef } from "react";
import playerCard from "../assets/player-card.svg";
import { motion } from "framer-motion";

type PlayerItemProps = {
  name: string;
  imageUrl: string;
  health: number;
  strength: number;
  quote?: string;
};

const PlayerItem = forwardRef<HTMLDivElement, PlayerItemProps>(function (
  { name, imageUrl, health, strength, quote },
  ref
) {
  return (
    <div className="relative" ref={ref}>
      {quote && (
        <motion.div className="w-[150%] absolute -top-2 -translate-y-full left-[50%] -translate-x-1/2 border-[5px] rounded-[10px] border-[#D55CFF] px-8 py-6 bg-white text-xl">
          {quote}
        </motion.div>
      )}
      <p className="absolute text-white top-[14px] left-[50%] -translate-x-1/2">
        {name}
      </p>
      <img src={playerCard} className="w-[300px]" />
      <img
        src={imageUrl}
        className="absolute w-[200px] h-[200px] top-[60px] left-[50%] -translate-x-1/2"
      />
      <p className="absolute text-[#2B167D] bottom-[52px] right-[60px]">
        {health}
      </p>
      <p className="absolute text-[#2B167D] bottom-[26px] right-[60px]">
        {strength}
      </p>
    </div>
  );
});

export default PlayerItem;
