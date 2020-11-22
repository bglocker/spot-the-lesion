import React from "react";
import { useTheme } from "@material-ui/core";
import OptionsSelectInterface from "./OptionsSelectInterface";

const DIFFICULTY_SPLITTERS = [0, 1252, 3454, 4723];

const DifficultySelect: React.FC<DifficultySelectProps> = ({
  setMin,
  setMax,
  setDifficultySelected,
}: DifficultySelectProps) => {
  const theme = useTheme();

  const onHardClick = () => {
    document.getElementById("Hard")!.style.backgroundColor = theme.palette.primary.main;
    document.getElementById("Medium")!.style.backgroundColor = "gray";
    document.getElementById("Easy")!.style.backgroundColor = "gray";

    setDifficultySelected(true);
    setMin(DIFFICULTY_SPLITTERS[0]);
    setMax(DIFFICULTY_SPLITTERS[1]);
  };

  const onMediumClick = () => {
    document.getElementById("Hard")!.style.backgroundColor = "gray";
    document.getElementById("Medium")!.style.backgroundColor = theme.palette.primary.main;
    document.getElementById("Easy")!.style.backgroundColor = "gray";

    setDifficultySelected(true);
    setMin(DIFFICULTY_SPLITTERS[1]);
    setMax(DIFFICULTY_SPLITTERS[2]);
  };

  const onEasyClick = () => {
    document.getElementById("Hard")!.style.backgroundColor = "gray";
    document.getElementById("Medium")!.style.backgroundColor = "gray";
    document.getElementById("Easy")!.style.backgroundColor = theme.palette.primary.main;

    setDifficultySelected(true);
    setMin(DIFFICULTY_SPLITTERS[2]);
    setMax(DIFFICULTY_SPLITTERS[3]);
  };

  return (
    <OptionsSelectInterface
      optionName="Difficulty"
      options={[
        ["Easy", onEasyClick],
        ["Medium", onMediumClick],
        ["Hard", onHardClick],
      ]}
    />
  );
};

export default DifficultySelect;
