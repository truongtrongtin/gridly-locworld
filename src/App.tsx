import { useState } from "react";
import StartScreen from "./StartScreen";
import FightScreen from "./FightScreen";
import HallScreen from "./HallScreen";

export const Screen = {
  START: "START",
  FIGHT: "FIGHT",
  HALL: "HALL",
} as const;
export type Screen = (typeof Screen)[keyof typeof Screen];

function App() {
  const [screen, setScreen] = useState<Screen>(
    import.meta.env.DEV ? Screen.HALL : Screen.START
  );

  const gotoHall = () => {
    setScreen(Screen.HALL);
  };

  switch (screen) {
    case Screen.START:
    default:
      return (
        <StartScreen
          onStart={() => setScreen(Screen.FIGHT)}
          onHallClick={gotoHall}
        />
      );
    case Screen.FIGHT:
      return <FightScreen onHallClick={gotoHall} />;
    case Screen.HALL:
      return <HallScreen onBack={() => setScreen(Screen.START)} />;
  }
}

export default App;
