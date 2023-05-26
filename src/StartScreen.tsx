import startButton from "./assets/start-button.svg";

type StartScreenProps = {
  onStart: () => void;
};

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="h-full bg-[#261855]">
      <p className="absolute left-1/2 -translate-x-1/2 bottom-10 text-3xl text-white">
        2023
      </p>
      <div className="h-full flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-white uppercase text-9xl">Gridly game</h1>
          <button onClick={onStart} className="mt-10">
            <img src={startButton} className="w-[200px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
