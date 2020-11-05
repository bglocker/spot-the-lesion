interface GameProps {
  setRoute: (Route) => void;
  gameMode: GameMode;
}

interface GameModeSelectProps {
  setRoute: (Route) => void;
}

type GameMode = "casual" | "competitive";
