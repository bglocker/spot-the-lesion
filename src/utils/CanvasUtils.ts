/* Default canvas size, used for scale mapping */
import React from "react";
import constants from "../res/constants";

/**
 * Maps a given value from the scale of the given canvas to the default scale
 * Equivalent to the inverse of toCanvasScale
 *
 * @param ctx Canvas context, used to determine canvas scale
 * @param x
 *
 * @return Given value, mapped to the default scale, and rounded
 */
const toDefaultScale = (ctx: CanvasRenderingContext2D, x: number): number =>
  Math.round((x * constants.defaultImageSize) / ctx.canvas.width);

/**
 * Maps a given value from the default scale to the scale of the given canvas
 * Equivalent to the inverse of toDefaultScale
 *
 * @param ctx Canvas context, used to determine canvas scale
 * @param x   Value to map
 *
 * @return Given value, mapped to the canvas scale, and rounded
 */
const toCanvasScale = (ctx: CanvasRenderingContext2D, x: number): number =>
  Math.round((x * ctx.canvas.width) / constants.defaultImageSize);

/**
 * Maps the coordinates of a given rectangle to the scale of the given canvas
 *
 * @param ctx  Canvas context, used to determine canvas size for scaling
 * @param rect Coordinates for the corners of the rectangle to map
 *
 * @return Given rectangle coordinates, mapped to the canvas scale
 */
const mapCoordinatesToCanvasScale = (ctx: CanvasRenderingContext2D, rect: number[]): number[] =>
  rect.map((x) => toCanvasScale(ctx, x));

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
 * Get a random value in a range around a start point
 *
 * @param x     Start point
 * @param range Random range (-range, range)
 *
 * @return Random value in range around x
 */
const randomAround = (x: number, range: number): number =>
  x + Math.floor(Math.random() * (range * 2)) - range;

/**
 * Draws a rectangle
 *
 * @param ctx         Context to draw the rectangle on
 * @param rect        Coordinates for the corners of the rectangle to draw
 * @param lineWidth   Width of the rectangle lines
 * @param strokeStyle Style for drawing the rectangle
 */
const drawRectangle = (
  ctx: CanvasRenderingContext2D,
  rect: number[],
  lineWidth: number,
  strokeStyle: string
): void => {
  const xBase = rect[0];
  const xEnd = rect[2];
  const yBase = rect[1];
  const yEnd = rect[3];

  const width = xEnd - xBase;
  const height = yEnd - yBase;

  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeStyle;
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
 * @param lineWidth   Width of the cross lines
 * @param strokeStyle Style for drawing the cross
 */
const drawCross = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  lineWidth: number,
  strokeStyle: string
): void => {
  ctx.lineWidth = lineWidth;
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
 * @param lineWidth   Width of the circle line
 * @param strokeStyle Style for drawing the circle
 */
const drawCircle = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  lineWidth: number,
  strokeStyle: string
): void => {
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeStyle;
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
  randomAround,
  toCanvasScale,
  toDefaultScale,
};
