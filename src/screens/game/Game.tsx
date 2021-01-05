import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Card } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";
import axios from "axios";
import clsx from "clsx";
import firebase from "firebase/app";
import { LoadingButton, NavigationAppBar } from "../../components";
import { useCanvasContext, useHeatmap, useInterval } from "../../hooks";
import { handleAxiosError, isAxiosError } from "../../utils/axiosUtils";
import {
  drawCircle,
  drawCross,
  drawRectangle,
  mapClickToCanvas,
  mapCoordinatesToCanvasScale,
  toCanvasScale,
  toDefaultScale,
} from "../../utils/canvasUtils";
import { handleImageLoadError, handleUncaughtError } from "../../utils/errorUtils";
import {
  getMonthName,
  handleFirebaseStorageError,
  handleFirestoreError,
  isFirebaseStorageError,
  isFirestoreError,
} from "../../utils/firebaseUtils";
import {
  drawRoundEndText,
  getAnnotationPath,
  getImagePath,
  getIntersectionOverUnion,
  unlockAchievement,
} from "../../utils/gameUtils";
import { randomAround } from "../../utils/numberUtils";
import GameTopBar from "./GameTopBar";
import GameSideBar from "./GameSideBar";
import SubmitScoreDialog from "./SubmitScoreDialog";
import ShareScoreDialog from "./ShareScoreDialog";
import ChallengeDialog from "./ChallengeDialog";
import ImageStatsDialog from "./ImageStatsDialog";
import useFileIdGenerator from "./useFileIdGenerator";
import colors from "../../res/colors";
import constants from "../../res/constants";
import variables from "../../res/variables";

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      height: "100%",
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center",
      [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
      },
      [theme.breakpoints.up("md")]: {
        flexDirection: "row",
      },
    },
    emptyDiv: {
      flex: 1,
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
    },
    topBarCanvasContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    canvasContainer: {
      position: "relative",
      padding: 8,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      [theme.breakpoints.down("sm")]: {
        height: "80vw",
        width: "80vw",
        maxWidth: "60vh",
        maxHeight: "60vh",
      },
      [theme.breakpoints.up("md")]: {
        height: "70vh",
        width: "70vh",
        maxWidth: "70vw",
        maxHeight: "70vw",
      },
    },
    canvas: {
      height: "100%",
      width: "100%",
      position: "absolute",
      left: 0,
      top: 0,
    },
    imageCanvas: {
      zIndex: 0,
    },
    animationCanvas: {
      zIndex: 1,
    },
    heatmapCanvas: {
      zIndex: 2,
    },
  })
);

const defaultImageData: FirestoreImageData = {
  clicks: [],
  correctClicks: 0,
  hintCount: 0,
  wrongClicks: 0,
};

const Game: React.FC<GameProps> = ({ gameMode, difficulty, challengeFileIds }: GameProps) => {
  const [heatmapLoading, setHeatmapLoading] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);

  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [imageStatsDialogOpen, setImageStatsDialogOpen] = useState(false);
  const [challengeDialogOpen, setChallengeDialogOpen] = useState(false);

  const [challengeLink, setChallengeLink] = useState("");

  const [roundNumber, setRoundNumber] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [hinted, setHinted] = useState(false);

  const [fileId, setFileId] = useState(-1);
  const [fileIds, setFileIds] = useState<number[]>([]);

  const [truth, setTruth] = useState<number[]>([]);
  const [predicted, setPredicted] = useState<number[]>([]);
  const [click, setClick] = useState<{ x: number; y: number } | null>(null);

  const [imageData, setImageData] = useState<FirestoreImageData>({
    ...defaultImageData,
    clicks: [],
  });

  const [roundLoading, setRoundLoading] = useState(false);
  const [roundEnded, setRoundEnded] = useState(false);
  const [showIncrement, setShowIncrement] = useState(false);

  const [roundRunning, setRoundRunning] = useState(false);
  const [roundTime, setRoundTime] = useState(variables.roundDuration);

  const [endRunning, setEndRunning] = useState(false);
  const [endTime, setEndTime] = useState(0);

  const [animationRunning, setAnimationRunning] = useState(false);
  const [animationPosition, setAnimationPosition] = useState(0);

  const [timerColor, setTimerColor] = useState(colors.timerInitial);

  const [hintedCurrent, setHintedCurrent] = useState(false);

  const [playerScore, setPlayerScore] = useState({ total: 0, round: 0 });
  const [playerCorrectAnswers, setPlayerCorrectAnswers] = useState(0);
  const [playerCorrectCurrent, setPlayerCorrectCurrent] = useState(false);

  const [aiScore, setAiScore] = useState({ total: 0, round: 0 });
  const [aiCorrectAnswers, setAiCorrectAnswers] = useState(0);

  const [context, canvasRef] = useCanvasContext();
  const [animationContext, animationCanvasRef] = useCanvasContext();

  const canvasContainer = useRef<HTMLDivElement>(null);

  const getNewFileId = useFileIdGenerator(difficulty, challengeFileIds);

  const { enqueueSnackbar } = useSnackbar();

  const history = useHistory();

  const classes = useStyles();

  /**
   * Round timer
   *
   * Decrement roundTime by 100, every 100ms
   *
   * Running only in competitive mode, while roundRunning is true
   */
  useInterval(
    () => setRoundTime((prevState) => prevState - 100),
    roundRunning && gameMode === "competitive" ? 100 : null
  );

  /**
   * Draw the hint circle
   */
  const drawHint = useCallback(() => {
    setHintedCurrent(true);
    setHinted(true);

    const radius = toCanvasScale(context, variables.hintRadius);
    const hintRange = toCanvasScale(context, constants.hintRange);

    const x = randomAround(Math.round(truth[0] + (truth[2] - truth[0]) / 2), hintRange);
    const y = randomAround(Math.round(truth[1] + (truth[3] - truth[1]) / 2), hintRange);

    drawCircle(context, x, y, radius, variables.hintLineWidth, colors.hint);
  }, [context, truth]);

  /**
   * Round timer based events
   */
  useEffect(() => {
    if (!roundRunning) {
      return;
    }

    if (roundTime === variables.hintTime) {
      /*
       * set timer color to timer orange
       * show hint
       */
      setTimerColor(colors.timerOrange);

      drawHint();
    } else if (roundTime === constants.redTime) {
      /*
       * set timer color to timer red
       */
      setTimerColor(colors.timerRed);
    } else if (roundTime === 0) {
      /*
       * start end timer and stop roundNumber timer
       */
      setEndRunning(true);
      setRoundRunning(false);
    }
  }, [roundRunning, roundTime, drawHint]);

  /**
   * End timer
   *
   * Increment endTime by 100, every 100ms
   *
   * Running only while endRunning is true
   */
  useInterval(() => setEndTime((prevState) => prevState + 100), endRunning ? 100 : null);

  /**
   * Upload the player click in order to gather statistics and generate heatmaps
   *
   * @param x       Width coordinate
   * @param y       Height coordinate
   * @param correct Whether click was correct
   */
  const uploadClick = useCallback(
    async (x: number, y: number, correct: boolean) => {
      const newClick = {
        x: toDefaultScale(context, x),
        y: toDefaultScale(context, y),
        clickCount: 1,
      };

      const { clicks, correctClicks, hintCount, wrongClicks } = imageData;

      /* Locate (if present) existing click with same coordinates */
      const existingClick = clicks.find((clk) => clk.x === newClick.x && clk.y === newClick.y);

      /* If not found, append to array, otherwise increment clickCount */
      if (existingClick === undefined) {
        clicks.push(newClick);
      } else {
        existingClick.clickCount += 1;
      }

      const docName = fileId.toString();

      const newImageData = {
        clicks,
        correctClicks: correctClicks + (correct ? 1 : 0),
        wrongClicks: wrongClicks + (correct ? 0 : 1),
        hintCount: hintCount + (hintedCurrent ? 1 : 0),
      };

      try {
        await firebase
          .firestore()
          .collection(constants.images(difficulty))
          .doc(docName)
          .update(newImageData);
      } catch (error) {
        if (isFirestoreError(error)) {
          handleFirestoreError(error);
        } else {
          handleUncaughtError(error, "uploadClick");
        }
      }
    },
    [context, difficulty, fileId, hintedCurrent, imageData]
  );

  /**
   * End timer based events
   */
  useEffect(() => {
    if (!endRunning) {
      return;
    }

    if (endTime === 0) {
      /*
       * 0 seconds passed
       *
       * draw player click (if available)
       * start animation timer and pause end timer
       */
      if (click) {
        const { x, y } = click;

        drawCross(context, x, y, constants.clickSize, constants.clickLineWidth, colors.click);
      }

      enqueueSnackbar("The system is thinking...", constants.informationSnackbarOptions);

      setAnimationRunning(true);
      setEndRunning(false);
    } else if (endTime === constants.drawPredictedTime) {
      /*
       * draw predicted rectangle
       */
      drawRectangle(context, predicted, constants.predictedLineWidth, colors.predicted);
    } else if (endTime === constants.drawTruthTime) {
      /*
       * draw truth rectangle
       */
      drawRectangle(context, truth, constants.truthLineWidth, colors.truth);
    } else if (endTime === constants.evaluationTime) {
      /*
       * evaluate player
       * upload player click
       * draw round end text
       * evaluate AI
       * retrieve image statistics
       * stop end timer
       * end round
       */
      enqueueSnackbar("Checking results...", constants.informationSnackbarOptions);

      if (click) {
        const { x, y } = click;

        /* Player was successful if the click coordinates are inside the truth rectangle */
        const playerCorrect = truth[0] <= x && x <= truth[2] && truth[1] <= y && y <= truth[3];

        uploadClick(x, y, playerCorrect).then(() => {});

        if (playerCorrect) {
          /* Casual Mode: half a point, doubled if no hint received */
          const casualScore = 0.5 * (hintedCurrent ? 1 : 2);

          /* Competitive Mode: function of round time left, doubled if no hint received */
          const competitiveScore = Math.round(roundTime / 100) * (hintedCurrent ? 1 : 2);

          const roundScore = gameMode === "casual" ? casualScore : competitiveScore;

          setPlayerScore(({ total }) => ({ total, round: roundScore }));
          setPlayerCorrectAnswers((prevState) => prevState + 1);
          setPlayerCorrectCurrent(true);
        }

        const text = playerCorrect ? "Well spotted!" : "Missed!";
        const textColor = playerCorrect ? colors.playerCorrect : colors.playerIncorrect;

        drawRoundEndText(context, text, textColor);
      } else {
        drawRoundEndText(context, "Too slow!", colors.playerIncorrect);
      }

      const intersectionOverUnion = getIntersectionOverUnion(truth, predicted);

      /* AI was successful if the ratio of the intersection over the union is greater than 0.5 */
      const aiCorrect = intersectionOverUnion > 0.5;

      if (aiCorrect) {
        /* Casual mode: one point */
        const casualScore = 1;

        /* Competitive mode: function of prediction accuracy and constant increase rate */
        const competitiveRoundScore = Math.round(
          intersectionOverUnion * variables.aiScoreMultiplier
        );

        const roundScore = gameMode === "casual" ? casualScore : competitiveRoundScore;

        setAiScore(({ total }) => ({ total, round: roundScore }));
        setAiCorrectAnswers((prevState) => prevState + 1);
      }

      setRoundEnded(true);
      setEndRunning(false);
    }
  }, [
    click,
    context,
    endRunning,
    endTime,
    enqueueSnackbar,
    fileId,
    gameMode,
    hintedCurrent,
    predicted,
    roundTime,
    truth,
    uploadClick,
  ]);

  /**
   * Animation timer
   *
   * Increment animationPosition by 1 (tempo based on set animation time and number of search cubes)
   *
   * Running only while animationRunning is true
   */
  useInterval(
    () => setAnimationPosition((prevState) => prevState + 1),
    animationRunning
      ? Math.round(variables.animationDuration / constants.animationCubesNumber ** 2)
      : null
  );

  /**
   * Animation timer based events
   */
  useEffect(() => {
    if (!animationRunning) {
      return;
    }

    /* Clear previous cube */
    animationContext.clearRect(0, 0, animationContext.canvas.width, animationContext.canvas.height);

    /* Stop when all cube positions were reached, and resume end timer with one tick passed */
    if (animationPosition === constants.animationCubesNumber ** 2) {
      setAnimationRunning(false);
      setEndTime((prevState) => prevState + 100);
      setEndRunning(true);
      return;
    }

    const cubeSide = animationContext.canvas.width / constants.animationCubesNumber;
    const baseX = (animationPosition % constants.animationCubesNumber) * cubeSide;
    const baseY = Math.floor(animationPosition / constants.animationCubesNumber) * cubeSide;
    const cube = [
      Math.round(baseX),
      Math.round(baseY),
      Math.round(baseX + cubeSide),
      Math.round(baseY + cubeSide),
    ];

    drawRectangle(animationContext, cube, constants.animationLineWidth, colors.animation);
  }, [animationContext, animationPosition, animationRunning]);

  /**
   * Round end based events
   */
  useEffect(() => {
    if (!roundEnded || roundLoading) {
      return;
    }

    setShowIncrement(true);

    if (gameMode === "competitive" && roundNumber === variables.roundsNumber) {
      setGameEnded(true);
    }

    const unlockAchievementHandler = (key, msg) => unlockAchievement(key, msg, enqueueSnackbar);

    /* Check general achievements */
    if (playerCorrectCurrent) {
      unlockAchievementHandler("firstCorrect", "Achievement! First Step!");

      if (!hintedCurrent) {
        unlockAchievementHandler("firstCorrectWithoutHint", "Achievement! Independent Spotter!");
      }
    }

    /* Check casual achievements */
    if (gameMode === "casual") {
      if (playerCorrectAnswers === 5) {
        unlockAchievementHandler(
          "fiveCorrectSameRunCasual",
          "Achievement! Practice makes perfect!"
        );
      }

      if (playerCorrectAnswers === 20) {
        unlockAchievementHandler("twentyCorrectSameRunCasual", "Achievement! Going the distance!");
      }

      if (playerCorrectAnswers === 50) {
        unlockAchievementHandler("fiftyCorrectSameRunCasual", "Achievement! Still going?!");
      }
    }

    /* Check competitive achievements */
    if (gameMode === "competitive") {
      if (playerCorrectCurrent && roundTime > variables.roundDuration - 2000) {
        unlockAchievementHandler("fastAnswer", "Achievement! The flash!");
      }

      if (playerCorrectCurrent && roundTime < variables.roundDuration - 9500) {
        unlockAchievementHandler("slowAnswer", "Achievement! Nerves of steel!");
      }

      if (playerScore.total + playerScore.round >= 1000) {
        unlockAchievementHandler("competitivePoints", "Achievement! IT'S OVER 1000!!!");
      }
    }
  }, [
    enqueueSnackbar,
    gameMode,
    hintedCurrent,
    playerCorrectAnswers,
    playerCorrectCurrent,
    playerScore,
    roundEnded,
    roundLoading,
    roundNumber,
    roundTime,
  ]);

  /**
   * Game end based events
   */
  useEffect(() => {
    if (!gameEnded) {
      return;
    }

    const unlockAchievementHandler = (key, msg) => unlockAchievement(key, msg, enqueueSnackbar);

    if (playerCorrectAnswers === 5) {
      unlockAchievementHandler("fiveCorrectSameRunCompetitive", "Achievement! Master Spotter!");
    }

    if (playerCorrectAnswers === variables.roundsNumber) {
      unlockAchievementHandler("allCorrectCompetitive", "Achievement! Perfectionist!");
    }

    if (playerScore.total + playerScore.round > aiScore.total + aiScore.round) {
      unlockAchievementHandler("firstCompetitiveWin", "Achievement! Competitive Winner!");
    }
  }, [aiScore, enqueueSnackbar, gameEnded, playerCorrectAnswers, playerScore]);

  /**
   * Firestore image document listener
   */
  useEffect(() => {
    if (fileId === -1) {
      return () => {};
    }

    const docName = fileId.toString();

    const unsubscribe = firebase
      .firestore()
      .collection(constants.images(difficulty))
      .doc(docName)
      .onSnapshot(
        (snapshot) => {
          if (snapshot.exists) {
            setImageData(snapshot.data() as FirestoreImageData);
          }
        },
        (error) => handleFirestoreError(error)
      );

    return () => unsubscribe();
  }, [difficulty, fileId]);

  /**
   * Called when the canvas is clicked
   *
   * @param event Mouse event, used to get click position
   */
  const onCanvasClick = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!roundRunning) {
      return;
    }

    setClick(mapClickToCanvas(context, event));
    setEndRunning(true);
    setRoundRunning(false);
  };

  /**
   * Loads the annotation data for the given annotationId
   *
   * @param annotationId Number of the annotation to load
   *
   * @return Void promise
   */
  const loadAnnotation = async (annotationId: number): Promise<void> => {
    const url = await firebase
      .storage()
      .ref(getAnnotationPath(annotationId, difficulty))
      .getDownloadURL();

    const response = await axios.get<AnnotationData>(url, { timeout: constants.axiosTimeout });

    const annotation = response.data;

    setTruth(mapCoordinatesToCanvasScale(context, annotation.truth));
    setPredicted(mapCoordinatesToCanvasScale(context, annotation.predicted));
  };

  /**
   * Loads the image from for the given imageId
   *
   * @param imageId Number of the image to load
   *
   * @return Void promise
   */
  const loadImage = (imageId: number): Promise<void> =>
    new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.drawImage(image, 0, 0, context.canvas.width, context.canvas.height);

        resolve();
      };

      image.onerror = (_ev, _src, _line, _col, error) => reject(error);

      /* Set source after onload to ensure onload gets called (in case the image is cached) */
      firebase
        .storage()
        .ref(getImagePath(imageId, difficulty))
        .getDownloadURL()
        .then((url) => {
          image.src = url;
        })
        .catch((error) => reject(error));
    });

  /**
   * Starts a new round, loading a new annotation - image pair
   */
  const startRound = async () => {
    setRoundLoading(true);

    setShowIncrement(false);

    setPlayerScore(({ total, round }) => ({ total: total + round, round: 0 }));
    setAiScore(({ total, round }) => ({ total: total + round, round: 0 }));

    /* Get a new file id and load the corresponding annotation and image */
    const newFileId = getNewFileId();

    try {
      await loadAnnotation(newFileId);
      await loadImage(newFileId);

      setFileId(newFileId);

      if (gameMode === "competitive") {
        setFileIds((prevState) => [...prevState, newFileId]);
      }

      setRoundNumber((prevState) => prevState + 1);

      /* Reset game state */
      setRoundTime(variables.roundDuration);
      setEndTime(0);
      setAnimationPosition(0);

      setHintedCurrent(false);
      setTimerColor(colors.timerInitial);

      setClick(null);

      setImageData({ ...defaultImageData, clicks: [] });

      setPlayerCorrectCurrent(false);

      setShowHeatmap(false);

      setRoundEnded(false);
      setRoundRunning(true);
    } catch (error) {
      console.error(`Annotation/Image load error\n fileId: ${newFileId}`);

      if (isFirebaseStorageError(error)) {
        handleFirebaseStorageError(error, enqueueSnackbar);
      } else if (isAxiosError(error)) {
        handleAxiosError(error, enqueueSnackbar);
      } else {
        handleImageLoadError(error, enqueueSnackbar);
      }
    } finally {
      setRoundLoading(false);
    }
  };

  /**
   * Load the data to display on the given heatmap instance
   *
   * @param instance Heatmap instance
   */
  const loadHeatmapData = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (instance: any): Promise<void> => {
      setHeatmapLoading(true);

      /* TODO: check bug with set width and height for heatmap canvas */
      // eslint-disable-next-line no-underscore-dangle
      const { ctx } = instance._renderer;

      let max = 0;
      imageData.clicks.forEach((element) => {
        max = Math.max(max, element.clickCount);
      });

      const heatmapData = {
        min: 0,
        max,
        data: imageData.clicks.map(({ x, y, clickCount }) => ({
          x: toCanvasScale(ctx, x),
          y: toCanvasScale(ctx, y),
          clickCount,
        })),
      };

      instance.setData(heatmapData);

      setHeatmapLoading(false);
    },
    [imageData.clicks]
  );

  /**
   * Submit the achieved score for the given username
   * (Over)write if achieved score is greater than stored one, or there is no stored value
   *
   * @param username Player username to identify achieved score
   *
   * @return True if successful, false otherwise
   */
  const submitScore = async (username: string): Promise<void> => {
    const date = new Date();

    const playerScoreFull = playerScore.total + playerScore.round;
    const aiScoreFull = aiScore.total + aiScore.round;

    const scoreData: FirestoreScoreData = {
      user: username,
      score: playerScoreFull,
      ai_score: aiScoreFull,
      correct_player_answers: playerCorrectAnswers,
      usedHints: hinted,
      correct_ai_answers: aiCorrectAnswers,
      day: date.getDate(),
      month: getMonthName(date.getMonth()),
      year: date.getFullYear(),
    };

    const scores = gameMode === "casual" ? constants.scoresCasual : constants.scoresCompetitive;

    const docName = `${scoreData.year}.${scoreData.month}.${scoreData.day}.${scoreData.user}`;

    try {
      const snapshot = await firebase.firestore().collection(scores).doc(docName).get();

      /* Set if first time played today, or a higher score was achieved */
      if (!snapshot.exists || (snapshot.data() as FirestoreScoreData).score < scoreData.score) {
        await firebase.firestore().collection(scores).doc(docName).set(scoreData);
      }

      enqueueSnackbar("Score successfully submitted!", constants.successSnackbarOptions);

      if (playerScoreFull > aiScoreFull && gameMode === "casual") {
        unlockAchievement("firstCasualWin", "Achievement! Casually Winning!", enqueueSnackbar);
      }

      history.go(-2);
    } catch (error) {
      if (isFirestoreError(error)) {
        handleFirestoreError(error, enqueueSnackbar);
      } else {
        handleUncaughtError(error, "submitScore", enqueueSnackbar);
      }
    }
  };

  const createChallenge = async () => {
    const shortLinksUrl = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${process.env.REACT_APP_FIREBASE_API_KEY}`;
    const fileIdsString = JSON.stringify(fileIds);

    const link = `http://${window.location.host}/spot-the-lesion/challenge?gameMode=${gameMode}&difficulty=${difficulty}&fileIds=${fileIdsString}`;

    const title = "Spot the Lesion";

    const description = `I just scored ${
      playerScore.total + playerScore.round
    }! Think you can beat that?`;

    try {
      const response = await axios.post(
        shortLinksUrl,
        {
          dynamicLinkInfo: {
            domainUriPrefix: constants.domainUriPrefix,
            link,
            socialMetaTagInfo: {
              socialTitle: title,
              socialDescription: description,
            },
          },
          suffix: {
            option: "SHORT",
          },
        },
        { timeout: constants.axiosTimeout }
      );

      setChallengeLink(response.data.shortLink);

      setChallengeDialogOpen(true);
    } catch (error) {
      if (isAxiosError(error)) {
        handleAxiosError(error, enqueueSnackbar);
      } else {
        handleUncaughtError(error, "createInvite", enqueueSnackbar);
      }
    }
  };

  const onChallengeClose = () => setChallengeDialogOpen(false);

  const onToggleHeatmap = () => {
    setHeatmapLoading(!showHeatmap);
    setShowHeatmap((prevState) => !prevState);
  };

  const onSubmitClick = () => setSubmitDialogOpen(true);

  const onSubmitClose = () => setSubmitDialogOpen(false);

  const onShareClick = () => setShareDialogOpen(true);

  const onShareClose = () => setShareDialogOpen(false);

  const onImageStatsClick = () => setImageStatsDialogOpen(true);

  const onImageStatsClose = () => setImageStatsDialogOpen(false);

  useHeatmap(
    showHeatmap,
    loadHeatmapData,
    canvasContainer,
    `${classes.canvas} ${classes.heatmapCanvas}`
  );

  return (
    <>
      <NavigationAppBar showBack>
        <Button color="inherit" disabled={!roundEnded || roundLoading} onClick={onImageStatsClick}>
          Show Image Stats
        </Button>

        <LoadingButton
          color="inherit"
          disabled={!roundEnded || roundLoading}
          loading={heatmapLoading}
          onClick={onToggleHeatmap}
        >
          {showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
        </LoadingButton>
      </NavigationAppBar>

      <div className={classes.container}>
        <div className={classes.emptyDiv} />

        <div className={classes.topBarCanvasContainer}>
          <GameTopBar
            gameMode={gameMode}
            hintDisabled={hintedCurrent || !roundRunning}
            onHintClick={drawHint}
            roundTime={roundTime}
            timerColor={timerColor}
          />

          <Card className={classes.canvasContainer} ref={canvasContainer}>
            <canvas
              className={clsx(classes.canvas, classes.imageCanvas)}
              ref={canvasRef}
              height={constants.canvasSize}
              width={constants.canvasSize}
            />

            <canvas
              className={clsx(classes.canvas, classes.animationCanvas)}
              ref={animationCanvasRef}
              height={constants.canvasSize}
              width={constants.canvasSize}
              onClick={onCanvasClick}
            />
          </Card>
        </div>

        <GameSideBar
          gameMode={gameMode}
          gameStarted={roundNumber > 0}
          gameEnded={gameEnded}
          roundEnded={roundEnded}
          roundLoading={roundLoading}
          showIncrement={showIncrement}
          onStartRound={startRound}
          onSubmitClick={onSubmitClick}
          onShareClick={onShareClick}
          onChallenge={createChallenge}
          playerScore={playerScore}
          aiScore={aiScore}
        />
      </div>

      <SubmitScoreDialog open={submitDialogOpen} onClose={onSubmitClose} onSubmit={submitScore} />

      <ShareScoreDialog
        open={shareDialogOpen}
        onClose={onShareClose}
        score={playerScore.total + playerScore.round}
      />

      <ChallengeDialog open={challengeDialogOpen} onClose={onChallengeClose} link={challengeLink} />

      <ImageStatsDialog
        open={imageStatsDialogOpen}
        onClose={onImageStatsClose}
        imageData={imageData}
      />
    </>
  );
};

export default Game;
