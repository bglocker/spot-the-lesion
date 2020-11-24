import React from "react";
import useQuery from "../../utils/routerUtils";
import {
  getDifficultyOrDefault,
  getFileIdsOrDefault,
  getGameModeOrDefault,
} from "../../utils/GameUtils";
import Game from "./Game";

const GameRoute: React.FC = () => {
  const query = useQuery();

  const gameMode = getGameModeOrDefault(query.get("gameMode"));
  const difficulty = getDifficultyOrDefault(query.get("difficulty"));
  const fileIds = getFileIdsOrDefault(query.get("fileIds"));

  /* TODO: create /challenge route, push / and /game to history */
  return <Game gameMode={gameMode} difficulty={difficulty} challengeFileIds={fileIds} />;
};

export default GameRoute;
