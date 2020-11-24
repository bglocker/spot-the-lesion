interface GameProps {
  gameMode: GameMode;
  difficulty: Difficulty;
}

type GameMode = "casual" | "competitive";

type Difficulty = "easy" | "medium" | "hard";
