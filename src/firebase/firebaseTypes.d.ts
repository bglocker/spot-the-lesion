interface FirestoreImageData {
  clicks: { clickCount: number; x: number; y: number }[];
  correctClicks: number;
  hintCount: number;
  wrongClicks: number;
}

interface FirestoreScoreData {
  ai_score: number;
  correct_ai_answers: number;
  correct_player_answers: number;
  day: number;
  month:
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
  score: number;
  usedHints: boolean;
  user: string;
  year: number;
}
