interface GameProps {
  setRoute: (Route) => void;
  gameMode: GameMode;
  minFileId: number;
  maxFileId: number;
}

interface GameModeSelectProps {
  setGameModeSelected: (boolean) => void;
  setGameMode: (string) => void;
}

interface DifficultySelectProps {
  setDifficultySelected: (boolean) => void;
  setMin: (int) => void;
  setMax: (int) => void;
}

interface OptionsProps {
  setRoute: (Route) => void;
}

interface OptionsSelectInterface {
  optionName: string;
  options: [string, () => void][];
}

type GameMode = "casual" | "competitive";

type Difficulty = "hard" | "medium" | "easy";
