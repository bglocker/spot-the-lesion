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
    setDifficultySelected(true);
    document.getElementById("Hard")!.style.backgroundColor = theme.palette.primary.main;
    document.getElementById("Medium")!.style.backgroundColor = "gray";
    document.getElementById("Easy")!.style.backgroundColor = "gray";
    setMin(DIFFICULTY_SPLITTERS[0]);
    setMax(DIFFICULTY_SPLITTERS[1]);
  };

  const onMediumClick = () => {
    setDifficultySelected(true);
    document.getElementById("Hard")!.style.backgroundColor = "gray";
    document.getElementById("Medium")!.style.backgroundColor = theme.palette.primary.main;
    document.getElementById("Easy")!.style.backgroundColor = "gray";
    setMin(DIFFICULTY_SPLITTERS[1]);
    setMax(DIFFICULTY_SPLITTERS[2]);
  };

  const onEasyClick = () => {
    setDifficultySelected(true);
    document.getElementById("Hard")!.style.backgroundColor = "gray";
    document.getElementById("Medium")!.style.backgroundColor = "gray";
    document.getElementById("Easy")!.style.backgroundColor = theme.palette.primary.main;
    setMin(DIFFICULTY_SPLITTERS[2]);
    setMax(DIFFICULTY_SPLITTERS[3]);
  };

  return (
    <OptionsSelectInterface
      optionName="difficulty"
      options={[
        ["Easy", onEasyClick],
        ["Medium", onMediumClick],
        ["Hard", onHardClick],
      ]}
    />
  );
};

export default DifficultySelect;
