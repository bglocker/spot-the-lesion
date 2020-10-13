import React from "react";

const Game: React.FC<GameProps> = ({ setRoute }: GameProps) => {
  return (
    <div>
      <p>Game</p>
      <button type="button" onClick={() => setRoute("home")}>
        Back
      </button>
    </div>
  );
};

export default Game;
