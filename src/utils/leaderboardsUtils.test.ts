import { getColorByRank } from "./leaderboardsUtils";
import colors from "../res/colors";

jest.mock("firebase/app");

describe("getColorByRank", () => {
  it("correctly returns colors by ranks", () => {
    const colorRank1 = getColorByRank(1);
    const colorRank2 = getColorByRank(2);
    const colorRank3 = getColorByRank(3);
    const colorRankDefault = getColorByRank(10);

    expect(colorRank1).toBe(colors.gold);
    expect(colorRank2).toBe(colors.silver);
    expect(colorRank3).toBe(colors.bronze);
    expect(colorRankDefault).toBe(colors.rowDefault);
  });
});
