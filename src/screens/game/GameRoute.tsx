import React from "react";
import { RouteComponentProps } from "react-router-dom";
import {
  getDifficultyOrDefault,
  getFileIdsOrDefault,
  getGameModeOrDefault,
} from "../../utils/GameUtils";
import Game from "./Game";

type GameRouteProps = Omit<RouteComponentProps<never>, "match">;

const GameRoute: React.FC<GameRouteProps> = ({ history, location }: GameRouteProps) => {
  const query = new URLSearchParams(location.search);

  const gameMode = getGameModeOrDefault(query.get("gameMode"));
  const difficulty = getDifficultyOrDefault(query.get("difficulty"));
  const fileIds = getFileIdsOrDefault(query.get("fileIds"));

  const gameModeParam = `gameMode=${fileIds ? "competitive" : gameMode}`;
  const difficultyParam = `&difficulty=${difficulty}`;
  const fileIdsParam = fileIds ? `&fileIds=${JSON.stringify(fileIds)}` : "";

  const search = `?${gameModeParam}${difficultyParam}${fileIdsParam}`;

  if (location.search !== search) {
    history.replace(`/game${search}`);
  }

  return <Game gameMode={gameMode} difficulty={difficulty} challengeFileIds={fileIds} />;
};

export default GameRoute;
