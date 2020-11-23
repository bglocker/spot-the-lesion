interface GameProps {
  setRoute: (Route) => void;
  gameMode: GameMode;
  fileIdRange: [number, number];
}

type GameMode = "casual" | "competitive";

type Difficulty = "easy" | "medium" | "hard";
