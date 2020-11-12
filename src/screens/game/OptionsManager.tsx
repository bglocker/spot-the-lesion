import React, { useState } from "react";
import Game from "./Game";
import GameModeSelect from "./GameModeSelect";
import DifficultySelect from "./DifficultySelect";

const OptionsManager: React.FC<OptionsProps> = ({ setRoute }: OptionsProps) => {
  const [selectedMode, setSelectedMode] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>("casual");

  const [selectedDifficulty, setSelectedDifficulty] = useState(false);
  const [minId, setMinId] = useState(0);
  const [maxId, setMaxId] = useState(0);

  if (!selectedMode) {
    return (
      <GameModeSelect setRoute={setRoute} setSelected={setSelectedMode} setGameMode={setGameMode} />
    );
  }

  if (!selectedDifficulty) {
    return (
      <DifficultySelect
        setRoute={setRoute}
        setSelected={setSelectedDifficulty}
        setMin={setMinId}
        setMax={setMaxId}
      />
    );
  }

  return <Game setRoute={setRoute} gameMode={gameMode} MIN_FILE_ID={minId} MAX_FILE_ID={maxId} />;
};

export default OptionsManager;
