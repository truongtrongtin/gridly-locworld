import { useEffect, useRef, useState } from "react";
import firstPlayerCard from "../assets/first-player-card.svg";
import secondPlayerCard from "../assets/second-player-card.svg";
import fight from "../assets/fight.png";
import youWin from "../assets/you-win.png";

export default function FightScreen() {
  const [records, setRecords] = useState<any>();
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  stepRef.current = step;

  useEffect(() => {
    const fetchFightingData = async () => {
      const fightingData = await fetch(
        `https://api.gridly.com/v1/views/${
          import.meta.env.VITE_VIEW_ID
        }/records`,
        { headers: { Authorization: `ApiKey ${import.meta.env.VITE_API_KEY}` } }
      );
      const json = await fightingData.json();
      setRecords(json);
    };
    fetchFightingData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (stepRef.current >= 3) {
        clearInterval(interval);
      } else {
        setStep((step) => step + 1);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!records) return null;

  const fightingData = records.at(-1).cells.reduce((acc: any, cell: any) => {
    return { ...acc, [cell.columnId]: cell.value };
  }, {});
  const backgroundImageUrl = `https://api.gridly.com/v1/views/${
    import.meta.env.VITE_VIEW_ID
  }/files/${fightingData.environment_image[0]}`;

  return (
    <div
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      className="h-full bg-center flex flex-col justify-center items-center"
    >
      {step === 0 && (
        <div className="border-[5px] rounded-[10px] border-[#D55CFF] px-8 py-6 w-1/2 bg-white">
          <p className="text-xl">{fightingData.battle_reason}</p>
        </div>
      )}
      {step === 1 && (
        <div className="flex gap-40">
          <img src={firstPlayerCard} className="w-[300px]" />
          <img src={secondPlayerCard} className="w-[300px]" />
        </div>
      )}
      {step === 2 && (
        <div className="flex gap-40">
          <img src={firstPlayerCard} className="w-[300px]" />
          <img
            src={fight}
            className="absolute w-[300px] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 "
          />
          <img src={secondPlayerCard} className="w-[300px]" />
        </div>
      )}
      {step === 3 && (
        <div className="flex flex-col items-center gap-10">
          <img src={youWin} />
          <img src={firstPlayerCard} className="w-[300px]" />
        </div>
      )}
    </div>
  );
}
