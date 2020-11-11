interface GameProps {
  setRoute: (Route) => void;
  gameMode: GameMode;
  MIN_FILE_ID: number;
  MAX_FILE_ID: number;
}

interface GameModeSelectProps {
  setRoute: (Route) => void;
  setSelected: (boolean) => void;
  setGameMode: (string) => void;
}

interface DifficultySelectProps {
  setRoute: (Route) => void;
  setSelected: (boolean) => void;
  setMin: (int) => void;
  setMax: (int) => void;
}

interface OptionsProps {
  setRoute: (Route) => void;
}

interface OptionsSelectInterface {
  setRoute: (Route) => void;
  optionName: string;
  options: [string, () => void][];
}

interface SubmitScoreDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (string) => void;
}

type GameMode = "casual" | "competitive";
type Difficulty = "hard" | "medium" | "easy";
