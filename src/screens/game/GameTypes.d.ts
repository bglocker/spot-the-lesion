interface GameProps {
  setRoute: (Route) => void;
  gameMode: GameMode;
  MIN_FILE_ID: number;
  MAX_FILE_ID: number;
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
