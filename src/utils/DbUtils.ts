export default class DbUtils {
  public static monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ] as const;

  public static GOLD = "#FFCC00";

  public static SILVER = "#A9A9A9";

  public static BRONZE = "#CD7F32";

  public static DEFAULT_ROW_COLOUR = "#C4DFE6";

  public static tableNames = ["daily-scores", "monthly-scores", "alltime-scores"];

  public static gameNames = ["casual", "competitive"];

  public static LEADERBOARD = "leaderboard";

  public static LEADERBOARD_CASUAL = "leaderboard_casual";

  public static LEADERBOARD_COMPETITIVE = "leaderboard_competitive";

  public static IMAGES = "images";
}
