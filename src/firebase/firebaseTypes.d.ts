interface FirestoreImageData {
  clicks: { clickCount: number; x: number; y: number }[];
  correctClicks: number;
  hintCount: number;
  wrongClicks: number;
}

type Month =
  | "Jan"
  | "Feb"
  | "Mar"
  | "Apr"
  | "May"
  | "Jun"
  | "Jul"
  | "Aug"
  | "Sep"
  | "Oct"
  | "Nov"
  | "Dec";

interface FirestoreScoreData {
  ai_score: number;
  correct_ai_answers: number;
  correct_player_answers: number;
  day: number;
  month: Month;
  score: number;
  usedHints: boolean;
  user: string;
  year: number;
}
