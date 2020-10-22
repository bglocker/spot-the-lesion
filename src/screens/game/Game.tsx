import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  AppBar,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { KeyboardBackspace } from "@material-ui/icons";
import { TwitterIcon, TwitterShareButton } from "react-share";
import ColoredLinearProgress from "../../components/ColoredLinearProgress";
import useInterval from "../../components/useInterval";
import { db } from "../../firebase/firebaseApp";
import LoadingButton from "../../components/LoadingButton";
import DbUtils from "../../utils/DbUtils";

const useStyles = makeStyles(() =>
  createStyles({
    backButton: {
      marginRight: 8,
    },
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    timerContainer: {
      width: "min(81vh, 81vw)",
      margin: 8,
      padding: 8,
    },
    timerText: {
      marginBottom: 8,
      textAlign: "center",
      fontSize: "1.5rem",
    },
    canvasContainer: {
      height: "min(81vh, 81vw)",
      width: "min(81vh, 81vw)",
      display: "grid",
      justifyContent: "center",
      alignItems: "center",
      padding: 8,
    },
    canvas: {
      gridColumnStart: 1,
      gridRowStart: 1,
    },
    dialogPaper: {
      width: "200vw",
    },
    result: {
      marginTop: 8,
      marginBottom: 8,
      textAlign: "center",
    },
  })
);

const VALID_COLOUR = "green";
const INVALID_COLOUR = "red";
const DEFAULT_COLOUR = "yellow";
const TRUE_COLOUR = "blue";

const NUMBER_OF_ROUNDS = 10;
const TOTAL_TIME_MS = 10000;

const DEFAULT_CANVAS_SIZE = 512;

const MAX_FILE_NUMBER = 100;

type JsonData = { truth: number[]; predicted: number[] };

const Game: React.FC<GameProps> = ({ setRoute }: GameProps) => {
  const classes = useStyles();

  const seenFiles = new Set<number>();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animCanvasRef = useRef<HTMLCanvasElement>(null);

  const [canvasSize, setCanvasSize] = useState(
    Math.min(window.innerWidth * 0.8, window.innerHeight * 0.8)
  );

  const [showDialog, setShowDialog] = useState(true);

  const [currentRound, setCurrentRound] = useState(0);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [hinted, setHinted] = useState(false);

  const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME_MS);
  const [timerColor, setTimerColor] = useState("#373737");

  const [username, setUsername] = useState("");

  const [truth, setTruth] = useState<number[]>([]);
  const [predicted, setPredicted] = useState<number[]>([]);

  const [playerPoints, setPlayerPoints] = useState(0);
  const [aiPoints, setAiPoints] = useState(0);

  const [playerCorrect, setPlayerCorrect] = useState(false);
  const [aiCorrect, setAiCorrect] = useState(false);

  type DrawType = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => void;
  const [draw, setDraw] = useState<DrawType | null>(null);
  const [animDraw, setAnimDraw] = useState<DrawType | null>(null);

  /**
   * Called on windows resize
   */
  const onResize = () => {
    const newWidth = window.innerWidth * 0.8;
    const newHeight = window.innerHeight * 0.8;

    setCanvasSize(Math.min(newHeight, newWidth));
  };

  useEffect(() => {
    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return;
    }

    const context = canvas.getContext("2d");
    if (context === null) {
      return;
    }

    if (draw === null) {
      return;
    }

    draw(canvas, context);
  }, [draw]);

  useEffect(() => {
    const animCanvas = animCanvasRef.current;
    if (animCanvas === null) {
      return;
    }

    const animContext = animCanvas.getContext("2d");
    if (animContext === null) {
      return;
    }

    if (animDraw === null) {
      return;
    }

    animDraw(animCanvas, animContext);
  }, [animDraw]);

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

  const drawRectangle = useCallback(
    (context: CanvasRenderingContext2D, rect: number[], strokeStyle: string, lineWidth: number) => {
      const xBase = rect[0];
      const xEnd = rect[2];
      const yBase = rect[1];
      const yEnd = rect[3];

      const width = xEnd - xBase;
      const height = yEnd - yBase;

      context.strokeStyle = strokeStyle;
      context.lineWidth = lineWidth;
      context.beginPath();
      context.rect(xBase, yBase, width, height);
      context.stroke();
    },
    []
  );

  const drawCross = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    strokeStyle: string
  ) => {
    context.strokeStyle = strokeStyle;
    context.beginPath();
    context.moveTo(x - size, y - size);
    context.lineTo(x + size, y + size);
    context.moveTo(x + size, y - size);
    context.lineTo(x - size, y + size);
    context.stroke();
  };

  const drawCircle = useCallback(
    (
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number,
      width: number,
      strokeStyle: string
    ) => {
      context.strokeStyle = strokeStyle;
      context.lineWidth = width;
      context.beginPath();
      context.arc(x, y, (radius * canvasSize) / DEFAULT_CANVAS_SIZE, 0, 2 * Math.PI);
      context.stroke();
    },
    [canvasSize]
  );

  const drawTruth = useCallback(
    (context: CanvasRenderingContext2D) => {
      drawRectangle(context, truth, TRUE_COLOUR, 3);
    },
    [truth, drawRectangle]
  );

  const drawPredicted = useCallback(
    (context: CanvasRenderingContext2D, strokeStyle: string) => {
      drawRectangle(context, predicted, strokeStyle, 3);
    },
    [predicted, drawRectangle]
  );

  const drawHint = useCallback(
    (context: CanvasRenderingContext2D) => {
      const x = truth[0] + (truth[2] - truth[0]) / 2 + Math.random() * 100 - 50;
      const y = truth[1] + (truth[3] - truth[1]) / 2 + Math.random() * 100 - 50;

      drawCircle(context, x, y, 100, 2, INVALID_COLOUR);
    },
    [drawCircle, truth]
  );

  const drawPlayerClick = (
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    playerColour: string
  ) => {
    drawCross(context, x, y, 5, playerColour);
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
  const isPlayerRight = (x: number, y: number) =>
    truth[0] <= x && x <= truth[2] && truth[1] <= y && y <= truth[3];

  useEffect(() => {
    if (!running) {
      return;
    }

    if (timeRemaining <= 0) {
      stopTimer();

      setDraw(() => (_: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
        drawPredicted(context, DEFAULT_COLOUR);

        setTimeout(() => {
          drawTruth(context);
        }, 1000);

        setTimeout(() => {
          if (isAiPredictionRight()) {
            setAiPoints((prevState) => prevState + 1);
            drawPredicted(context, VALID_COLOUR);
            setAiCorrect(true);
          } else {
            drawPredicted(context, INVALID_COLOUR);
            setAiCorrect(false);
          }

          setShowDialog(true);
        }, 2000);
      });
    } else if (timeRemaining <= 2000) {
      setTimerColor("red");
    } else if (timeRemaining <= 5000) {
      if (hinted) {
        return;
      }

      setHinted(true);

      setTimerColor("orange");

      setDraw(() => (_: HTMLCanvasElement, context: CanvasRenderingContext2D) => drawHint(context));
    } else {
      setTimerColor("#373737");
    }
  }, [drawHint, drawPredicted, drawTruth, hinted, isAiPredictionRight, running, timeRemaining]);

  const getLeftCubes = (canvas: HTMLCanvasElement) => {
    const leftCubes: number[][] = [];
    const size = canvas.width / 10;

    for (let i = 0; i < 5; i++) {
      const cube = [0, 0, 0, 0];

      cube[0] = 0;
      cube[1] = 2 * i * size;
      cube[2] = size;
      cube[3] = (2 * i + 1) * size;
      leftCubes[i] = cube;
    }

    return leftCubes;
  };

  const getRightCubes = (canvas: HTMLCanvasElement) => {
    const rightCubes: number[][] = [];
    const size = canvas.width / 10;

    for (let i = 0; i < 5; i++) {
      const cube = [0, 0, 0, 0];

      cube[0] = canvas.width - size;
      cube[1] = (2 * i + 1) * size;
      cube[2] = canvas.width;
      cube[3] = 2 * (i + 1) * size;
      rightCubes[i] = cube;
    }

    return rightCubes;
  };

  const drawAiSearchAnimation = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
    const leftCubes = getLeftCubes(canvas);
    const rightCubes = getRightCubes(canvas);
    const offsetX = canvas.width / 10;

    const interval = setInterval(() => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      leftCubes.forEach((cube) => {
        drawRectangle(context, cube, INVALID_COLOUR, 3);

        cube[0] += offsetX;
        cube[2] += offsetX;
      });

      rightCubes.forEach((cube) => {
        drawRectangle(context, cube, TRUE_COLOUR, 3);

        cube[0] -= offsetX;
        cube[2] -= offsetX;
      });
    }, 100);

    // TODO: Play with the time delay
    setTimeout(() => {
      clearInterval(interval);
    }, 1500);
  };

  /**
   * Maps the mouse position relative to the given canvas
   *
   * @param canvas Canvas to map relative to
   * @param clickX Click coordinate on width
   * @param clickY Click coordinate on height
   *
   * @return Click width and height coordinates, relative to the canvas
   */
  const getClickPositionOnCanvas = (canvas: HTMLCanvasElement, clickX: number, clickY: number) => {
    const rect = canvas.getBoundingClientRect();
    const widthScale = canvas.width / rect.width;
    const heightScale = canvas.height / rect.height;

    return {
      x: (clickX - rect.left) * widthScale,
      y: (clickY - rect.top) * heightScale,
    };
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

    stopTimer();

    const [clickX, clickY] = [event.clientX, event.clientY];

    setAnimDraw(() => (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
      drawAiSearchAnimation(canvas, context);
    });

    setDraw(() => (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
      const { x, y } = getClickPositionOnCanvas(canvas, clickX, clickY);

      drawPlayerClick(context, x, y, DEFAULT_COLOUR);

      setTimeout(() => {
        drawPredicted(context, DEFAULT_COLOUR);
      }, 1000);

      setTimeout(() => {
        drawTruth(context);
      }, 1500);

      setTimeout(() => {
        if (isPlayerRight(x, y)) {
          setPlayerPoints((prevState) => prevState + 1);
          drawPlayerClick(context, x, y, VALID_COLOUR);
          setPlayerCorrect(true);
        } else {
          drawPlayerClick(context, x, y, INVALID_COLOUR);
          setPlayerCorrect(false);
        }
      }, 2000);

      setTimeout(() => {
        if (isAiPredictionRight()) {
          setAiPoints((prevState) => prevState + 1);
          drawPredicted(context, VALID_COLOUR);
          setAiCorrect(true);
        } else {
          drawPredicted(context, INVALID_COLOUR);
          setAiCorrect(false);
        }

        setShowDialog(true);
      }, 2500);
    });
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
   * Maps the coordinates of a given rectangle according to the current canvas size
   *
   * @param rect Coordinates for the corners of the rectangle to map
   */
  const mapCoordinates = (rect: number[]): number[] =>
    rect.map((coordinate) => (coordinate * canvasSize) / DEFAULT_CANVAS_SIZE);

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
        setAnimDraw(() => (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
          context.clearRect(0, 0, canvas.width, canvas.height);
        });

        setDraw(() => (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
        });

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
    setCurrentRound((prevState) => prevState + 1);
    setShowDialog(false);
    setAiCorrect(false);
    setPlayerCorrect(false);
    setHinted(false);
    setLoading(true);

    const fileNumber = getNewFileNumber();

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
    const date = new Date();
    const entry = {
      user: username,
      score: playerPoints,
      day: date.getDate(),
      month: DbUtils.monthNames[date.getMonth()],
      year: date.getFullYear(),
    };

    const docNameForDaily = `${entry.year}.${entry.month}.${entry.day}.${entry.user}`;
    const docNameForMonthly = `${entry.year}.${entry.month}.${entry.user}`;
    const docNameForAllTime = entry.user;

    const dailySnapshot = await db
      .collection(DbUtils.DAILY_LEADERBOARD)
      .where("year", "==", entry.year)
      .where("month", "==", entry.month)
      .where("day", "==", entry.day)
      .where("user", "==", username)
      .where("score", ">", playerPoints)
      .get();

    if (dailySnapshot.empty) {
      await db.collection(DbUtils.DAILY_LEADERBOARD).doc(docNameForDaily).set(entry);
    }

    const monthlySnapshot = await db
      .collection(DbUtils.MONTHLY_LEADERBOARD)
      .where("year", "==", entry.year)
      .where("month", "==", entry.month)
      .where("user", "==", username)
      .where("score", ">", playerPoints)
      .get();

    if (monthlySnapshot.empty) {
      await db.collection(DbUtils.MONTHLY_LEADERBOARD).doc(docNameForMonthly).set(entry);
    }

    const allTimeSnapshot = await db
      .collection(DbUtils.ALL_TIME_LEADERBOARD)
      .where("user", "==", username)
      .where("score", ">", playerPoints)
      .get();

    if (allTimeSnapshot.empty) {
      await db.collection(DbUtils.ALL_TIME_LEADERBOARD).doc(docNameForAllTime).set(entry);
    }
  };

  const displayCorrect = (correct: boolean) => (
    <span style={{ color: correct ? VALID_COLOUR : INVALID_COLOUR }}>
      {correct ? "Correct!" : "Wrong!"}
    </span>
  );

  const onChangeUsername = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const dialogAction = () => {
    if (currentRound < NUMBER_OF_ROUNDS) {
      return (
        <LoadingButton
          loading={loading}
          buttonDisabled={running || loading}
          onButtonClick={onStartNextClick}
          buttonText={currentRound === 0 ? "Start" : "Next"}
        />
      );
    }

    return (
      <>
        <TwitterShareButton
          url="http://cb3618.pages.doc.ic.ac.uk/spot-the-lesion"
          title={`I got ${playerPoints} points in Spot-the-Lesion! Can you beat my score?`}
        >
          <TwitterIcon size="50px" round />
        </TwitterShareButton>

        <TextField
          label="Username"
          variant="outlined"
          value={username}
          onChange={onChangeUsername}
        />

        <Button
          variant="contained"
          color="primary"
          size="large"
          disabled={running || loading}
          onClick={uploadScore}
        >
          Submit Score
        </Button>
      </>
    );
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
        </Toolbar>
      </AppBar>

      <div className={classes.container}>
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
            width={canvasSize}
            height={canvasSize}
          />

          <canvas
            className={classes.canvas}
            ref={animCanvasRef}
            width={canvasSize}
            height={canvasSize}
            onClick={onCanvasClick}
          />
        </Card>
      </div>

      <Dialog classes={{ paper: classes.dialogPaper }} open={showDialog}>
        <DialogTitle className={classes.result} disableTypography>
          <Typography variant="h3">Results</Typography>
        </DialogTitle>

        <DialogContent>
          <Typography className={classes.result} variant="h4">
            You were: {displayCorrect(playerCorrect)}
          </Typography>

          <Typography className={classes.result} variant="h4">
            AI was: {displayCorrect(aiCorrect)}
          </Typography>

          <Typography className={classes.result} variant="h4">
            Results
          </Typography>

          <Typography className={classes.result} variant="h4">
            Correct (you): {playerPoints}
          </Typography>

          <Typography className={classes.result} variant="h4">
            Correct (AI): {aiPoints}
          </Typography>

          <Typography className={classes.result} variant="h4">
            Total Scans: {currentRound}
          </Typography>
        </DialogContent>

        <DialogActions>{dialogAction()}</DialogActions>
      </Dialog>
    </>
  );
};

export default Game;
