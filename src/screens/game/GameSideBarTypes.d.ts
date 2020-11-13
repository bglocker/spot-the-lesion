interface GameSideBarProps {
  gameMode: GameMode;
  round: number;
  inRound: boolean;
  loading: boolean;
  playerScore: number;
  playerRoundScore: number;
  aiScore: number;
  aiRoundScore: number;
  onStartRound: () => void;
  onShowSubmit: () => void;
}
