interface GameProps {
  setRoute: (Route) => void;
  gameMode: GameMode;
}

interface GameModeSelectProps {
  setRoute: (Route) => void;
}

interface SubmitScoreDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (string) => void;
}

type GameMode = "casual" | "competitive";
