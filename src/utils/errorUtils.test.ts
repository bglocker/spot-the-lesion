import {
  assertUnreachable,
  handleImageLoadError,
  handleUncaughtError,
  logImageLoadError,
  logUncaughtError,
} from "./errorUtils";
import constants from "../res/constants";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let spyConsole: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]>;

beforeAll(() => {
  spyConsole = jest.spyOn(console, "error").mockImplementation();
});

afterAll(() => spyConsole.mockRestore());

afterEach(() => spyConsole.mockClear());

describe("assertUnreachable", () => {
  it("throws error on any value", () => {
    const val = {} as never;

    expect(() => assertUnreachable(val)).toThrow();
  });
});

describe("logImageLoadError", () => {
  it("correctly logs the error", () => {
    const error = { message: "image load error" } as Error;

    logImageLoadError(error);

    expect(spyConsole).toBeCalledWith("Image loading error\n message: image load error");
  });
});

describe("handleImageLoadError", () => {
  it("can be called with error only", () => {
    const error = { message: "" } as Error;

    handleImageLoadError(error);

    expect(spyConsole).toBeCalled();
  });

  it("correctly displays a general message", () => {
    const error = { message: "" } as Error;

    const mockEnqueueSnackbar = jest.fn();

    handleImageLoadError(error, mockEnqueueSnackbar);

    expect(spyConsole).toBeCalled();

    expect(mockEnqueueSnackbar).toBeCalledWith("Please try again.", constants.errorSnackbarOptions);
  });
});

describe("logUncaughtError", () => {
  it("correctly logs the error", () => {
    const error = { message: "uncaught error message" } as Error;

    logUncaughtError(error, "testFunction");

    expect(spyConsole).toBeCalledWith("Uncaught error in testFunction\n uncaught error message");
  });
});

describe("handleUncaughtError", () => {
  it("can be called with error and fnName only", () => {
    const error = { message: "" } as Error;

    handleUncaughtError(error, "testFunction");

    expect(spyConsole).toBeCalled();
  });

  it("correctly displays a general message", () => {
    const error = { message: "" } as Error;

    const mockEnqueueSnackbar = jest.fn();

    handleUncaughtError(error, "testFunction", mockEnqueueSnackbar);

    expect(spyConsole).toBeCalled();

    expect(mockEnqueueSnackbar).toBeCalledWith("Please try again.", constants.errorSnackbarOptions);
  });
});
