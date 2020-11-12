import React from "react";
import OptionsSelectInterface from "./OptionsSelectInterface";

const GameModeSelect: React.FC<GameModeSelectProps> = ({
  setRoute,
  setSelected,
  setGameMode,
}: GameModeSelectProps) => {
  const onCasualClick = () => {
    setSelected(true);
    setGameMode("casual");
  };

  const onCompetitiveClick = () => {
    setSelected(true);
    setGameMode("competitive");
  };

  return (
    <OptionsSelectInterface
      setRoute={setRoute}
      optionName="mode"
      options={[
        ["Casual", onCasualClick],
        ["Competitive", onCompetitiveClick],
      ]}
    />
  );
};

export default GameModeSelect;
