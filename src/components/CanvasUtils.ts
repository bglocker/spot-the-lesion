/* Default canvas size, used for scale mapping */
const DEFAULT_CANVAS_SIZE = 512;

/**
 * Maps a given value to the given canvas scale
 *
 * @param x   Value to map
 * @param ctx Canvas context, used to determine canvas size for scaling
 *
 * @return Given value, mapped to the canvas scale
 */
const mapToCanvasScale = (x: number, ctx: CanvasRenderingContext2D): number =>
  (x * ctx.canvas.width) / DEFAULT_CANVAS_SIZE;

/**
 * Draws a rectangle
 *
 * @param ctx         Context to draw the rectangle on
 * @param rect        Coordinates for the corners of the rectangle to draw
 * @param strokeStyle Style for drawing the rectangle
 * @param lineWidth   Width of the rectangle lines
 */
const drawRectangle = (
  ctx: CanvasRenderingContext2D,
  rect: number[],
  strokeStyle: string,
  lineWidth: number
): void => {
  const xBase = rect[0];
  const xEnd = rect[2];
  const yBase = rect[1];
  const yEnd = rect[3];

  const width = xEnd - xBase;
  const height = yEnd - yBase;

  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.rect(xBase, yBase, width, height);
  ctx.stroke();
};

/**
 * Draws a cross
 *
 * @param ctx         Context to draw the cross on
 * @param x           Width coordinate
 * @param y           Height coordinate
 * @param size        Cross size from center to edge
 * @param strokeStyle Style for drawing the cross
 */
const drawCross = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  strokeStyle: string
): void => {
  ctx.strokeStyle = strokeStyle;
  ctx.beginPath();
  ctx.moveTo(x - size, y - size);
  ctx.lineTo(x + size, y + size);
  ctx.moveTo(x + size, y - size);
  ctx.lineTo(x - size, y + size);
  ctx.stroke();
};

/**
 * Draws a circle
 *
 * @param ctx         Context to draw the circle on
 * @param x           Width coordinate
 * @param y           Height coordinate
 * @param radius      Circle radius
 * @param width       Width of the circle line
 * @param strokeStyle Style for drawing the circle
 */
const drawCircle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  width: number,
  strokeStyle: string
): void => {
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.stroke();
};

export { drawCircle, drawCross, drawRectangle, mapToCanvasScale };
