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
  ];

  public static tableNames = ["daily-scores", "monthly-scores", "alltime-scores"];

  // Firebase Collections
  public static DAILY_LEADERBOARD = "daily-scores";

  public static MONTHLY_LEADERBOARD = "monthly-scores";

  public static ALL_TIME_LEADERBOARD = "alltime-scores";
}
