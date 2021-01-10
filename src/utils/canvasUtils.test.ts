import "jest-canvas-mock";
import {
  drawCircle,
  drawCross,
  drawRectangle,
  drawStrokedText,
  mapClickToCanvas,
  mapRectangleToCanvasScale,
  toCanvasScale,
  toDefaultScale,
} from "./canvasUtils";
import constants from "../res/constants";

let ctx;

beforeAll(() => {
  const canvas = document.createElement("canvas");

  canvas.width = constants.defaultImageSize / 2;
  canvas.height = constants.defaultImageSize / 2;

  ctx = canvas.getContext("2d");
});

afterEach(() => {
  // eslint-disable-next-line no-underscore-dangle
  ctx.__clearEvents();
});

describe("drawCross", () => {
  it("correctly uses input parameters", () => {
    drawCross(ctx, 0, 0, 5, 3, "#ffa500");

    expect(ctx.lineWidth).toBe(3);
    expect(ctx.strokeStyle).toBe("#ffa500");
    expect(ctx.beginPath).toBeCalled();
    expect(ctx.moveTo).toBeCalledWith(-5, -5);
    expect(ctx.lineTo).toBeCalledWith(5, 5);
    expect(ctx.moveTo).toBeCalledWith(5, -5);
    expect(ctx.lineTo).toBeCalledWith(-5, 5);
    expect(ctx.stroke).toBeCalled();
  });

  it("renders correctly", () => {
    drawCross(ctx, 0, 0, 5, 3, "#ffa500");

    // eslint-disable-next-line no-underscore-dangle
    const events = ctx.__getEvents();

    expect(events).toMatchSnapshot();
  });
});

describe("drawCircle", () => {
  it("correctly uses input parameters", () => {
    drawCircle(ctx, 0, 0, 5, 3, "#ffa500");

    expect(ctx.lineWidth).toBe(3);
    expect(ctx.strokeStyle).toBe("#ffa500");

    expect(ctx.beginPath).toBeCalled();
    expect(ctx.arc).toBeCalledWith(0, 0, 5, 0, 2 * Math.PI);
    expect(ctx.stroke).toBeCalled();
  });

  it("renders correctly", () => {
    drawCircle(ctx, 0, 0, 5, 3, "#ffa500");

    // eslint-disable-next-line no-underscore-dangle
    const events = ctx.__getEvents();

    expect(events).toMatchSnapshot();
  });
});

describe("drawRectangle", () => {
  it("correctly uses input parameters", () => {
    drawRectangle(ctx, [0, 0, 5, 5], 3, "#ffa500");

    expect(ctx.lineWidth).toBe(3);
    expect(ctx.strokeStyle).toBe("#ffa500");

    expect(ctx.beginPath).toBeCalled();
    expect(ctx.rect).toBeCalledWith(0, 0, 5, 5);
    expect(ctx.stroke).toBeCalled();
  });

  it("throws error for invalid input rectangle", () => {
    expect(() => drawRectangle(ctx, [], 3, "#ffa500")).toThrow();
    expect(() => drawRectangle(ctx, [1, 3], 3, "#ffa500")).toThrow();
    expect(() => drawRectangle(ctx, [1, 3, 5, 6, 7], 3, "#ffa500")).toThrow();
  });

  it("renders correctly", () => {
    drawRectangle(ctx, [0, 0, 5, 5], 3, "#ffa500");

    // eslint-disable-next-line no-underscore-dangle
    const events = ctx.__getEvents();

    expect(events).toMatchSnapshot();
  });
});

describe("drawStrokedText", () => {
  it("correctly uses input parameters", () => {
    drawStrokedText(ctx, "text", 0, 0, "center", 10, 5, "#000000", "#ffffff");

    expect(ctx.font).toBe("10px Roboto");
    expect(ctx.lineJoin).toBe("miter");
    expect(ctx.miterLimit).toBe(2);

    expect(ctx.textAlign).toBe("center");
    expect(ctx.lineWidth).toBe(5);
    expect(ctx.strokeStyle).toBe("#000000");
    expect(ctx.fillStyle).toBe("#ffffff");

    expect(ctx.strokeText).toBeCalledWith("text", 0, 0);
    expect(ctx.fillText).toBeCalledWith("text", 0, 0);
  });

  it("renders correctly", () => {
    drawStrokedText(ctx, "text", 0, 0, "center", 10, 5, "#000000", "#ffffff");

    // eslint-disable-next-line no-underscore-dangle
    const events = ctx.__getEvents();

    expect(events).toMatchSnapshot();
  });
});

describe("toDefaultScale", () => {
  it("correctly maps to default scale", () => {
    expect(toDefaultScale(ctx, 100)).toBe(200);
  });

  it("is inverse of toCanvasScale", () => {
    expect(toDefaultScale(ctx, toCanvasScale(ctx, 200))).toBe(200);
  });
});

describe("toCanvasScale", () => {
  it("correctly maps to canvas scale", () => {
    expect(toCanvasScale(ctx, 200)).toBe(100);
  });

  it("is inverse of toDefaultScale", () => {
    expect(toCanvasScale(ctx, toDefaultScale(ctx, 200))).toBe(200);
  });
});

describe("mapRectangleToCanvasScale", () => {
  it("is equivalent to calling toCanvasScale on every coordinate", () => {
    const mappedRect = mapRectangleToCanvasScale(ctx, [1, 3, 5, 7]);

    const mapped1 = toCanvasScale(ctx, 1);
    const mapped3 = toCanvasScale(ctx, 3);
    const mapped5 = toCanvasScale(ctx, 5);
    const mapped7 = toCanvasScale(ctx, 7);

    expect(mappedRect).toStrictEqual([mapped1, mapped3, mapped5, mapped7]);
  });
});

describe("mapClickToCanvas", () => {
  let spyGetBoundingClientRect;

  beforeAll(() => {
    spyGetBoundingClientRect = jest.spyOn(Element.prototype, "getBoundingClientRect");
  });

  afterAll(() => spyGetBoundingClientRect.mockRestore());

  afterEach(() => spyGetBoundingClientRect.mockClear());

  it("correctly maps to canvas", () => {
    spyGetBoundingClientRect.mockReturnValue({
      height: ctx.canvas.height * 2,
      width: ctx.canvas.width * 2,
      left: 50,
      top: 50,
    });

    const mappedClick = mapClickToCanvas(ctx, 100, 200);

    expect(spyGetBoundingClientRect).toBeCalled();

    expect(mappedClick).toStrictEqual({ x: 25, y: 75 });
  });
});
