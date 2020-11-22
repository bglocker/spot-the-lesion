import React from "react";
import { useTheme } from "@material-ui/core";
import OptionsSelectInterface from "./OptionsSelectInterface";

const GameModeSelect: React.FC<GameModeSelectProps> = ({
  setGameMode,
  setGameModeSelected,
}: GameModeSelectProps) => {
  const theme = useTheme();

  const onCasualClick = () => {
    document.getElementById("Casual")!.style.backgroundColor = theme.palette.primary.main;
    document.getElementById("Competitive")!.style.backgroundColor = "gray";

    setGameModeSelected(true);
    setGameMode("casual");
  };

  const onCompetitiveClick = () => {
    document.getElementById("Casual")!.style.backgroundColor = "gray";
    document.getElementById("Competitive")!.style.backgroundColor = theme.palette.primary.main;

    setGameModeSelected(true);
    setGameMode("competitive");
  };

  return (
    <OptionsSelectInterface
      optionName="Game mode"
      options={[
        ["Casual", onCasualClick],
        ["Competitive", onCompetitiveClick],
      ]}
    />
  );
};

export default GameModeSelect;
