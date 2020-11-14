interface GameTopBarProps {
  gameMode: GameMode;
  hintDisabled: boolean;
  onHintClick: () => void;
  roundTime: number;
  timerColor: string;
}
