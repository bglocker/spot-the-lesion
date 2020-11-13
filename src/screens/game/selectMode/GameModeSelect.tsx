import React from "react";
import { useTheme } from "@material-ui/core";
import OptionsSelectInterface from "./OptionsSelectInterface";

const GameModeSelect: React.FC<GameModeSelectProps> = ({
  setGameMode,
  setGameModeSelected,
}: GameModeSelectProps) => {
  const theme = useTheme();

  const onCasualClick = () => {
    setGameModeSelected(true);
    document.getElementById("Casual")!.style.backgroundColor = theme.palette.primary.main;
    document.getElementById("Competitive")!.style.backgroundColor = "gray";
    setGameMode("casual");
  };

  const onCompetitiveClick = () => {
    setGameModeSelected(true);
    document.getElementById("Casual")!.style.backgroundColor = "gray";
    document.getElementById("Competitive")!.style.backgroundColor = theme.palette.primary.main;
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
