import { useState } from "react";
import StartScreen from "./StartScreen";
import FightScreen from "./FightScreen/FightScreen";

export const Screen = {
  START: "START",
  FIGHT: "FIGHT",
  SCORE: "SCORE",
} as const;
export type Screen = (typeof Screen)[keyof typeof Screen];

function App() {
  const [screen, setScreen] = useState<Screen>(Screen.START);

  switch (screen) {
    case Screen.START:
    default:
      return <StartScreen onStart={() => setScreen(Screen.FIGHT)} />;
    case Screen.FIGHT:
      return <FightScreen />;
  }
}

export default App;
