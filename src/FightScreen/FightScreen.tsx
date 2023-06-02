import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import fight from "../assets/fight.png";
import youWin from "../assets/you-win.png";
import AnimatedText from "./AnimatedText";
import PlayerItem from "./PlayerItem";

type Cell = {
  columnId: string;
  value: string;
};

type Record = {
  cells: Cell[];
  id: string;
  lastModifiedTime: string;
};

export type Player = {
  name: string;
  health: number;
  strength: number;
  detail: any;
};

type FightResult = {
  players: Player[];
  winner_image: string;
  winner_name: string;
};

function getPublicImageUrl(imageName: string) {
  const query = new URLSearchParams({
    x_share_key: import.meta.env.VITE_X_SHARE_KEY,
  });

  return `https://api.gridly.com/gridly/api/v1/databases/tz8bj4npq6rf8/files/${imageName}?${query}`;
}

export default function FightScreen() {
  const [gameRecords, setGameRecords] = useState<Record[]>();
  const [characterRecords, setCharacterRecords] = useState<Record[]>();
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  stepRef.current = step;

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const fightingData = await fetch(
          `https://api.gridly.com/v1/views/${
            import.meta.env.VITE_GAME_VIEW_ID
          }/records`,
          {
            headers: {
              Authorization: `ApiKey ${import.meta.env.VITE_API_KEY}`,
            },
          }
        );
        const json = await fightingData.json();
        setGameRecords(json);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGameData();
  }, []);

  useEffect(() => {
    const fetchCharacterData = async () => {
      try {
        const characterData = await fetch(
          `https://api.gridly.com/v1/views/${
            import.meta.env.VITE_CHARACTER_VIEW_ID
          }/records`,
          {
            headers: {
              Authorization: `ApiKey ${import.meta.env.VITE_API_KEY}`,
            },
          }
        );
        const json = await characterData.json();
        setCharacterRecords(json);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCharacterData();
  }, []);

  // useEffect(() => {
  //   if (import.meta.env.DEV) return;
  //   const interval = setInterval(() => {
  //     if (stepRef.current >= 3) {
  //       clearInterval(interval);
  //     } else {
  //       setStep((step) => step + 1);
  //     }
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  if (!gameRecords || !characterRecords) return null;

  const playRecord = gameRecords.sort(
    (p1, p2) =>
      new Date(p2.lastModifiedTime).getTime() -
      new Date(p1.lastModifiedTime).getTime()
  )[0];

  const environmentImage =
    playRecord.cells.find((cell) => cell.columnId === "environment_image")
      ?.value[0] || "";
  const environmentImageUrl = getPublicImageUrl(environmentImage);

  const storyText =
    playRecord.cells.find((cell) => cell.columnId === "battle_story_generation")
      ?.value || "";

  const fightResult: FightResult = JSON.parse(
    playRecord.cells.find((cell) => cell.columnId === "fight_result")?.value ||
      ""
  ).result;

  const players = fightResult.players.map((player) => {
    const playerRecord = characterRecords.find((record) =>
      record.cells.find((cell) => cell.value === player.name)
    );
    if (!playerRecord) return player;

    const playerDetail = playerRecord.cells.reduce((result, cell) => {
      return { ...result, [cell.columnId]: cell.value };
    }, {});

    return { ...player, detail: playerDetail };
  });

  const winner = players.find(
    (player) => player.name === fightResult.winner_name
  );

  if (import.meta.env.DEV) {
    console.log(fightResult);
    console.log(players);
  }

  return (
    <div
      style={{ backgroundImage: `url(${environmentImageUrl})` }}
      className="h-full bg-center bg-no-repeat bg-cover flex flex-col justify-center items-center"
    >
      <div className="top-10 absolute flex gap-3">
        <button
          onClick={() => setStep((currentStep) => Math.max(currentStep - 1, 0))}
          className="text-black border rounded bg-white p-2"
        >
          Back
        </button>
        <button
          onClick={() => setStep((currentStep) => Math.min(currentStep + 1, 3))}
          className="text-black border rounded bg-white p-2"
        >
          Next
        </button>
      </div>
      {step === 0 && (
        <motion.div className="border-[5px] rounded-[10px] border-[#D55CFF] px-8 py-6 w-1/2 bg-white">
          <AnimatedText text={storyText} className="text-2xl" />
        </motion.div>
      )}
      {step === 1 && (
        <div className="flex gap-[300px]">
          {players.map((player) => (
            <PlayerItem
              key={player.name}
              name={player.name}
              imageUrl={getPublicImageUrl(player.detail["fighter_image"][0])}
              health={player.health}
              strength={player.strength}
              quote={player.detail["fighter_battle_cry"]}
            />
          ))}
        </div>
      )}
      {step === 2 && (
        <div className="flex gap-[300px] relative">
          {players.map((player) => (
            <PlayerItem
              key={player.name}
              name={player.name}
              imageUrl={getPublicImageUrl(player.detail["fighter_image"][0])}
              health={player.health}
              strength={player.strength}
            />
          ))}
          <img
            src={fight}
            className="absolute w-[300px] left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 "
          />
        </div>
      )}
      {step === 3 && (
        <div className="flex flex-col items-center gap-10">
          <img src={youWin} />
          {winner && (
            <PlayerItem
              key={winner.name}
              name={winner.name}
              imageUrl={getPublicImageUrl(winner.detail["fighter_image"][0])}
              health={winner.health}
              strength={winner.strength}
            />
          )}
        </div>
      )}
    </div>
  );
}
