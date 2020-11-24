import React from "react";
import useQuery from "../../utils/routerUtils";
import { getDifficultyOrDefault, getGameModeOrDefault } from "../../utils/GameUtils";
import Game from "./Game";

const GameRoute: React.FC = () => {
  const query = useQuery();

  const gameMode = getGameModeOrDefault(query.get("gameMode"));
  const difficulty = getDifficultyOrDefault(query.get("difficulty"));

  return <Game gameMode={gameMode} difficulty={difficulty} />;
};

export default GameRoute;
