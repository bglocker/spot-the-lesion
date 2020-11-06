/**
 * Returns the path to the json file corresponding to the given fileNumber
 *
 * @param fileNumber Number of the file to retrieve
 */
const getJsonPath = (fileNumber: number): string =>
  `${process.env.PUBLIC_URL}/content/annotation/${fileNumber}.json`;

/**
 * Returns the path to the image file corresponding to the given fileNumber
 *
 * @param fileNumber Number of the file to retrieve
 */
const getImagePath = (fileNumber: number): string =>
  `${process.env.PUBLIC_URL}/content/images/${fileNumber}.png`;

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
 * Create an array from a given range
 *
 * @param start First value of range (inclusive)
 * @param stop  Last value of range (exclusive)
 * @param step  Step between consecutive range values
 */
const range = (start = 1, stop: number, step = 1): number[] =>
  Array.from({ length: (stop - start) / step }, (_, i) => i * step);

/**
 * Generate a new, previously unseen file Id
 * Does not mutate the input array, instead returning a copy
 *
 * @param fileIds Current (unseen) file ids to choose from
 *
 * @return Tuple of the chosen Id, and a copy of the fileIds without the chosen Id
 */
const getNewFileId = (fileIds: number[]): [number, number[]] => {
  if (fileIds.length === 0) {
    /* TODO: handle case where all files have been used */
    return [-1, []];
  }

  const remainingFileIds = [...fileIds];

  const index = Math.floor(Math.random() * remainingFileIds.length);

  const [newFileId] = remainingFileIds.splice(index, 1);

  return [newFileId, remainingFileIds];
};

export { getJsonPath, getIntersectionOverUnion, getImagePath, getNewFileId, range };
