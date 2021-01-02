import "jest-canvas-mock";
import { drawCircle, drawCross } from "../../utils/canvasUtils";

let ctx;

beforeEach(() => {
  ctx = new CanvasRenderingContext2D();
});

describe("Draw", () => {
  it("calls context to draw a cross", () => {
    drawCross(ctx, 0, 0, 1, 1, "#ffa500");

    expect(ctx.lineWidth).toBe(1);
    expect(ctx.strokeStyle).toBe("#ffa500");
    expect(ctx.beginPath).toBeCalled();
    expect(ctx.moveTo).toBeCalledWith(-1, -1);
    expect(ctx.lineTo).toBeCalledWith(1, 1);
    expect(ctx.moveTo).toBeCalledWith(1, -1);
    expect(ctx.lineTo).toBeCalledWith(-1, 1);
    expect(ctx.stroke).toBeCalled();
  });

  it("calls context to draw a circle", () => {
    drawCircle(ctx, 0, 0, 1, 1, "#ffa500");

    expect(ctx.lineWidth).toBe(1);
    expect(ctx.strokeStyle).toBe("#ffa500");
    expect(ctx.beginPath).toBeCalled();
    expect(ctx.arc).toBeCalledWith(0, 0, 1, 0, 2 * Math.PI);
    expect(ctx.stroke).toBeCalled();
  });
});
