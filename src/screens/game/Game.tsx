import React, { useCallback, useEffect, useRef, useState } from "react";
import { AppBar, Card, IconButton, Toolbar, Typography } from "@material-ui/core";
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
  useUniqueRandomGenerator,
  useInterval,
  useHeatmap,
} from "../../components";
import {
  drawCircle,
  drawCross,
  drawRectangle,
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
    playerValidationText: {
      zIndex: 3,
      userSelect: "none",
      marginTop: 16,
      fontSize: "4rem",
      textShadow: "-1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white",
    },
  })
);

/* TODO: extract this */
const MAX_CANVAS_SIZE = 750;

const Game: React.FC<GameProps> = ({ setRoute, gameMode, minFileId, maxFileId }: GameProps) => {
  const classes = useStyles();

  const [context, canvasRef] = useCanvasContext();
  const [animationContext, animationCanvasRef] = useCanvasContext();

  const canvasContainer = useRef<HTMLDivElement>(null);

  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);

  const getNewFileId = useUniqueRandomGenerator(minFileId, maxFileId);
  const [fileId, setFileId] = useState(0);

  const [truth, setTruth] = useState<number[]>([]);
  const [predicted, setPredicted] = useState<number[]>([]);
  const [click, setClick] = useState<{ x: number; y: number } | null>(null);

  const [inRound, setInRound] = useState(false);

  const [roundLoading, setRoundLoading] = useState(false);
  const [heatmapLoading, setHeatmapLoading] = useState(false);

  const [roundRunning, setRoundRunning] = useState(false);
  const [endRunning, setEndRunning] = useState(false);
  const [animationRunning, setAnimationRunning] = useState(false);

  const [roundTime, setRoundTime] = useState(constants.roundTimeInitial);
  const [endTime, setEndTime] = useState(0);
  const [animationPosition, setAnimationPosition] = useState(0);

  const [timerColor, setTimerColor] = useState(colors.timerInitial);

  const [round, setRound] = useState(0);

  const [hinted, setHinted] = useState(false);
  const [hintedCurrent, setHintedCurrent] = useState(false);

  const [playerScore, setPlayerScore] = useState(0);
  const [playerRoundScore, setPlayerRoundScore] = useState(0);
  const [playerCorrect, setPlayerCorrect] = useState(0);
  const [playerCorrectCurrent, setPlayerCorrectCurrent] = useState(false);

  const [aiScore, setAiScore] = useState(0);
  const [aiRoundScore, setAiRoundScore] = useState(0);
  const [aiCorrect, setAiCorrect] = useState(0);

  useHeatmap(
    showHeatmap,
    setShowHeatmap,
    setHeatmapLoading,
    canvasContainer,
    fileId,
    `${classes.canvas} ${classes.heatmapCanvas}`
  );

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
       * (if not already hinted this round)
       * set Timer color to timer orange
       * show hint
       */
      if (!hintedCurrent) {
        setTimerColor(colors.timerOrange);

        showHint();
      }
    } else if (roundTime === constants.redTime) {
      /*
       * set Timer color to timer red
       */
      setTimerColor(colors.timerRed);
    } else if (roundTime === 0) {
      /*
       * start end timer and stop round timer
       */
      setEndRunning(true);
      setRoundRunning(false);
    }
  }, [hintedCurrent, roundRunning, roundTime, showHint]);

  /**
   * End timer
   *
   * Increment endTime by 100, every 100ms
   *
   * Running only while endRunning is true
   */
  useInterval(() => setEndTime((prevState) => prevState + 100), endRunning ? 100 : null);

  /**
   * Upload the player click, in order to gather statistics and generate heatmaps
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
    [context, fileId, hintedCurrent]
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

      /* TODO: maybe remove this snackbar */
      enqueueSnackbar("The system is thinking...", constants.informationSnackbarOptions);

      setAnimationRunning(true);
      setEndRunning(false);
    } else if (endTime === 100) {
      /*
       * 0.1 seconds passed
       *
       * draw predicted rectangle in initial color
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
       *
       * (if click available)
       * evaluate click
       * draw click in valid or invalid color
       * upload player click
       */
      if (click) {
        const { x, y } = click;

        /* TODO: maybe remove this snackbar */
        enqueueSnackbar("Checking results...", constants.informationSnackbarOptions);

        /* Player was successful if the click coordinates are inside the truth rectangle */
        const correct = truth[0] <= x && x <= truth[2] && truth[1] <= y && y <= truth[3];

        if (correct) {
          /* Casual Mode: half a point, doubled if no hint received */
          const casualScore = 0.5 * (hintedCurrent ? 1 : 2);

          /* Competitive Mode: function of round time left, doubled if no hint received */
          const competitiveScore = Math.round(roundTime / 100) * (hintedCurrent ? 1 : 2);

          setPlayerRoundScore(gameMode === "casual" ? casualScore : competitiveScore);
          setPlayerCorrect((prevState) => prevState + 1);
          setPlayerCorrectCurrent(true);
        }

        uploadClick(x, y, correct).then(() => {});
      }
    } else if (endTime === 1500) {
      /*
       * 1.5 seconds passed
       *
       * evaluate AI prediction
       * draw predicted rectangle in valid or invalid color
       * stop end timer and current round
       */
      const intersectionOverUnion = getIntersectionOverUnion(truth, predicted);

      /* AI was successful if the ratio of the intersection over the union is greater than 0.5 */
      const correct = intersectionOverUnion > 0.5;

      if (correct) {
        /* Casual mode: one point */
        const casualScore = 1;

        /* Competitive mode: function of prediction accuracy and constant increase rate */
        const competitiveRoundScore = Math.round(
          intersectionOverUnion * constants.aiScoreMultiplier
        );

        setAiRoundScore(gameMode === "casual" ? casualScore : competitiveRoundScore);
        setAiCorrect((prevState) => prevState + 1);
      }

      setInRound(false);
      setEndRunning(false);
    }
  }, [
    click,
    context,
    endRunning,
    endTime,
    enqueueSnackbar,
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
   * After round end based events
   */
  useEffect(() => {
    const unlockAchievementHandler = (key, message) =>
      unlockAchievement(key, message, enqueueSnackbar);

    if (round === 0 || roundLoading || inRound) {
      return;
    }

    if (playerCorrectCurrent) {
      unlockAchievementHandler("firstCorrect", "Achievement! First correct answer!");

      if (!hintedCurrent) {
        unlockAchievementHandler("firstCorrectWithoutHint", "Achievement! No hint needed!");
      }
    }

    if (gameMode === "casual") {
      if (playerCorrect === 5) {
        unlockAchievementHandler(
          "fiveCorrectSameRunCasual",
          "Achievement! Five correct in same casual run!"
        );
      }
    }

    if (gameMode === "competitive") {
      if (playerCorrectCurrent && roundTime > constants.roundTimeInitial - 2000) {
        unlockAchievementHandler(
          "fastAnswer",
          "Achievement! You answered correctly in less than 2 seconds!"
        );
      }

      if (playerScore + playerRoundScore >= 1000) {
        unlockAchievementHandler(
          "competitivePoints",
          "Achievement! 1000 points in a competitive run!"
        );
      }

      if (playerCorrect === constants.rounds) {
        unlockAchievementHandler("allCorrectCompetitive", "Achievement! You got them all right!");
      }

      if (round === constants.rounds && playerScore + playerRoundScore > aiScore + aiRoundScore) {
        unlockAchievementHandler("firstCompetitiveWin", "Achievement! First competitive win!");
      }
    }
  }, [
    aiRoundScore,
    aiScore,
    enqueueSnackbar,
    gameMode,
    hintedCurrent,
    inRound,
    playerCorrect,
    playerCorrectCurrent,
    playerRoundScore,
    playerScore,
    round,
    roundLoading,
    roundTime,
  ]);

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
  const loadAnnotation = async (annotationId: number) => {
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
   * Starts a new round, loading a new annotation - image pair
   */
  const startRound = async () => {
    setRoundLoading(true);

    /* Update scores with last round scores */
    setPlayerScore((prevState) => prevState + playerRoundScore);
    setPlayerRoundScore(0);

    setAiScore((prevState) => prevState + aiRoundScore);
    setAiRoundScore(0);

    /* Get a new file id and load the corresponding annotation and image */
    const newFileId = getNewFileId();

    try {
      await loadAnnotation(newFileId);
      await loadImage(newFileId);

      setFileId(newFileId);

      setRound((prevState) => prevState + 1);

      /* Reset game state */
      setRoundTime(constants.roundTimeInitial);
      setEndTime(0);
      setAnimationPosition(0);

      setHintedCurrent(false);
      setTimerColor(colors.timerInitial);

      setClick(null);

      setPlayerCorrectCurrent(false);

      setShowHeatmap(false);

      setInRound(true);
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
   * Submit the achieved score for the given username
   * (Over)write if achieved score is greater than stored one, or there is no stored value
   *
   * @param username Player username to identify achieved score
   */
  const submitScore = async (username: string) => {
    const date = new Date();

    const scoreData: FirestoreScoreData = {
      user: username,
      score: playerScore + playerRoundScore,
      ai_score: aiScore + aiRoundScore,
      correct_player_answers: playerCorrect,
      usedHints: hinted,
      correct_ai_answers: aiCorrect,
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
    }
  };

  const onToggleHeatmap = () => {
    setHeatmapLoading(!showHeatmap);
    setShowHeatmap((prevState) => !prevState);
  };

  const onShowSubmit = () => setShowSubmit(true);

  const onCloseSubmit = () => setShowSubmit(false);

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

          <LoadingButton
            color="inherit"
            disabled={round === 0 || roundLoading || inRound}
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
              width={MAX_CANVAS_SIZE}
              height={MAX_CANVAS_SIZE}
            />

            <canvas
              className={`${classes.canvas} ${classes.animationCanvas}`}
              ref={animationCanvasRef}
              width={MAX_CANVAS_SIZE}
              height={MAX_CANVAS_SIZE}
              onClick={onCanvasClick}
            />

            <Typography
              className={classes.playerValidationText}
              style={{
                display: round === 0 || roundLoading || inRound ? "none" : "block",
                color: playerCorrectCurrent ? colors.playerCorrect : colors.playerIncorrect,
              }}
            >
              {playerCorrectCurrent ? "Well spotted!" : "Missed!"}
            </Typography>
          </Card>
        </div>

        <GameSideBar
          gameMode={gameMode}
          round={round}
          inRound={inRound}
          roundLoading={roundLoading}
          playerScore={playerScore}
          playerRoundScore={playerRoundScore}
          aiScore={aiScore}
          aiRoundScore={aiRoundScore}
          onStartRound={startRound}
          onSubmitClick={onShowSubmit}
        />
      </div>

      <SubmitScoreDialog open={showSubmit} onClose={onCloseSubmit} onSubmit={submitScore} />
    </>
  );
};

export default Game;
