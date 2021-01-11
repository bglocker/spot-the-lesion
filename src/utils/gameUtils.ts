import { ReactNode } from "react";
import { OptionsObject } from "notistack";
import { drawStrokedText } from "./canvasUtils";
import { assertUnreachable } from "./errorUtils";
import constants from "../res/constants";
import variables from "../res/variables";

/**
 * Draw the round end text
 *
 * @param ctx       Context to draw the text on
 * @param text      Text to draw
 * @param size      Text font size (in px)
 * @param lineWidth Width of the text line
 * @param color     Text color
 */
const drawRoundEndText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  size: number,
  lineWidth: number,
  color: string
): void => {
  const x = Math.round(ctx.canvas.width / 2);
  const y = Math.round(ctx.canvas.height / 10);

  drawStrokedText(ctx, text, x, y, "center", size, lineWidth, "white", color);
};

/**
 * Given the coordinates of two rectangles, returns the ratio of their intersection
 * over their union.
 *
 * Used in determining the success of a given AI prediction.
 *
 * @param rectA Coordinates for the corners of the first rectangle
 * @param rectB Coordinates for the corners of the second rectangle
 *
 * @return Ratio of intersection area over union area
 */
const getIntersectionOverUnion = (rectA: number[], rectB: number[]): number => {
  if (rectA.length !== 4 || rectB.length !== 4) {
    throw new Error("Both input rectangles must be arrays of length 4.");
  }

  const xA = Math.max(rectA[0], rectB[0]);
  const xB = Math.min(rectA[2], rectB[2]);
  const yA = Math.max(rectA[1], rectB[1]);
  const yB = Math.min(rectA[3], rectB[3]);

  const inter = Math.max(0, xB - xA + 1) * Math.max(0, yB - yA + 1);

  const areaA = (rectA[2] - rectA[0] + 1) * (rectA[3] - rectA[1] + 1);
  const areaB = (rectB[2] - rectB[0] + 1) * (rectB[3] - rectB[1] + 1);

  const union = areaA + areaB - inter;

  return inter / union;
};

/**
 * Returns the path to the annotation file corresponding to the given annotationId
 *
 * @param annotationId Id of the annotation file to retrieve
 * @param difficulty   Game difficulty, specifying the sub folder name
 *
 * @return Path to annotation file
 */

const getAnnotationPath = (annotationId: number, difficulty: Difficulty): string =>
  `annotation/${difficulty}/${annotationId}.json`;

/**
 * Returns the path to the image file corresponding to the given imageId
 *
 * @param imageId    Id of the image file to retrieve
 * @param difficulty Game difficulty, specifying the sub folder name
 *
 * @return Path to image file
 */
const getImagePath = (imageId: number, difficulty: Difficulty): string =>
  `images/${difficulty}/${imageId}.png`;

/**
 * Return the number of files corresponding to the given difficulty
 *
 * @param difficulty Difficulty for which to retrieve the files number
 *
 * @return Number of files
 */
const getFilesNumber = (difficulty: Difficulty): number => {
  switch (difficulty) {
    case "easy":
      return variables.easyFilesNumber;
    case "medium":
      return variables.mediumFilesNumber;
    case "hard":
      return variables.hardFilesNumber;
    default:
      return assertUnreachable(difficulty);
  }
};

/**
 * Given a string, get its corresponding game mode value, or if that's not valid, use the default
 *
 * @param gameMode Game mode string
 * @param def      Default game mode value
 *
 * @return Valid game mode value
 */
const getGameModeOrDefault = (gameMode: string | null, def: GameMode = "casual"): GameMode => {
  if (gameMode === "casual" || gameMode === "competitive") {
    return gameMode;
  }

  return def;
};

/**
 * Given a string, get its corresponding difficulty value, or if that's not valid, use the default
 *
 * @param difficulty Difficulty string
 * @param def        Default difficulty value
 *
 * @return Valid difficulty value
 */
const getDifficultyOrDefault = (
  difficulty: string | null,
  def: Difficulty = "easy"
): Difficulty => {
  if (difficulty === "easy" || difficulty === "medium" || difficulty === "hard") {
    return difficulty;
  }

  return def;
};

/**
 * Given a string, get the file ids array it encodes, or if that's not valid, use the default
 *
 * @param fileIds File ids array encoding
 * @param def     Default file ids array value
 *
 * @return Valid file ids array, or undefined
 */
const getFileIdsOrDefault = (fileIds: string | null, def?: number[]): number[] | undefined => {
  /* Check for array-style string */
  if (
    fileIds === null ||
    fileIds.length < 2 ||
    fileIds[0] !== "[" ||
    fileIds[fileIds.length - 1] !== "]"
  ) {
    return def;
  }

  try {
    return JSON.parse(fileIds);
  } catch (_error) {
    return def;
  }
};

/**
 * Unlock an achievement and display a snackbar to the user (if not already unlocked)
 *
 * @param key             Achievement key
 * @param message         Snackbar message
 * @param enqueueSnackbar Function to display a snackbar
 */
const unlockAchievement = (
  key: string,
  message: ReactNode,
  enqueueSnackbar: (message: ReactNode, options?: OptionsObject) => void
): void => {
  if (localStorage.getItem(key) === null) {
    enqueueSnackbar(message, constants.achievementSnackbarOptions);

    localStorage.setItem(key, "true");
  }
};

export {
  drawRoundEndText,
  getAnnotationPath,
  getDifficultyOrDefault,
  getFileIdsOrDefault,
  getFilesNumber,
  getGameModeOrDefault,
  getImagePath,
  getIntersectionOverUnion,
  unlockAchievement,
};
