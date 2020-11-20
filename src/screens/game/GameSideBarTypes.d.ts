interface GameSideBarProps {
  gameStarted: boolean;
  gameEnded: boolean;
  roundEnded: boolean;
  roundLoading: boolean;
  showIncrement: boolean;
  onStartRound: () => void;
  onSubmitClick: () => void;
  playerScore: { total: number; round: number };
  aiScore: { total: number; round: number };
}
