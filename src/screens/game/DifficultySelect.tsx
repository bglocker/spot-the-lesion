import React from "react";
import OptionsSelectInterface from "./OptionsSelectInterface";

const DIFFICULTY_SPLITTERS = [0, 1252, 3454, 4723];

const DifficultySelect: React.FC<DifficultySelectProps> = ({
  setRoute,
  setSelected,
  setMin,
  setMax,
}: DifficultySelectProps) => {
  const onHardClick = () => {
    setSelected(true);
    setMin(DIFFICULTY_SPLITTERS[0]);
    setMax(DIFFICULTY_SPLITTERS[1]);
  };

  const onMediumClick = () => {
    setSelected(true);
    setMin(DIFFICULTY_SPLITTERS[1]);
    setMax(DIFFICULTY_SPLITTERS[2]);
  };

  const onEasyClick = () => {
    setSelected(true);
    setMin(DIFFICULTY_SPLITTERS[2]);
    setMax(DIFFICULTY_SPLITTERS[3]);
  };

  return (
    <OptionsSelectInterface
      setRoute={setRoute}
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
