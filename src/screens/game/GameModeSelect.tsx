import React from "react";
import OptionsSelectInterface from "./OptionsSelectInterface";

const GameModeSelect: React.FC<GameModeSelectProps> = ({ setGameMode }: GameModeSelectProps) => {
  const onCasualClick = () => {
    document.getElementById("Casual")!.style.backgroundColor = "gray";
    document.getElementById("Competitive")!.style.backgroundColor = "green";
    setGameMode("casual");
  };

  const onCompetitiveClick = () => {
    document.getElementById("Casual")!.style.backgroundColor = "green";
    document.getElementById("Competitive")!.style.backgroundColor = "gray";
    setGameMode("competitive");
  };

  return (
    <OptionsSelectInterface
      optionName="mode"
      options={[
        ["Casual", onCasualClick],
        ["Competitive", onCompetitiveClick],
      ]}
    />
  );
};

export default GameModeSelect;
