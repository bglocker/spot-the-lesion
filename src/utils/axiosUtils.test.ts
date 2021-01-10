import { AxiosError } from "axios";
import { handleAxiosError, logAxiosError } from "./axiosUtils";
import constants from "../res/constants";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let spyConsole: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]>;

beforeAll(() => {
  spyConsole = jest.spyOn(console, "error").mockImplementation();
});

afterAll(() => spyConsole.mockRestore());

afterEach(() => spyConsole.mockClear());

describe("logAxiosError", () => {
  it("correctly logs a response error", () => {
    const error = {
      response: {
        status: 500,
        headers: "response header",
        data: "response data",
      },
    } as AxiosError;

    logAxiosError(error);

    expect(spyConsole).toBeCalledWith(
      "Axios response error\n status: 500\n headers: response header\n data: response data"
    );
  });

  it("correctly logs a request error", () => {
    const error = { request: "request data" } as AxiosError;

    logAxiosError(error);

    expect(spyConsole).toBeCalledWith("Axios no response error\n request: request data");
  });

  it("correctly logs an unknown error", () => {
    const error = { message: "error message" } as AxiosError;

    logAxiosError(error);

    expect(spyConsole).toBeCalledWith("Axios unknown error\n message: error message");
  });
});

describe("handleAxiosError", () => {
  it("can be called with error only", () => {
    const error = { message: "" } as AxiosError;

    handleAxiosError(error);

    expect(spyConsole).toBeCalled();
  });

  it("correctly displays a general message", () => {
    const error = { message: "" } as AxiosError;

    const mockEnqueueSnackbar = jest.fn();

    handleAxiosError(error, mockEnqueueSnackbar);

    expect(spyConsole).toBeCalled();

    expect(mockEnqueueSnackbar).toBeCalledWith("Please try again.", constants.errorSnackbarOptions);
  });

  it("correctly displays an internet connection message", () => {
    const error = { message: "timeout" } as AxiosError;

    const mockEnqueueSnackbar = jest.fn();

    handleAxiosError(error, mockEnqueueSnackbar);

    expect(spyConsole).toBeCalled();

    expect(mockEnqueueSnackbar).toBeCalledWith(
      "Please check your internet connection and try again.",
      constants.errorSnackbarOptions
    );
  });
});
