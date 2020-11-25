interface GameProps {
  gameMode: GameMode;
  difficulty: Difficulty;
  challengeFileIds?: number[];
}

type GameMode = "casual" | "competitive";

type Difficulty = "easy" | "medium" | "hard";
