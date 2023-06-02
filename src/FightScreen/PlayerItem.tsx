import { Player } from "./FightScreen";
import firstPlayerCard from "../assets/first-player-card.svg";

export default function PlayerItem({ player }: { player: Player }) {
  return (
    <div className="relative">
      <p className="absolute text-white top-[14px] left-[50%] -translate-x-1/2">
        {player.name}
      </p>
      <img src={firstPlayerCard} className="w-[300px]" />
      <img
        src={player.imageUrl}
        className="absolute w-[200px] h-[200px] top-[60px] left-[50%] -translate-x-1/2"
      />
      <p className="absolute text-[#2B167D] bottom-[52px] right-[60px]">
        {player.health}
      </p>
      <p className="absolute text-[#2B167D] bottom-[26px] right-[60px]">
        {player.strength}
      </p>
    </div>
  );
}
