import question from "../../res/images/achievements/block.png";
import firstCorrect from "../../res/images/achievements/tick.png";
import firstCorrectWithoutHint from "../../res/images/achievements/investigation.png";
import firstCasualWin from "../../res/images/achievements/medal.png";
import firstCompetitiveWin from "../../res/images/achievements/trophy.png";
import fiveCorrectAnswers from "../../res/images/achievements/5.png";
import competitivePoints from "../../res/images/achievements/summit.png";
import allCorrectCompetitive from "../../res/images/achievements/brainstorm.png";
import fastAnswer from "../../res/images/achievements/flash.png";
import slowAnswer from "../../res/images/achievements/timer.png";
import correctAnswers from "../../res/images/achievements/confetti.png";

/* Placeholder for not yet unlocked achievements */
const lockedAchievement: AchievementItem = {
  key: "",
  title: "Not found yet",
  description: "Play more in order to unlock this achievement",
  image: question,
};

const achievementItems: AchievementItem[] = [
  {
    key: "firstCorrect",
    title: "First Step",
    description: "Congratulations! You have spotted your first lesion. How many more can you spot?",
    image: firstCorrect,
  },
  {
    key: "firstCorrectWithoutHint",
    title: "Independent Spotter",
    description:
      "Getting better, eh? You have spotted your first lesion without the help of a hint.",
    image: firstCorrectWithoutHint,
  },
  {
    key: "firstCasualWin",
    title: "Casually Winning",
    description: "Congratulations! You have won your first casual game. How about a new challenge?",
    image: firstCasualWin,
  },
  {
    key: "firstCompetitiveWin",
    title: "Competitive Winner",
    description:
      "Who said machines have outsmarted humans? You have beaten the AI in a race against time!",
    image: firstCompetitiveWin,
  },
  {
    key: "fiveCorrectSameRunCasual",
    title: "Practice makes perfect",
    description:
      "You are getting the hang of it! You have spotted five lesions in the same casual run.",
    image: fiveCorrectAnswers,
  },
  {
    key: "fiveCorrectSameRunCompetitive",
    title: "Master Spotter",
    description: "An impressive run! You have spotted five lesions in the same competitive run",
    image: fiveCorrectAnswers,
  },
  {
    key: "competitivePointsRun",
    title: "IT'S OVER 1000!!!",
    description: "1000 points?! You really have an eye for spotting lesions!",
    image: competitivePoints,
  },
  {
    key: "allCorrectCompetitive",
    title: "Perfectionist",
    description: "You got them all right! Have you considered a career in medicine?",
    image: allCorrectCompetitive,
  },
  {
    key: "fastAnswer",
    title: "The flash!",
    description: "You spotted a lesion in less than 2 seconds! Are you even human?",
    image: fastAnswer,
  },
  {
    key: "slowAnswer",
    title: "Nerves of steel",
    description:
      "You operate well under difficult circumstances. You spotted a lesion with less than 0.5 seconds remaining",
    image: slowAnswer,
  },
  {
    key: "twentyCorrectSameRunCasual",
    title: "Going the distance",
    description: "20 correct answers? You are spot-on!",
    image: correctAnswers,
  },
  {
    key: "fiftyCorrectSameRunCasual",
    title: "Still going?!",
    description: "50 correct answers? You really put the spot in spot-the-lesion!",
    image: correctAnswers,
  },
];

export { lockedAchievement, achievementItems };
