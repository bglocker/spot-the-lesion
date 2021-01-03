import doctor from "../../res/images/tutorial/doctor.png";
import start_screen from "../../res/images/tutorial/start screen.png";
import strategy_game from "../../res/images/tutorial/strategy_game.png";
import help from "../../res/images/tutorial/help.png";
import answer from "../../res/images/tutorial/answer.png";
import points from "../../res/images/tutorial/scoring.png";
import hourglass from "../../res/images/tutorial/hourglass.png";
import giftbox from "../../res/images/tutorial/giftbox.png";
import wrong_ai from "../../res/images/tutorial/wrong ai.png";
import ai_answer from "../../res/images/tutorial/right ai.png";
import calm from "../../res/images/tutorial/calm.png";
import hint from "../../res/images/tutorial/mystery.png";
import application from "../../res/images/tutorial/application.png";
import lesion from "../../res/images/tutorial/lesion.png";

const tutorialHowToPlayItems: TutorialItem[] = [
  {
    text: "Welcome to Spot-the-Lesion!",
    imageSrc: doctor,
  },
  {
    text:
      "You’ll receive a sample of a CT scan like this one below, and you’ll have to find the lesion present in it.",
    imageSrc: start_screen,
  },
  {
    text: "There are 2 game modes: competitive and casual",
    imageSrc: strategy_game,
  },
  {
    text:
      "In the competitive mode you have 10 seconds to click on the region of the scan where you think the lesion is located.",
    imageSrc: start_screen,
  },
  {
    text:
      "After 5 seconds, a hint will appear - the red circle indicates the part of the image which you should look at.",
    imageSrc: help,
  },
  {
    text: "When you click on the CT scan, an orange cross will appear",
    imageSrc: answer,
  },
  {
    text:
      "If your click was correct, then you’ll see a green (+) and points added in the card near the CT scan",
    imageSrc: points,
  },
  {
    text: "The faster you answer, the more points you score (10 * time remaining)...",
    imageSrc: hourglass,
  },
  {
    text: "...and if you answer without a hint, you get double the points",
    imageSrc: giftbox,
  },
  {
    text: "You’ll also see the AI’s prediction on the lesion, marked in red",
    imageSrc: wrong_ai,
  },
  {
    text: "Finally, you will see the correct answer marked in green.",
    imageSrc: ai_answer,
  },
  {
    text:
      "In the casual game mode, you can take your time when answering, as there is no time limit per picture",
    imageSrc: calm,
  },
  {
    text: "If you want some help, you can use the hint button located on top of the CT scan image",
    imageSrc: hint,
  },
  {
    text: "You can play as much as you want and when you are done you can just submit your score",
    imageSrc: application,
  },
  {
    text: "That's it! Now, can you spot more lesions than the AI?",
  },
];

const tutorialLesionsItems: TutorialItem[] = [
  {
    text:
      "Hi! A lesion is any damage or abnormal change in the tissue of an organism, usually caused by disease or trauma. It can generally be identified as coloured differently than the rest of the tissue in the area. After playing a few rounds, you're likely to have an easy time figuring out where the lesion is.",
    imageSrc: lesion,
  },
];

export { tutorialHowToPlayItems, tutorialLesionsItems };
