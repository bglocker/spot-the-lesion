import firebase from "firebase/app";
import { getMonthName } from "./firebaseUtils";
import colors from "../res/colors";
import constants from "../res/constants";

/**
 * Given a rank, returns its corresponding color
 *
 * @param rank Rank number, starting from 1
 *
 * @return Color string
 */
const getColorByRank = (rank: number): string => {
  switch (rank) {
    case 1:
      return colors.gold;
    case 2:
      return colors.silver;
    case 3:
      return colors.bronze;
    default:
      return colors.rowDefault;
  }
};

/**
 * Given a time index and game mode index, creates a firestore query for the corresponding entries,
 * ordered decreasingly on score
 *
 * @param timeIndex     Time index (0 - Daily, 1 - Monthly, 2 - All)
 * @param gameModeIndex Game mode index (0 - Casual, 1 - Competitive)
 *
 * @return Firestore query
 */
const getQueryOnTimeAndGameMode = (
  timeIndex: number,
  gameModeIndex: number
): firebase.firestore.Query => {
  const date = new Date();

  const scores = gameModeIndex === 0 ? constants.scoresCasual : constants.scoresCompetitive;

  const collectionRef = firebase.firestore().collection(scores);

  switch (timeIndex) {
    case 0:
      return collectionRef
        .where("year", "==", date.getFullYear())
        .where("month", "==", getMonthName(date.getMonth()))
        .where("day", "==", date.getDate())
        .orderBy("score", "desc");
    case 1:
      return collectionRef
        .where("year", "==", date.getFullYear())
        .where("month", "==", getMonthName(date.getMonth()))
        .orderBy("score", "desc");
    case 2:
    default:
      return collectionRef.orderBy("score", "desc");
  }
};

export { getColorByRank, getQueryOnTimeAndGameMode };
