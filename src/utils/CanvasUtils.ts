/* Default canvas size, used for scale mapping */
import React from "react";

const DEFAULT_CANVAS_SIZE = 512;

/**
 * Maps a given value to the scale of the given canvas
 *
 * @param ctx Canvas context, used to determine canvas size for scaling
 * @param x   Value to map
 *
 * @return Given value, mapped to the canvas scale, and rounded
 */
const mapToCanvasScale = (ctx: CanvasRenderingContext2D, x: number): number =>
  Math.round((x * ctx.canvas.width) / DEFAULT_CANVAS_SIZE);

/**
 * Maps the coordinates of a given rectangle to the scale of the given canvas
 *
 * @param ctx  Canvas context, used to determine canvas size for scaling
 * @param rect Coordinates for the corners of the rectangle to map
 *
 * @return Given rectangle coordinates, mapped to the canvas scale
 */
const mapCoordinatesToCanvasScale = (ctx: CanvasRenderingContext2D, rect: number[]): number[] =>
  rect.map((x) => mapToCanvasScale(ctx, x));

/**
 * Maps the click position relative to the canvas
 *
 * @param ctx   Canvas context to map relative to
 * @param event Mouse event, used to get click position
 *
 * @return Click coordinates relative to the canvas, and rounded
 */
const mapClickToCanvas = (
  ctx: CanvasRenderingContext2D,
  event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
): { x: number; y: number } => {
  const rect = ctx.canvas.getBoundingClientRect();
  const widthScale = ctx.canvas.width / rect.width;
  const heightScale = ctx.canvas.height / rect.height;

  return {
    x: Math.round((event.clientX - rect.left) * widthScale),
    y: Math.round((event.clientY - rect.top) * heightScale),
  };
};

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

export {
  drawCircle,
  drawCross,
  drawRectangle,
  mapClickToCanvas,
  mapCoordinatesToCanvasScale,
  mapToCanvasScale,
};
