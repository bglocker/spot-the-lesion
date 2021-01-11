import firebase from "firebase/app";
import {
  getMonthName,
  handleAuthError,
  handleFirebaseStorageError,
  handleFirestoreError,
  isAuthError,
  isFirebaseStorageError,
  isFirestoreError,
  logAuthError,
  logFirebaseStorageError,
  logFirestoreError,
} from "./firebaseUtils";
import constants from "../res/constants";

type AuthError = firebase.auth.AuthError;
type FirebaseStorageError = firebase.storage.FirebaseStorageError;
type FirestoreError = firebase.firestore.FirestoreError;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let spyConsole: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]>;

beforeAll(() => {
  spyConsole = jest.spyOn(console, "error").mockImplementation();
});

afterAll(() => spyConsole.mockRestore());

afterEach(() => spyConsole.mockClear());

describe("getMonthName", () => {
  it("correctly returns month name for valid month numbers", () => {
    const jan = getMonthName(0);
    const jul = getMonthName(6);

    expect(jan).toBe("Jan");
    expect(jul).toBe("Jul");
  });

  it("throws error for invalid month numbers", () => {
    expect(() => getMonthName(-1)).toThrow();
    expect(() => getMonthName(12)).toThrow();
  });
});

describe("isAuthError", () => {
  it("correctly identifies auth errors", () => {
    const error = { code: "auth/code" } as AuthError;

    const res = isAuthError(error);

    expect(res).toBe(true);
  });

  it("correctly identifies non-auth errors", () => {
    const error = { message: "other error" } as Error;

    const res = isAuthError(error);

    expect(res).toBe(false);
  });
});

describe("logAuthError", () => {
  it("correctly logs the error", () => {
    const error = { code: "auth/code", message: "auth error" } as AuthError;

    logAuthError(error);

    expect(spyConsole).toBeCalledWith(
      "Firebase auth error\n code: auth/code\n message: auth error"
    );
  });
});

describe("handleAuthError", () => {
  it("can be called with error only", () => {
    const error = { message: "" } as AuthError;

    handleAuthError(error);

    expect(spyConsole).toBeCalled();
  });

  it("correctly displays a general message", () => {
    const error = { message: "" } as AuthError;

    const mockEnqueueSnackbar = jest.fn();

    handleAuthError(error, mockEnqueueSnackbar);

    expect(spyConsole).toBeCalled();

    expect(mockEnqueueSnackbar).toBeCalledWith("Please try again.", constants.errorSnackbarOptions);
  });
});

describe("isFirebaseStorageError", () => {
  it("correctly identifies storage errors", () => {
    const error = { code: "storage/code" } as FirebaseStorageError;

    const res = isFirebaseStorageError(error);

    expect(res).toBe(true);
  });

  it("correctly identifies non-storage errors", () => {
    const error = { message: "other error" } as Error;

    const res = isFirebaseStorageError(error);

    expect(res).toBe(false);
  });
});

describe("logFirebaseStorageError", () => {
  it("correctly logs the error", () => {
    const error = { code: "storage/code", message: "storage error" } as FirebaseStorageError;

    logFirebaseStorageError(error);

    expect(spyConsole).toBeCalledWith(
      "Firebase storage error\n code: storage/code\n message: storage error"
    );
  });
});

describe("handleFirebaseStorageError", () => {
  it("can be called with error only", () => {
    const error = { code: "" } as FirebaseStorageError;

    handleFirebaseStorageError(error);

    expect(spyConsole).toBeCalled();
  });

  it("correctly displays a general message", () => {
    const error = { code: "" } as FirebaseStorageError;

    const mockEnqueueSnackbar = jest.fn();

    handleFirebaseStorageError(error, mockEnqueueSnackbar);

    expect(spyConsole).toBeCalled();

    expect(mockEnqueueSnackbar).toBeCalledWith("Please try again.", constants.errorSnackbarOptions);
  });

  it("correctly displays an internet connection message", () => {
    const error = { code: "storage/retry-limit-exceeded" } as FirebaseStorageError;

    const mockEnqueueSnackbar = jest.fn();

    handleFirebaseStorageError(error, mockEnqueueSnackbar);

    expect(spyConsole).toBeCalled();

    expect(mockEnqueueSnackbar).toBeCalledWith(
      "Please check your internet connection and try again.",
      constants.errorSnackbarOptions
    );
  });
});

describe("isFirestoreError", () => {
  it("correctly identifies firestore errors", () => {
    const error = { code: "internal" } as FirestoreError;

    const res = isFirestoreError(error);

    expect(res).toBe(true);
  });

  it("correctly identifies non-firestore errors", () => {
    const error = { message: "other error" } as Error;

    const res = isFirestoreError(error);

    expect(res).toBe(false);
  });
});

describe("logFirestoreError", () => {
  it("correctly logs the error", () => {
    const error = { code: "internal", message: "firestore error" } as FirestoreError;

    logFirestoreError(error);

    expect(spyConsole).toBeCalledWith(
      "Firebase firestore error\n code: internal\n message: firestore error"
    );
  });
});

describe("handleFirestoreError", () => {
  it("can be called with error only", () => {
    const error = { code: "internal" } as FirestoreError;

    handleFirestoreError(error);

    expect(spyConsole).toBeCalled();
  });

  it("correctly displays a general message", () => {
    const error = { code: "internal" } as FirestoreError;

    const mockEnqueueSnackbar = jest.fn();

    handleFirestoreError(error, mockEnqueueSnackbar);

    expect(spyConsole).toBeCalled();

    expect(mockEnqueueSnackbar).toBeCalledWith("Please try again.", constants.errorSnackbarOptions);
  });

  it("correctly displays an internet connection message", () => {
    const error = { code: "unavailable" } as FirestoreError;

    const mockEnqueueSnackbar = jest.fn();

    handleFirestoreError(error, mockEnqueueSnackbar);

    expect(spyConsole).toBeCalled();

    expect(mockEnqueueSnackbar).toBeCalledWith(
      "Please check your internet connection and try again.",
      constants.errorSnackbarOptions
    );
  });
});
