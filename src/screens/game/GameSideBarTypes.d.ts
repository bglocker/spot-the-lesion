interface GameSideBarProps {
  gameMode: GameMode;
  round: number;
  inRound: boolean;
  roundLoading: boolean;
  playerScore: number;
  playerRoundScore: number;
  aiScore: number;
  aiRoundScore: number;
  onStartRound: () => void;
  onSubmitClick: () => void;
}
