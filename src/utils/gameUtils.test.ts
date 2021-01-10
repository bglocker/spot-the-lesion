import {
  drawRoundEndText,
  getAnnotationPath,
  getDifficultyOrDefault,
  getFileIdsOrDefault,
  getFilesNumber,
  getGameModeOrDefault,
  getImagePath,
  getIntersectionOverUnion,
  unlockAchievement,
} from "./gameUtils";
import * as canvasUtils from "./canvasUtils";
import constants from "../res/constants";
import variables from "../res/variables";

jest.mock("./canvasUtils");

describe("drawRoundEndText", () => {
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

  it("correctly uses input parameters", () => {
    drawRoundEndText(ctx, "text", 24, 3, "black");

    expect(canvasUtils.drawStrokedText).toBeCalledWith(
      ctx,
      "text",
      128,
      26,
      "center",
      24,
      3,
      "white",
      "black"
    );
  });
});

describe("getIntersectionOverUnion", () => {
  it("correctly calculates ratio", () => {
    const rectA = [10, 10, 20, 20];
    const rectB = [15, 15, 25, 25];

    const res = getIntersectionOverUnion(rectA, rectB);

    expect(res).toBeCloseTo(0.17);
  });

  it("throws error for invalid input rectangles", () => {
    expect(() => getIntersectionOverUnion([], [])).toThrow();
    expect(() => getIntersectionOverUnion([1], [3, 4])).toThrow();
    expect(() => getIntersectionOverUnion([2, 5, 6, 9, 4], [3, 6, 0, 4, 5])).toThrow();
  });
});

describe("getAnnotationPath", () => {
  it("correctly creates the path to the annotation", () => {
    const res = getAnnotationPath(5, "easy");

    expect(res).toBe("annotation/easy/5.json");
  });
});

describe("getImagePath", () => {
  it("correctly creates the path to the image", () => {
    const res = getImagePath(5, "easy");

    expect(res).toBe("images/easy/5.png");
  });
});

describe("getFilesNumber", () => {
  it("correctly returns files number for valid difficulties", () => {
    const easyNumbers = getFilesNumber("easy");
    const mediumNumbers = getFilesNumber("medium");
    const hardNumbers = getFilesNumber("hard");

    expect(easyNumbers).toBe(variables.easyFilesNumber);
    expect(mediumNumbers).toBe(variables.mediumFilesNumber);
    expect(hardNumbers).toBe(variables.hardFilesNumber);
  });

  it("throws error for invalid difficulties", () => {
    expect(() => getFilesNumber("diff" as Difficulty)).toThrow();
  });
});

describe("getGameModeOrDefault", () => {
  it("returns input string for valid game modes", () => {
    const casual = getGameModeOrDefault("casual");
    const competitive = getGameModeOrDefault("competitive");

    expect(casual).toBe("casual");
    expect(competitive).toBe("competitive");
  });

  it("uses default value for invalid game modes", () => {
    const typo = getGameModeOrDefault("cas");

    expect(typo).toBe("casual");
  });

  it("uses given default value for invalid game modes", () => {
    const typo = getGameModeOrDefault("cas", "competitive");

    expect(typo).toBe("competitive");
  });
});

describe("getDifficultyOrDefault", () => {
  it("returns input string for valid difficulties", () => {
    const easy = getDifficultyOrDefault("easy");
    const medium = getDifficultyOrDefault("medium");

    expect(easy).toBe("easy");
    expect(medium).toBe("medium");
  });

  it("uses default value for invalid difficulties", () => {
    const typo = getDifficultyOrDefault("esy");

    expect(typo).toBe("easy");
  });

  it("uses given default value for invalid difficulties", () => {
    const typo = getDifficultyOrDefault("esy", "medium");

    expect(typo).toBe("medium");
  });
});

describe("getFileIdsOrDefault", () => {
  it("correctly parses valid file ids strings", () => {
    const fileIds = "[1, 3, 5, 7]";

    const fileIdsArray = getFileIdsOrDefault(fileIds);

    expect(fileIdsArray).toStrictEqual([1, 3, 5, 7]);
  });

  it("uses undefined for invalid file ids strings", () => {
    const nullFileIds = null;
    const shortFileIds = "[";
    const missingStartFileIds = "2, 3, 4]";
    const missingEndFileIds = "[5, 6, 7";
    const parsingInvalidFileIds = "[1, 2, a, b, 3]";

    expect(getFileIdsOrDefault(nullFileIds)).toBeUndefined();
    expect(getFileIdsOrDefault(shortFileIds)).toBeUndefined();
    expect(getFileIdsOrDefault(missingStartFileIds)).toBeUndefined();
    expect(getFileIdsOrDefault(missingEndFileIds)).toBeUndefined();
    expect(getFileIdsOrDefault(parsingInvalidFileIds)).toBeUndefined();
  });

  it("uses given default value for invalid file ids strings", () => {
    const invalidFileIds = "[";

    const fileIdsArray = getFileIdsOrDefault(invalidFileIds, [5, 6]);

    expect(fileIdsArray).toStrictEqual([5, 6]);
  });
});

describe("unlockAchievement", () => {
  let spyGetItem: jest.SpyInstance<string | null, [key: string]>;
  let spySetItem: jest.SpyInstance<void, [key: string, value: string]>;

  beforeAll(() => {
    spyGetItem = jest.spyOn(Storage.prototype, "getItem").mockImplementation();
    spySetItem = jest.spyOn(Storage.prototype, "setItem").mockImplementation();
  });

  afterAll(() => {
    spyGetItem.mockRestore();
    spySetItem.mockRestore();
  });

  afterEach(() => {
    spyGetItem.mockClear();
    spySetItem.mockClear();
  });

  it("displays message for first time unlocked achievements", () => {
    const key = "achievementTestKey";
    const message = "achievement unlocked message";

    const mockEnqueueSnackbar = jest.fn();

    spyGetItem.mockReturnValue(null);

    unlockAchievement(key, message, mockEnqueueSnackbar);

    expect(spyGetItem).toBeCalledWith(key);

    expect(mockEnqueueSnackbar).toBeCalledWith(message, constants.achievementSnackbarOptions);

    expect(spySetItem).toBeCalledWith(key, "true");
  });

  it("doesn't do anything for already unlocked achievements", () => {
    const key = "achievementTestKey";
    const message = "achievement unlocked message";

    const mockEnqueueSnackbar = jest.fn();

    spyGetItem.mockReturnValue("true");

    unlockAchievement(key, message, mockEnqueueSnackbar);

    expect(spyGetItem).toBeCalledWith(key);

    expect(mockEnqueueSnackbar).not.toBeCalled();

    expect(spySetItem).not.toBeCalled();
  });
});
