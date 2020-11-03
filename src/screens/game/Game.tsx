import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import {
  AppBar,
  Button,
  Card,
  Dialog,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { KeyboardBackspace, Check, Clear, Close } from "@material-ui/icons";
import { TwitterIcon, TwitterShareButton } from "react-share";
import { useSnackbar } from "notistack";
import ColoredLinearProgress from "../../components/ColoredLinearProgress";
import { drawCross, drawCircle, drawRectangle } from "../../components/CanvasUtils";
import useInterval from "../../components/useInterval";
import useCanvasContext from "../../components/useCanvasContext";
import LoadingButton from "../../components/LoadingButton";
import DbUtils from "../../utils/DbUtils";
import { db } from "../../firebase/firebaseApp";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backButton: {
      marginRight: 8,
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
      [theme.breakpoints.down("sm")]: {
        flex: 0,
      },
      [theme.breakpoints.up("md")]: {
        flex: 1,
      },
    },
    timerCanvasContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    timerContainer: {
      [theme.breakpoints.down("sm")]: {
        width: "80vw",
        maxWidth: "65vh",
      },
      [theme.breakpoints.up("md")]: {
        width: "70vh",
        maxWidth: "70vw",
      },
      margin: 8,
      padding: 8,
    },
    timerText: {
      marginBottom: 8,
      textAlign: "center",
      fontSize: "1.5rem",
    },
    canvasContainer: {
      [theme.breakpoints.down("sm")]: {
        height: "80vw",
        width: "80vw",
        maxWidth: "65vh",
        maxHeight: "65vh",
      },
      [theme.breakpoints.up("md")]: {
        height: "70vh",
        width: "70vh",
        maxWidth: "70vw",
        maxHeight: "70vw",
      },
      display: "grid",
      justifyContent: "center",
      alignItems: "center",
      padding: 8,
    },
    canvas: {
      gridColumnStart: 1,
      gridRowStart: 1,
      height: "100%",
      width: "100%",
    },
    sideContainer: {
      [theme.breakpoints.down("sm")]: {
        justifyContent: "center",
      },
      [theme.breakpoints.up("md")]: {
        flex: 1,
        height: "100%",
        justifyContent: "flex-end",
        alignItems: "center",
      },
      display: "flex",
    },
    sideCard: {
      [theme.breakpoints.down("sm")]: {
        width: "80vw",
        maxWidth: "65vh",
      },
      minWidth: "20vw",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      alignContent: "center",
      margin: 8,
      padding: 8,
    },
    result: {
      [theme.breakpoints.down("sm")]: {
        fontSize: 20,
      },
      [theme.breakpoints.up("md")]: {
        marginTop: 8,
        marginBottom: 8,
        fontSize: 34,
      },
      textAlign: "center",
    },
    flexButton: {
      flex: 1,
      flexDirection: "column",
    },
    leafletContainer: {
      height: "90vh",
      width: "100%",
      background: "white",
    },
  })
);

const VALID_COLOUR = "green";
const INVALID_COLOUR = "red";
const DEFAULT_COLOUR = "yellow";
const TRUE_COLOUR = "blue";

const NUMBER_OF_ROUNDS = 10;
const TOTAL_TIME_MS = 10000;
const AI_SCORE_INCREASE_RATE = 75;

const DEFAULT_CANVAS_SIZE = 512;
const MAX_CANVAS_SIZE = 750;

const MAX_FILE_NUMBER = 100;
const AI_ANIMATION_TIME = 5000;

type JsonData = { truth: number[]; predicted: number[] };

const Game: React.FC<GameProps> = ({ setRoute }: GameProps) => {
  const classes = useStyles();

  const seenFiles = new Set<number>();

  const [context, canvasRef] = useCanvasContext();
  const [animContext, animCanvasRef] = useCanvasContext();

  const [currentRound, setCurrentRound] = useState(0);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [hinted, setHinted] = useState(false);
  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [heatmapEnable, setHeatmapEnabled] = useState(false);

  const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME_MS);
  const [timerColor, setTimerColor] = useState("#373737");

  const [truth, setTruth] = useState<number[]>([]);
  const [predicted, setPredicted] = useState<number[]>([]);

  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);

  const [playerCorrect, setPlayerCorrect] = useState(false);
  const [aiCorrect, setAiCorrect] = useState(false);

  const [aiCorrectAnswers, setAiCorrectAnswers] = useState(0);
  const [playerCorrectAnswers, setPlayerCorrectAnswers] = useState(0);

  const [username, setUsername] = useState("");

  const [currentImageId, setCurrentImageId] = useState(0);

  // const [dataPoints, setDataPoints] = useState<[number, number][]>([]);

  /**
   * The heatmap dialog box information
   */
  const [heatmapDialogOpen, setHeatmapDialogOpen] = useState(false);

  /* TODO: check if upload to database fails to give different message */
  const { enqueueSnackbar } = useSnackbar();

  /**
   * Called every 100 milliseconds, while the game is running,
   */
  const timerTick = () => {
    setTimeRemaining((prevState) => prevState - 100);
  };

  useInterval(timerTick, running ? 100 : null);

  /**
   * Stops the timer by stopping the current round.
   */
  const stopTimer = () => setRunning(false);

  /**
   * Maps a given value to the current canvas scale
   *
   * @param x Value to map
   *
   * @return Given value, mapped to the canvas scale
   */
  const mapToCanvasScale = useCallback(
    (x: number) => {
      return (x * context.canvas.width) / DEFAULT_CANVAS_SIZE;
    },
    [context]
  );

  const getCube = useCallback((baseCornerX: number, baseCornerY: number, cubeSide: number) => {
    const cube: number[] = [];

    cube[0] = baseCornerX;
    cube[1] = baseCornerY;
    cube[2] = cube[0] + cubeSide;
    cube[3] = cube[1] + cubeSide;
    return cube;
  }, []);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const getCornerCube = useCallback(
    (cubeSide: number) => {
      return getCube(0, 0, cubeSide);
    },
    [getCube]
  );

  /**
   * Clears the animation canvas
   */
  const clearAnimCanvas = useCallback(() => {
    animContext.clearRect(0, 0, animContext.canvas.width, animContext.canvas.height);
  }, [animContext]);

  /**
   * Draw an AI search animation, rendering cubes on both sides of the canvas,
   * moving towards their opposite side
   */
  const drawAiSearchAnimation = useCallback(() => {
    enqueueSnackbar("The system is thinking...");

    const animationTime = 5000;
    const numCubes = 5;

    const canvasWidth = animContext.canvas.width;
    const canvasHeight = animContext.canvas.height;
    const cubeSide = canvasWidth / (numCubes * 2);
    let cube = getCornerCube(cubeSide);

    /* Draw cubes in initial position */
    drawRectangle(animContext, cube, INVALID_COLOUR, 3);

    const intervalId = window.setInterval(() => {
      /* Clear previous cubes */
      clearAnimCanvas();

      /* Advance cube to right */
      cube[0] += cubeSide;
      cube[2] += cubeSide;

      drawRectangle(animContext, cube, VALID_COLOUR, 3);

      /* When cube gets to right-most bound, advance cube below & restart */
      if (cube[2] > canvasWidth) {
        cube = getCube(-cubeSide, cube[1] + cubeSide, cubeSide);
      }
      /* When cube gets out of lower bound, end animation */
      if (cube[1] > canvasHeight) {
        clearInterval(intervalId);
        clearAnimCanvas();
      }
    }, animationTime / 100);
  }, [animContext, clearAnimCanvas, enqueueSnackbar, getCornerCube, getCube]);

  /**
   * Draws the truth rectangle
   */
  const drawTruth = useCallback(() => {
    drawRectangle(context, truth, TRUE_COLOUR, 3);
  }, [context, truth]);

  /**
   * Draws the predicted rectangle
   * @param strokeStyle Style for drawing the rectangle
   */
  const drawPredicted = useCallback(
    (strokeStyle: string) => {
      drawRectangle(context, predicted, strokeStyle, 3);
    },
    [context, predicted]
  );

  /**
   * Draws the hint circle
   */
  const drawHint = useCallback(() => {
    const x = truth[0] + (truth[2] - truth[0]) / 2 + Math.random() * 100 - 50;
    const y = truth[1] + (truth[3] - truth[1]) / 2 + Math.random() * 100 - 50;
    const radius = 100;

    drawCircle(context, x, y, mapToCanvasScale(radius), 2, INVALID_COLOUR);
  }, [context, mapToCanvasScale, truth]);

  /**
   * Draws the player click cross
   *
   * @param x           Width coordinate
   * @param y           Height coordinate
   * @param strokeStyle Style for drawing the cross
   */
  const drawPlayerClick = (x: number, y: number, strokeStyle: string) => {
    drawCross(context, x, y, 5, strokeStyle);
  };

  /**
   * Given the coordinates of two rectangles, returns the ratio of their intersection
   * over their union.
   *
   * Used in determining the success of a given AI prediction.
   *
   * @param rectA Coordinates for the corners of the first rectangle
   * @param rectB Coordinates for the corners of the second rectangle
   *
   * @return Ratio of intersection area over union area
   */
  const getIntersectionOverUnion = (rectA: number[], rectB: number[]): number => {
    const xA = Math.max(rectA[0], rectB[0]);
    const xB = Math.min(rectA[2], rectB[2]);
    const yA = Math.max(rectA[1], rectB[1]);
    const yB = Math.min(rectA[3], rectB[3]);

    const inter = Math.max(0, xB - xA + 1) * Math.max(0, yB - yA + 1);

    const areaA = (rectA[2] - rectA[0] + 1) * (rectA[3] - rectA[1] + 1);
    const areaB = (rectB[2] - rectB[0] + 1) * (rectB[3] - rectB[1] + 1);

    const union = areaA + areaB - inter;

    return inter / union;
  };

  /**
   * Determines whether the AI prediction was successful, by checking that
   * the ratio of the intersection over the union of the predicted and truth rectangles
   * is greater than 0.5
   *
   * @return The success value
   */
  const isAiPredictionRight = useCallback(() => {
    return getIntersectionOverUnion(truth, predicted) > 0.5;
  }, [truth, predicted]);

  /**
   * Determines whether the player was successful, by checking that the click position
   * is inside the truth rectangle
   *
   * @param x Click coordinate on width
   * @param y Click coordinate on height
   *
   * @return The success value
   */
  const isPlayerRight = (x: number, y: number) => {
    return truth[0] <= x && x <= truth[2] && truth[1] <= y && y <= truth[3];
  };

  /**
   * Sets a timeout for animation that shows whether the AI prediction was right or wrong
   */
  const drawAIAnswerCheckAnimation = useCallback(() => {
    setTimeout(() => {
      if (isAiPredictionRight()) {
        const scoreObtained = Math.round(
          getIntersectionOverUnion(truth, predicted) * AI_SCORE_INCREASE_RATE
        );

        setAiScore((prevState) => prevState + scoreObtained);
        setAiCorrectAnswers((prevState) => prevState + 1);
        drawPredicted(VALID_COLOUR);
        setAiCorrect(true);
      } else {
        drawPredicted(INVALID_COLOUR);
        setAiCorrect(false);
      }

      setHeatmapEnabled(true);
      setLoading(false);
    }, AI_ANIMATION_TIME + 1500);
  }, [drawPredicted, isAiPredictionRight, predicted, truth]);

  useEffect(() => {
    if (!running) {
      return;
    }

    if (timeRemaining <= 0) {
      setLoading(true);
      stopTimer();

      drawAiSearchAnimation();

      setTimeout(() => {
        drawPredicted(DEFAULT_COLOUR);
      }, AI_ANIMATION_TIME);

      setTimeout(() => {
        drawTruth();
      }, AI_ANIMATION_TIME + 500);

      drawAIAnswerCheckAnimation();
    } else if (timeRemaining <= 2000) {
      setTimerColor("red");
    } else if (timeRemaining <= 5000) {
      if (hinted) {
        return;
      }

      setHinted(true);

      setTimerColor("orange");

      drawHint();
    } else {
      setTimerColor("#373737");
    }
  }, [
    drawAiSearchAnimation,
    drawHint,
    drawPredicted,
    drawTruth,
    hinted,
    isAiPredictionRight,
    running,
    timeRemaining,
    truth,
    predicted,
    aiCorrectAnswers,
    drawAIAnswerCheckAnimation,
  ]);

  /**
   * Maps the mouse position relative to the given canvas
   *
   * @param clickX Click coordinate on width
   * @param clickY Click coordinate on height
   *
   * @return Click width and height coordinates, relative to the canvas
   */
  const getClickPositionOnCanvas = (clickX: number, clickY: number) => {
    const rect = context.canvas.getBoundingClientRect();
    const widthScale = context.canvas.width / rect.width;
    const heightScale = context.canvas.height / rect.height;

    return {
      x: (clickX - rect.left) * widthScale,
      y: (clickY - rect.top) * heightScale,
    };
  };

  /**
   * Function for uploading user clicks for a CT scan in Firebase
   * @param xCoord - x-Coordinate of the click on the image
   * @param yCoord - y-Coordinate of the click on the image
   * @param imageId - file number of the CT Scan
   */
  const uploadImageClick = async (xCoord: number, yCoord: number, imageId: number) => {
    const docNameForImage = `image_${imageId}`;
    let entry;
    let pointWasClickedBefore = false;

    const newClickPoint = {
      x: xCoord,
      y: yCoord,
      clickCount: 1,
    };

    const imageDoc = await db.collection(DbUtils.IMAGES).doc(docNameForImage).get();

    if (!imageDoc.exists) {
      // First time this image showed up in the game - entry will be singleton array
      entry = { clicks: [newClickPoint] };
    } else {
      const { clicks } = imageDoc.data()!;
      clicks.forEach((click: { x: number; y: number; count: number }) => {
        if (click.x === xCoord && click.y === yCoord) {
          click.count += 1;
          pointWasClickedBefore = true;
        }
      });

      if (!pointWasClickedBefore) {
        // First time this clicked occurred for this image, Add to this image's clicks array
        clicks.push(newClickPoint);
      }
      // Entry in DB will be the updated clicks array
      entry = { clicks };
    }
    await db.collection(DbUtils.IMAGES).doc(docNameForImage).set(entry);
  };

  const getClickedPoints = async (imageId: number) => {
    const docNameForImage = `image_${imageId}`;
    const snapshot = await db.collection(DbUtils.IMAGES).doc(docNameForImage).get();
    const data = snapshot.data();
    if (data === undefined) {
      return;
    }
    const clicks: [number, number][] = [];
    for (let i = 0; i < data.clicks.length; i++) {
      for (let k = 0; k < data.clicks[i].clickCount; k++) {
        clicks.push([data.clicks[i].y, data.clicks[i].x]);
      }
    }
    // setDataPoints(clicks);
  };

  /**
   * Called when the canvas is clicked
   *
   * @param event Mouse event, used to get click position
   */
  const onCanvasClick = async (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!running) {
      return;
    }

    setLoading(true);
    stopTimer();

    const [clickX, clickY] = [event.clientX, event.clientY];

    const { x, y } = getClickPositionOnCanvas(clickX, clickY);

    drawPlayerClick(x, y, DEFAULT_COLOUR);

    await uploadImageClick(Math.round(x), Math.round(y), currentImageId);

    drawAiSearchAnimation();

    setTimeout(() => {
      drawPredicted(DEFAULT_COLOUR);
    }, AI_ANIMATION_TIME);

    setTimeout(() => {
      drawTruth();
    }, AI_ANIMATION_TIME + 500);

    setTimeout(() => {
      enqueueSnackbar("Checking results...");
      if (isPlayerRight(x, y)) {
        const timeRate = timeRemaining / 1000;
        const increaseRate = hinted ? timeRate * 10 : timeRate * 20;

        setPlayerCorrectAnswers((prevState) => prevState + 1);
        setPlayerScore((prevState) => prevState + increaseRate);
        drawPlayerClick(x, y, VALID_COLOUR);
        setPlayerCorrect(true);
      } else {
        drawPlayerClick(x, y, INVALID_COLOUR);
        setPlayerCorrect(false);
      }
    }, AI_ANIMATION_TIME + 1000);

    drawAIAnswerCheckAnimation();
  };

  /**
   * Returns a random, previously unseen, file number
   *
   * @return number of a new file
   */
  const getNewFileNumber = (): number => {
    const newFileNumber = Math.round(Math.random() * MAX_FILE_NUMBER);

    /* TODO: handle case where all files have been used */
    if (seenFiles.has(newFileNumber)) {
      return getNewFileNumber();
    }

    seenFiles.add(newFileNumber);

    return newFileNumber;
  };

  /**
   * Returns the path to the json file corresponding to the given fileNumber
   *
   * @param fileNumber Number of the file to retrieve
   */
  const getJsonPath = (fileNumber: number) =>
    `${process.env.PUBLIC_URL}/content/annotation/${fileNumber}.json`;

  /**
   * Returns the path to the image file corresponding to the given fileNumber
   *
   * @param fileNumber Number of the file to retrieve
   */
  const getImagePath = (fileNumber: number) =>
    `${process.env.PUBLIC_URL}/content/images/${fileNumber}.png`;

  /**
   * Maps the coordinates of a given rectangle to the current canvas scale
   *
   * @param rect Coordinates for the corners of the rectangle to map
   *
   * @return Given rectangle coordinates, mapped to the canvas scale
   */
  const mapCoordinates = (rect: number[]) => rect.map(mapToCanvasScale);

  /**
   * Loads the data from the json corresponding to the given fileNumber
   *
   * @param fileNumber Number of the json file to load
   */
  const loadJson = async (fileNumber: number) => {
    const response = await fetch(getJsonPath(fileNumber));
    const data: JsonData = await response.json();

    setTruth(mapCoordinates(data.truth));
    setPredicted(mapCoordinates(data.predicted));
  };

  /**
   * Loads the image from the file corresponding to the given fileNumber
   *
   * @param fileNumber
   */
  const loadImage = (fileNumber: number): Promise<void> =>
    new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        clearAnimCanvas();

        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.drawImage(image, 0, 0, context.canvas.width, context.canvas.height);

        resolve();
      };

      image.onerror = reject;

      /* Set source after onLoad to ensure onLoad gets called (in case the image is cached) */
      image.src = getImagePath(fileNumber);
    });

  /**
   * Starts a new round, loading a new image and its corresponding json data
   */
  const startNewRound = async () => {
    setLoading(true);
    setHinted(false);
    setHeatmapEnabled(false);
    setCurrentRound((prevState) => prevState + 1);

    const fileNumber = getNewFileNumber();
    setCurrentImageId(fileNumber);

    await loadJson(fileNumber);
    await loadImage(fileNumber);

    setTimeRemaining(TOTAL_TIME_MS);
    setRunning(true);
    setLoading(false);
  };

  /**
   * Called when the Start/Next button is clicked
   */
  const onStartNextClick = async () => {
    await startNewRound();
  };

  /**
   * Uploads the score to the database
   */
  const uploadScore = async () => {
    if (username === "") {
      return;
    }
    const date = new Date();
    const entry = {
      user: username,
      score: playerScore,
      ai_score: aiScore,
      correct_player_answers: playerCorrectAnswers,
      correct_ai_answers: aiCorrectAnswers,
      day: date.getDate(),
      month: DbUtils.monthNames[date.getMonth()],
      year: date.getFullYear(),
    };

    const entryName = `${entry.year}.${entry.month}.${entry.day}.${entry.user}`;

    const snapshot = await db
      .collection(DbUtils.LEADERBOARD)
      .where("year", "==", entry.year)
      .where("month", "==", entry.month)
      .where("day", "==", entry.day)
      .where("user", "==", username)
      .get();

    if (snapshot.empty) {
      await db.collection(DbUtils.LEADERBOARD).doc(entryName).set(entry);
    } else {
      let newScoreRecord = true;
      snapshot.forEach((doc) => {
        if (doc.data().score > entry.score) {
          newScoreRecord = false;
        }
      });

      // Add current score in DB only if it is a new Score Record
      if (newScoreRecord) {
        await db.collection(DbUtils.LEADERBOARD).doc(entryName).set(entry);
      }
    }
  };

  /**
   * Function for displaying a green or red thick depending on the correctness of the answer
   * @param correct - true if answer was correct, false otherwise
   */
  const displayCorrect = (correct: boolean) => {
    if (currentRound === 0 || running || loading) {
      return null;
    }

    if (correct) {
      return <Check style={{ fontSize: "48", fill: "green", width: 100 }} />;
    }

    return <Clear style={{ fontSize: "48", fill: "red", width: 100 }} />;
  };

  /**
   * Function for filling up the username field before submitting score
   * @param event - username writing event listener
   */
  const onChangeUsername = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value !== "") {
      setSubmitEnabled(true);
    }
    if (event.target.value === "") {
      setSubmitEnabled(false);
    }
    setUsername(event.target.value);
  };

  /**
   * Function for triggering the effects associated with submitting the score
   * Submit button becomes disabled
   * Snackbar triggered
   * Scores uploaded into Firebase
   */
  const onSubmitScore = async () => {
    setSubmitEnabled(false);
    await uploadScore();
    setRoute("home");
    enqueueSnackbar("Score successfully submitted!");
  };

  /**
   * Function for displaying the result of the game
   */
  const decideWinner = () => {
    if (playerScore > aiScore) {
      return (
        <Typography className={classes.result} variant="h6" style={{ color: VALID_COLOUR }}>
          You Won !
        </Typography>
      );
    }
    if (aiScore > playerScore) {
      return (
        <Typography className={classes.result} variant="h6" style={{ color: INVALID_COLOUR }}>
          AI won !
        </Typography>
      );
    }
    // Otherwise it was a draw
    return (
      <Typography className={classes.result} variant="h6" style={{ color: DEFAULT_COLOUR }}>
        It was a draw !
      </Typography>
    );
  };

  /**
   * Function for displaying the side dialog box with game results and start/next/submit buttons
   */
  const dialogAction = () => {
    if (currentRound < NUMBER_OF_ROUNDS || running || loading) {
      return (
        <LoadingButton
          loading={loading}
          buttonDisabled={running || loading}
          onButtonClick={onStartNextClick}
          buttonText={currentRound === 0 ? "START" : "NEXT"}
        />
      );
    }

    return (
      <>
        <TwitterShareButton
          url="http://cb3618.pages.doc.ic.ac.uk/spot-the-lesion"
          title={`I got ${playerScore} points in Spot-the-Lesion! Can you beat my score?`}
        >
          <TwitterIcon size="50px" round />
        </TwitterShareButton>

        <TextField
          label="Username"
          variant="outlined"
          value={username}
          onChange={onChangeUsername}
        />

        {decideWinner()}

        <Button
          variant="contained"
          color="primary"
          size="large"
          disabled={running || loading || !submitEnabled}
          onClick={onSubmitScore}
        >
          Submit Score
        </Button>
      </>
    );
  };

  /**
   * Function for opening the heatmap tab
   */
  const openHeatmap = () => {
    getClickedPoints(currentImageId);
    setHeatmapDialogOpen(true);
  };

  /**
   * Function for closing the heatmap tab
   */
  const closeHeatmap = () => {
    setHeatmapDialogOpen(false);
  };

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

          <Typography>Spot the Lesion</Typography>
          <Button
            disabled={!heatmapEnable}
            variant="contained"
            color="primary"
            size="large"
            onClick={openHeatmap}
          >
            See the heatmap
          </Button>
        </Toolbar>
      </AppBar>

      <div className={classes.container}>
        <div className={classes.emptyDiv} />

        <div className={classes.timerCanvasContainer}>
          <Card className={classes.timerContainer}>
            <Typography className={classes.timerText} variant="h4" style={{ color: timerColor }}>
              Time remaining: {(timeRemaining / 1000).toFixed(1)}s
            </Typography>

            <ColoredLinearProgress
              barColor={timerColor}
              variant="determinate"
              value={timeRemaining / 100}
            />
          </Card>

          <Card className={classes.canvasContainer}>
            <canvas
              className={classes.canvas}
              ref={canvasRef}
              width={MAX_CANVAS_SIZE}
              height={MAX_CANVAS_SIZE}
            />

            <canvas
              className={classes.canvas}
              ref={animCanvasRef}
              width={MAX_CANVAS_SIZE}
              height={MAX_CANVAS_SIZE}
              onClick={onCanvasClick}
            />
          </Card>
        </div>

        <div className={classes.sideContainer}>
          <Card className={classes.sideCard}>
            <div className={classes.flexButton}>
              <Typography className={classes.result} variant="h4">
                You:
              </Typography>

              <div className={classes.result}>{displayCorrect(playerCorrect)}</div>
            </div>

            <div className={classes.flexButton}>
              <Typography className={classes.result} variant="h4">
                {playerScore} vs {aiScore}
              </Typography>

              <div className={classes.result}>{dialogAction()}</div>
            </div>

            <div className={classes.flexButton}>
              <Typography className={classes.result} variant="h4">
                AI:
              </Typography>

              <div className={classes.result}>{displayCorrect(aiCorrect)}</div>
            </div>
          </Card>
        </div>

        <Dialog fullScreen open={heatmapDialogOpen} onClose={openHeatmap}>
          <AppBar position="sticky">
            <Toolbar variant="dense">
              <IconButton edge="start" color="inherit" onClick={closeHeatmap} aria-label="close">
                <Close />
              </IconButton>
            </Toolbar>
          </AppBar>
        </Dialog>
      </div>
    </>
  );
};

export default Game;
