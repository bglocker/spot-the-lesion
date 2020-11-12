import React from "react";
import OptionsSelectInterface from "./OptionsSelectInterface";

const DIFFICULTY_SPLITTERS = [0, 1252, 3454, 4723];

const DifficultySelect: React.FC<DifficultySelectProps> = ({
  setMin,
  setMax,
}: DifficultySelectProps) => {
  const onHardClick = () => {
    document.getElementById("Hard")!.style.backgroundColor = "gray";
    document.getElementById("Medium")!.style.backgroundColor = "green";
    document.getElementById("Easy")!.style.backgroundColor = "green";
    setMin(DIFFICULTY_SPLITTERS[0]);
    setMax(DIFFICULTY_SPLITTERS[1]);
  };

  const onMediumClick = () => {
    document.getElementById("Hard")!.style.backgroundColor = "green";
    document.getElementById("Medium")!.style.backgroundColor = "gray";
    document.getElementById("Easy")!.style.backgroundColor = "green";
    setMin(DIFFICULTY_SPLITTERS[1]);
    setMax(DIFFICULTY_SPLITTERS[2]);
  };

  const onEasyClick = () => {
    document.getElementById("Hard")!.style.backgroundColor = "green";
    document.getElementById("Medium")!.style.backgroundColor = "green";
    document.getElementById("Easy")!.style.backgroundColor = "gray";
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
