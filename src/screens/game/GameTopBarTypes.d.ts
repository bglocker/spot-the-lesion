interface GameTopBarProps {
  gameMode: GameMode;
  showHintDisabled: boolean;
  onShowHint: () => void;
  roundTime: number;
  timerColor: string;
}
