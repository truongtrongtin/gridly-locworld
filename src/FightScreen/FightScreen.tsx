import { motion, useAnimate } from "framer-motion";
import { useEffect, useState } from "react";
import fight from "../assets/fight.png";
import playerCard from "../assets/player-card.svg";
import youWin from "../assets/you-win.png";
import useImagePreloader from "../hooks/use-image-preloader";
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

type Round = {
  attack_roll: number;
  attacker: string;
  damage_dealt: number;
  defender: string;
  evasion_roll: number;
  is_critical: boolean;
};

type FightResult = {
  players: Player[];
  winner_image: string;
  winner_name: string;
  rounds: Round[];
};

type GameData = {
  battle_story_generation: string;
  environment_image: string[];
  fight_result: {
    result: FightResult;
  };
};

function getPublicImageUrl(imageName: string) {
  const query = new URLSearchParams({
    x_share_key: import.meta.env.VITE_X_SHARE_KEY,
  });

  return `https://api.gridly.com/gridly/api/v1/databases/tz8bj4npq6rf8/files/${imageName}?${query}`;
}

export default function FightScreen() {
  const [gameData, setGameData] = useState<GameData>();
  const [firstPlayer, setFirstPlayer] = useState<Player>();
  const [secondPlayer, setSecondPlayer] = useState<Player>();
  const [firstPlayerRef, animateFirstPlayer] = useAnimate<HTMLDivElement>();
  const [secondPlayerRef, animateSecondPlayer] = useAnimate<HTMLDivElement>();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gamesPromise = fetch(
          `https://api.gridly.com/v1/views/${
            import.meta.env.VITE_GAME_VIEW_ID
          }/records`,
          {
            headers: {
              Authorization: `ApiKey ${import.meta.env.VITE_API_KEY}`,
            },
          }
        );
        const charactersPromise = fetch(
          `https://api.gridly.com/v1/views/${
            import.meta.env.VITE_CHARACTER_VIEW_ID
          }/records`,
          {
            headers: {
              Authorization: `ApiKey ${import.meta.env.VITE_API_KEY}`,
            },
          }
        );
        const [fightingRes, characterRes] = await Promise.all([
          gamesPromise,
          charactersPromise,
        ]);
        const [gameRecords, characterRecords] = await Promise.all(
          [fightingRes, characterRes].map((data) => data.json())
        );

        const gameData = (gameRecords as Record[])
          .sort(
            (p1, p2) =>
              new Date(p2.lastModifiedTime).getTime() -
              new Date(p1.lastModifiedTime).getTime()
          )?.[0]
          .cells.reduce((result, cell) => {
            if (cell.columnId === "fight_result") {
              return { ...result, [cell.columnId]: JSON.parse(cell.value) };
            }
            return { ...result, [cell.columnId]: cell.value };
          }, {} as GameData);

        const players = gameData.fight_result.result.players.map((player) => {
          const playerRecord = (characterRecords as Record[]).find((record) =>
            (record?.cells || []).find((cell) => cell?.value === player.name)
          );
          if (!playerRecord) return player;

          const playerDetail = (playerRecord.cells || []).reduce(
            (result, cell) => {
              return { ...result, [cell.columnId]: cell.value };
            },
            {}
          );

          return { ...player, detail: playerDetail };
        });

        setGameData(gameData);
        setFirstPlayer(players[0]);
        setSecondPlayer(players[1]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
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

  const environmentImageUrl = getPublicImageUrl(
    gameData?.environment_image?.[0] || ""
  );

  const firstPlayerImageUrl = getPublicImageUrl(
    firstPlayer?.detail?.["fighter_image"]?.[0] || ""
  );
  const secondPlayerImageUrl = getPublicImageUrl(
    secondPlayer?.detail?.["fighter_image"]?.[0] || ""
  );

  const { imagesPreloaded } = useImagePreloader([
    fight,
    playerCard,
    youWin,
    environmentImageUrl,
    firstPlayerImageUrl,
    secondPlayerImageUrl,
  ]);

  useEffect(() => {
    if (
      !firstPlayerRef.current ||
      !secondPlayerRef.current ||
      !firstPlayer ||
      !secondPlayer ||
      !gameData
    )
      return;
    const yeahh = async () => {
      for (const round of gameData?.fight_result.result.rounds || []) {
        console.log(round.attacker === firstPlayer?.name);
        if (round.attacker === firstPlayer?.name) {
          await animateFirstPlayer(
            firstPlayerRef.current,
            { x: [null, 300, 0] },
            {
              duration: 0.2,
              delay: 1,
              onComplete: () => {
                setSecondPlayer({
                  ...secondPlayer,
                  health: secondPlayer.health - round.damage_dealt,
                });
              },
            }
          );
        } else {
          await animateSecondPlayer(
            secondPlayerRef.current,
            { x: [null, -300, 0] },
            {
              duration: 0.2,
              delay: 1,
              onComplete: () => {
                setFirstPlayer({
                  ...firstPlayer,
                  health: firstPlayer.health - round.damage_dealt,
                });
              },
            }
          );
        }
      }
    };

    yeahh();
  }, [
    firstPlayerRef,
    secondPlayerRef,
    animateFirstPlayer,
    animateSecondPlayer,
    step,
    gameData,
    firstPlayer,
    secondPlayer,
    imagesPreloaded,
  ]);

  if (import.meta.env.DEV) {
    console.log("gameData", gameData);
    console.log("firstPlayer", firstPlayer);
    console.log("secondPlayer", secondPlayer);
  }

  if (!imagesPreloaded || !gameData || !firstPlayer || !secondPlayer)
    return (
      <span className="h-full flex justify-center items-center">
        Loading...
      </span>
    );

  const winner =
    firstPlayer.name === gameData.fight_result.result.winner_name
      ? firstPlayer
      : secondPlayer;

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
          onClick={() => setStep((currentStep) => Math.min(currentStep + 1, 4))}
          className="text-black border rounded bg-white p-2"
        >
          Next
        </button>
      </div>
      {step === 0 && (
        <motion.div className="border-[5px] rounded-[10px] border-[#D55CFF] px-8 py-6 w-1/2 bg-white">
          <AnimatedText
            text={gameData.battle_story_generation}
            className="text-2xl"
          />
        </motion.div>
      )}
      {step === 1 && (
        <div className="flex gap-[300px]">
          <motion.div
            initial={{ y: -800 }}
            animate={{ y: [null, 0] }}
            transition={{
              duration: 2,
              type: "spring",
              mass: 0.8,
            }}
          >
            <PlayerItem
              name={firstPlayer.name}
              imageUrl={firstPlayerImageUrl}
              health={firstPlayer.health}
              strength={firstPlayer.strength}
              quote={firstPlayer.detail["fighter_battle_cry"]}
            />
          </motion.div>

          <motion.div
            initial={{ y: -800 }}
            animate={{ y: [null, 0] }}
            transition={{
              duration: 2,
              type: "spring",
              mass: 0.8,
              delay: 2,
            }}
          >
            <PlayerItem
              name={secondPlayer.name}
              imageUrl={secondPlayerImageUrl}
              health={secondPlayer.health}
              strength={secondPlayer.strength}
              quote={secondPlayer.detail["fighter_battle_cry"]}
            />
          </motion.div>
        </div>
      )}
      {step === 2 && (
        <div className="flex gap-[300px] relative justify-center items-center">
          <PlayerItem
            name={firstPlayer.name}
            imageUrl={firstPlayerImageUrl}
            health={firstPlayer.health}
            strength={firstPlayer.strength}
          />
          <PlayerItem
            name={secondPlayer.name}
            imageUrl={secondPlayerImageUrl}
            health={secondPlayer.health}
            strength={secondPlayer.strength}
          />
          <motion.img
            src={fight}
            className="absolute w-[300px]"
            animate={{ scale: [1, 2, 1] }}
            transition={{ duration: 1 }}
          />
        </div>
      )}
      {step === 3 && (
        <div className="flex gap-[300px] relative">
          <PlayerItem
            ref={firstPlayerRef}
            name={firstPlayer.name}
            imageUrl={firstPlayerImageUrl}
            health={firstPlayer.health}
            strength={firstPlayer.strength}
          />
          <PlayerItem
            ref={secondPlayerRef}
            name={secondPlayer.name}
            imageUrl={getPublicImageUrl(
              secondPlayer.detail["fighter_image"][0]
            )}
            health={secondPlayer.health}
            strength={secondPlayer.strength}
          />
        </div>
      )}
      {step === 4 && (
        <div className="flex flex-col items-center gap-10">
          <motion.img
            src={youWin}
            animate={{ scale: [1, 2, 1] }}
            transition={{ duration: 1 }}
          />
          {winner && (
            <PlayerItem
              key={winner.name}
              name={winner.name}
              imageUrl={secondPlayerImageUrl}
              health={winner.health}
              strength={winner.strength}
            />
          )}
        </div>
      )}
    </div>
  );
}
