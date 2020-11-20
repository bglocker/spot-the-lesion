import React, { useCallback, useEffect, useRef, useState } from "react";
import { AppBar, Button, Card, IconButton, Toolbar, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { KeyboardBackspace } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import axios from "axios";
import { db, firebaseStorage } from "../../firebase/firebaseApp";
import GameTopBar from "./GameTopBar";
import GameSideBar from "./GameSideBar";
import SubmitScoreDialog from "./SubmitScoreDialog";
import {
  LoadingButton,
  useCanvasContext,
  useHeatmap,
  useInterval,
  useUniqueRandomGenerator,
} from "../../components";
import {
  drawCircle,
  drawCross,
  drawRectangle,
  drawStrokedText,
  mapClickToCanvas,
  mapCoordinatesToCanvasScale,
  randomAround,
  toCanvasScale,
  toDefaultScale,
} from "../../utils/canvasUtils";
import {
  getAnnotationPath,
  getImagePath,
  getIntersectionOverUnion,
  unlockAchievement,
} from "../../utils/GameUtils";
import { handleAxiosError, isAxiosError } from "../../utils/axiosUtils";
import { handleImageLoadError, handleUncaughtError } from "../../utils/errorUtils";
import {
  getMonthName,
  handleFirebaseStorageError,
  handleFirestoreError,
  isFirebaseStorageError,
  isFirestoreError,
} from "../../utils/firebaseUtils";
import colors from "../../res/colors";
import constants from "../../res/constants";
import DbUtils from "../../utils/DbUtils";
import ImageStatsDialog from "./ImageStatsDialog";

const useStyles = makeStyles((theme) =>
  createStyles({
    backButton: {
      marginRight: 8,
    },
    title: {
      flexGrow: 1,
    },
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
      [theme.breakpoints.up("md")]: {
        display: "block",
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

const Game: React.FC<GameProps> = ({ setRoute, gameMode, minFileId, maxFileId }: GameProps) => {
  const classes = useStyles();

  const [context, canvasRef] = useCanvasContext();
  const [animationContext, animationCanvasRef] = useCanvasContext();

  const getNewFileId = useUniqueRandomGenerator(minFileId, maxFileId);

  const canvasContainer = useRef<HTMLDivElement>(null);

  const [heatmapLoading, setHeatmapLoading] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);

  const [showSubmit, setShowSubmit] = useState(false);

  const [roundNumber, setRoundNumber] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [hinted, setHinted] = useState(false);

  const [fileId, setFileId] = useState(0);
  const [truth, setTruth] = useState<number[]>([]);
  const [predicted, setPredicted] = useState<number[]>([]);
  const [click, setClick] = useState<{ x: number; y: number } | null>(null);

  const [roundLoading, setRoundLoading] = useState(false);
  const [roundEnded, setRoundEnded] = useState(false);
  const [showIncrement, setShowIncrement] = useState(false);

  const [roundRunning, setRoundRunning] = useState(false);
  const [roundTime, setRoundTime] = useState(constants.roundTimeInitial);

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

  /**
   * Hooks used for Per-Image Stats
   */
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [totalHints, setTotalHints] = useState(0);

  /**
   * Hook for conditional rendering of the Image Stats Dialog Box
   */
  const [showImageStats, setShowImageStats] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

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
  const showHint = useCallback(() => {
    setHintedCurrent(true);
    setHinted(true);

    const radius = toCanvasScale(context, constants.hintRadius);
    const hintRange = toCanvasScale(context, constants.hintRange);

    const x = randomAround(Math.round(truth[0] + (truth[2] - truth[0]) / 2), hintRange);
    const y = randomAround(Math.round(truth[1] + (truth[3] - truth[1]) / 2), hintRange);

    drawCircle(context, x, y, radius, constants.hintLineWidth, colors.hint);
  }, [context, truth]);

  /**
   * Round timer based events
   */
  useEffect(() => {
    if (!roundRunning) {
      return;
    }

    if (roundTime === constants.hintTime) {
      /*
       * set timer color to timer orange
       * show hint
       */
      setTimerColor(colors.timerOrange);

      showHint();
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
  }, [roundRunning, roundTime, showHint]);

  /**
   * End timer
   *
   * Increment endTime by 100, every 100ms
   *
   * Running only while endRunning is true
   */
  useInterval(() => setEndTime((prevState) => prevState + 100), endRunning ? 100 : null);

  /**
   * Upload the player click (if available), in order to gather statistics and generate heatmaps
   *
   * @param correct Whether click was correct
   */
  const uploadClick = useCallback(
    async (correct: boolean) => {
      if (!click) {
        return;
      }

      const newClick = {
        x: toDefaultScale(context, click.x),
        y: toDefaultScale(context, click.y),
        clickCount: 1,
      };

      const docName = `image_${fileId}`;

      try {
        const imageDoc = await db.collection(constants.images).doc(docName).get();

        /* Use image data if available, or use default values  */
        const { clicks = [], correctClicks = 0, hintCount = 0, wrongClicks = 0 } = (imageDoc.exists
          ? imageDoc.data()
          : {}) as FirestoreImageData;

        /* Locate (if present) existing click with same coordinates */
        const existingClick = clicks.find((clk) => clk.x === newClick.x && clk.y === newClick.y);

        /* If not found, append to array, otherwise increment clickCount */
        if (existingClick === undefined) {
          clicks.push(newClick);
        } else {
          existingClick.clickCount += 1;
        }

        const imageData = {
          clicks,
          correctClicks: correctClicks + (correct ? 1 : 0),
          wrongClicks: wrongClicks + (correct ? 0 : 1),
          hintCount: hintCount + (hintedCurrent ? 1 : 0),
        };

        await db.collection(constants.images).doc(docName).set(imageData);
      } catch (error) {
        if (isFirestoreError(error)) {
          handleFirestoreError(error);
        } else {
          handleUncaughtError(error, "uploadClick");
        }
      }
    },
    [click, context, fileId, hintedCurrent]
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
    } else if (endTime === 100) {
      /*
       * 0.1 seconds passed
       *
       * draw predicted rectangle
       */
      drawRectangle(context, predicted, constants.predictedLineWidth, colors.predicted);
    } else if (endTime === 500) {
      /*
       * 0.5 seconds passed
       *
       * draw truth rectangle
       */
      drawRectangle(context, truth, constants.truthLineWidth, colors.truth);
    } else if (endTime === 1000) {
      /*
       * 1 second passed
       * evaluate player and AI
       * draw player validation text
       * upload player click
       * retrieve image statistics
       * stop end timer
       * end round
       */
      enqueueSnackbar("Checking results...", constants.informationSnackbarOptions);

      /* Player was successful if the click coordinates are inside the truth rectangle */
      const playerCorrect =
        click !== null &&
        truth[0] <= click.x &&
        click.x <= truth[2] &&
        truth[1] <= click.y &&
        click.y <= truth[3];

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

      const intersectionOverUnion = getIntersectionOverUnion(truth, predicted);

      /* AI was successful if the ratio of the intersection over the union is greater than 0.5 */
      const aiCorrect = intersectionOverUnion > 0.5;

      if (aiCorrect) {
        /* Casual mode: one point */
        const casualScore = 1;

        /* Competitive mode: function of prediction accuracy and constant increase rate */
        const competitiveRoundScore = Math.round(
          intersectionOverUnion * constants.aiScoreMultiplier
        );

        const roundScore = gameMode === "casual" ? casualScore : competitiveRoundScore;

        setAiScore(({ total }) => ({ total, round: roundScore }));
        setAiCorrectAnswers((prevState) => prevState + 1);
      }

      const textX = Math.round(constants.canvasSize / 2);
      const textY = Math.round(constants.canvasSize / 10);
      const text = playerCorrect ? "Well spotted!" : "Missed!";
      const textColor = playerCorrect ? colors.playerCorrect : colors.playerIncorrect;

      drawStrokedText(context, text, textX, textY, "center", 3, "white", textColor);

      uploadClick(playerCorrect).then(() => {});

      retrieveImageStats(fileId).then(() => {});

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
    animationRunning ? Math.round(constants.animationTime / constants.animationCubes ** 2) : null
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
    if (animationPosition === constants.animationCubes ** 2) {
      setAnimationRunning(false);
      setEndTime((prevState) => prevState + 100);
      setEndRunning(true);
      return;
    }

    const cubeSide = animationContext.canvas.width / constants.animationCubes;
    const baseX = (animationPosition % constants.animationCubes) * cubeSide;
    const baseY = Math.floor(animationPosition / constants.animationCubes) * cubeSide;
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
    const unlockAchievementHandler = (key, msg) => unlockAchievement(key, msg, enqueueSnackbar);

    if (!roundEnded || roundLoading) {
      return;
    }

    setShowIncrement(true);

    if (gameMode === "competitive" && roundNumber === constants.rounds) {
      setGameEnded(true);
    }

    /* Check general achievements */
    if (playerCorrectCurrent) {
      unlockAchievementHandler("firstCorrect", "Achievement! First correct answer!");

      if (!hintedCurrent) {
        unlockAchievementHandler("firstCorrectWithoutHint", "Achievement! No hint needed!");
      }
    }

    /* Check casual achievements */
    if (gameMode === "casual") {
      if (playerCorrectAnswers === 5) {
        unlockAchievementHandler(
          "fiveCorrectSameRunCasual",
          "Achievement! Five correct in same casual run!"
        );
      }
    }

    /* Check competitive achievements */
    if (gameMode === "competitive") {
      if (playerCorrectCurrent && roundTime > constants.roundTimeInitial - 2000) {
        unlockAchievementHandler(
          "fastAnswer",
          "Achievement! You answered correctly in less than 2 seconds!"
        );
      }

      if (playerScore.total + playerScore.round >= 1000) {
        unlockAchievementHandler(
          "competitivePoints",
          "Achievement! 1000 points in a competitive run!"
        );
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
    const unlockAchievementHandler = (key, msg) => unlockAchievement(key, msg, enqueueSnackbar);

    if (!gameEnded) {
      return;
    }

    if (playerCorrectAnswers === constants.rounds) {
      unlockAchievementHandler("allCorrectCompetitive", "Achievement! You got them all right!");
    }

    if (playerScore.total + playerScore.round > aiScore.total + aiScore.round) {
      unlockAchievementHandler("firstCompetitiveWin", "Achievement! First competitive win!");
    }
  }, [aiScore, enqueueSnackbar, gameEnded, playerCorrectAnswers, playerScore]);

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
    const url = await firebaseStorage.ref(getAnnotationPath(annotationId)).getDownloadURL();

    const response = await axios.get<AnnotationData>(url, { timeout: constants.getTimeout });

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
      firebaseStorage
        .ref(getImagePath(imageId))
        .getDownloadURL()
        .then((url) => {
          image.src = url;
        })
        .catch((error) => reject(error));
    });

  /**
   * Function for retrieving image statistics from Firebase
   *
   * @param fileNumber - index of the image for which we retrieve stats
   */
  const retrieveImageStats = async (fileNumber: number) => {
    const table = DbUtils.IMAGES;

    /** Testing code: for images 1 and 2
     let index;
     if (fileNumber !== 1) {
      index = 1;
    } else {
      index = 2;
    } */

    const docName = `image_${fileNumber}`;

    const imageDoc = await db.collection(table).doc(docName).get();
    if (imageDoc.exists) {
      setCorrectAnswers(imageDoc.data()!.correctClicks);
      setWrongAnswers(imageDoc.data()!.wrongClicks);
      setTotalHints(imageDoc.data()!.hintCount);
    }
  };

  /**
   * Function for wrapping up the data that needs to be parsed in the Image Stats Pie Chart
   */
  const createPieChartData = () => {
    return [
      {
        id: "Correct Answers",
        label: "Correct Answers",
        value: correctAnswers,
        color: "hsl(150, 100%, 35%)",
      },
      {
        id: "Wrong Answers",
        label: "Wrong Answers",
        value: wrongAnswers,
        color: "hsl(0, 100%, 50%)",
      },
      {
        id: "Hints",
        label: "Total Hints",
        value: totalHints,
        color: "hsl(48, 100%, 45%)",
      },
    ];
  };

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

      setRoundNumber((prevState) => prevState + 1);

      /* Reset game state */
      setRoundTime(constants.roundTimeInitial);
      setEndTime(0);
      setAnimationPosition(0);

      setHintedCurrent(false);
      setTimerColor(colors.timerInitial);

      setClick(null);

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

      const docName = `image_${fileId}`;

      try {
        const imageDoc = await db.collection(constants.images).doc(docName).get();

        const { clicks = [] } = (imageDoc.data() || {}) as FirestoreImageData;

        /* TODO: check bug with set width and height for heatmap canvas */
        // eslint-disable-next-line no-underscore-dangle
        const { ctx } = instance._renderer;

        const heatmapData = {
          min: 0,
          max: 1,
          data: clicks.map(({ x, y, clickCount }) => ({
            x: toCanvasScale(ctx, x),
            y: toCanvasScale(ctx, y),
            clickCount,
          })),
        };

        instance.setData(heatmapData);
      } catch (error) {
        if (isFirestoreError(error)) {
          handleFirestoreError(error, enqueueSnackbar);
        } else {
          handleUncaughtError(error, "loadHeatmapData", enqueueSnackbar);
        }

        setShowHeatmap(false);
      } finally {
        setHeatmapLoading(false);
      }
    },
    [enqueueSnackbar, fileId]
  );

  /**
   * Submit the achieved score for the given username
   * (Over)write if achieved score is greater than stored one, or there is no stored value
   *
   * @param username Player username to identify achieved score
   */
  const submitScore = async (username: string): Promise<void> => {
    const date = new Date();

    const scoreData: FirestoreScoreData = {
      user: username,
      score: playerScore.total + playerScore.round,
      ai_score: aiScore.total + aiScore.round,
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
      const scoreDoc = await db.collection(scores).doc(docName).get();

      /* Set if first time played today, or a higher score was achieved */
      if (!scoreDoc.exists || (scoreDoc.data() as FirestoreScoreData).score < scoreData.score) {
        await db.collection(scores).doc(docName).set(scoreData);
      }

      enqueueSnackbar("Score successfully submitted!", constants.successSnackbarOptions);

      setRoute("home");
    } catch (error) {
      if (isFirestoreError(error)) {
        handleFirestoreError(error, enqueueSnackbar);
      } else {
        handleUncaughtError(error, "submitScore", enqueueSnackbar);
      }

      /* Catch again in caller */
      throw error;
    }
  };

  const onToggleHeatmap = () => {
    setHeatmapLoading(!showHeatmap);
    setShowHeatmap((prevState) => !prevState);
  };

  const onShowSubmit = () => setShowSubmit(true);

  const onCloseSubmit = () => setShowSubmit(false);

  const onShowImageStats = () => setShowImageStats(true);

  const onCloseImageStats = () => setShowImageStats(false);

  useHeatmap(
    showHeatmap,
    loadHeatmapData,
    canvasContainer,
    `${classes.canvas} ${classes.heatmapCanvas}`
  );

  return (
    <>
      <AppBar position="sticky">
        <Toolbar variant="dense">
          <IconButton
            className={classes.backButton}
            edge="start"
            color="inherit"
            aria-label="Back"
            onClick={() => setRoute("home")}
          >
            <KeyboardBackspace />
          </IconButton>

          <Typography className={classes.title}>Spot the Lesion</Typography>

          <Button color="inherit" disabled={!roundEnded || roundLoading} onClick={onShowImageStats}>
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
        </Toolbar>
      </AppBar>

      <div className={classes.container}>
        <div className={classes.emptyDiv} />

        <div className={classes.topBarCanvasContainer}>
          <GameTopBar
            gameMode={gameMode}
            hintDisabled={hintedCurrent || !roundRunning}
            onHintClick={showHint}
            roundTime={roundTime}
            timerColor={timerColor}
          />

          <Card className={classes.canvasContainer} ref={canvasContainer}>
            <canvas
              className={`${classes.canvas} ${classes.imageCanvas}`}
              ref={canvasRef}
              height={constants.canvasSize}
              width={constants.canvasSize}
            />

            <canvas
              className={`${classes.canvas} ${classes.animationCanvas}`}
              ref={animationCanvasRef}
              height={constants.canvasSize}
              width={constants.canvasSize}
              onClick={onCanvasClick}
            />
          </Card>
        </div>

        <GameSideBar
          gameStarted={roundNumber > 0}
          gameEnded={gameEnded}
          roundEnded={roundEnded}
          roundLoading={roundLoading}
          showIncrement={showIncrement}
          onStartRound={startRound}
          onSubmitClick={onShowSubmit}
          playerScore={playerScore}
          aiScore={aiScore}
        />
      </div>

      <SubmitScoreDialog open={showSubmit} onClose={onCloseSubmit} onSubmit={submitScore} />

      <ImageStatsDialog
        open={showImageStats}
        data={createPieChartData()}
        onClose={onCloseImageStats}
      />
    </>
  );
};

export default Game;
