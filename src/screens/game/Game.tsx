import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  AppBar,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
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
const TOTAL_TIME = 10;

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

  const [currentRound, setCurrentRound] = useState(0);
  const [showDialog, setShowDialog] = useState(true);

  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [hinted, setHinted] = useState(false);

  const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME);
  const [timeRemainingText, setTimeRemainingText] = useState(TOTAL_TIME.toFixed(1));
  const [timerColor, setTimerColor] = useState("#373737");

  const [playerPoints, setPlayerPoints] = useState(0);
  const [aiPoints, setAiPoints] = useState(0);
  const [total, setTotal] = useState(0);

  const [username, setUsername] = useState("");

  const [truth, setTruth] = useState<number[]>([]);
  const [predicted, setPredicted] = useState<number[]>([]);

  const [playerCorrect, setPlayerCorrect] = useState(false);
  const [aiCorrect, setAiCorrect] = useState(false);

  const [playerResultVisible, setPlayerResultVisible] = useState(false);
  const [aiResultVisible, setAiResultVisible] = useState(false);

  type DrawType = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => void;
  const [draw, setDraw] = useState<DrawType | null>(null);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [animDraw, setAnimDraw] = useState<DrawType>(null);

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
   * Called each second, while the game is running,
   */
  const timerTick = () => {
    setTimeRemaining((prevState) => prevState - 0.1);
    setTimeRemainingText(timeRemaining.toFixed(1));
  };

  useInterval(timerTick, running ? 100 : null);

  /**
   * Stops the timer by stopping the current round.
   */
  const stopTimer = () => setRunning(false);

  /**
   * Given the coordinates of two rectangles, returns the value of their intersection
   * over their union.
   *
   * Used in determining the success of a given AI prediction.
   *
   * @param rectA Coordinates for the corners of the first rectangle
   * @param rectB Coordinates for the corners of the second rectangle
   *
   * @return Value of intersection area divided by union area
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

  function setRect(context: CanvasRenderingContext2D, rect: number[]) {
    const xBase = rect[0];
    const xEnd = rect[2];
    const yBase = rect[1];
    const yEnd = rect[3];

    const width = xEnd - xBase;
    const height = yEnd - yBase;

    context.rect(xBase, yBase, width, height);
  }

  const drawRectangle = useCallback(
    (context: CanvasRenderingContext2D, rect: number[], strokeStyle: string, lineWidth: number) => {
      context.strokeStyle = strokeStyle;
      context.lineWidth = lineWidth;
      context.beginPath();
      setRect(context, rect);
      context.stroke();
    },
    []
  );

  const drawTruth = useCallback(
    (_: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
      drawRectangle(context, truth, TRUE_COLOUR, 3);
    },
    [truth, drawRectangle]
  );

  const drawPredicted = useCallback(
    (_: HTMLCanvasElement, context: CanvasRenderingContext2D, strokeStyle: string) => {
      drawRectangle(context, predicted, strokeStyle, 3);
    },
    [predicted, drawRectangle]
  );

  const drawHint = useCallback(
    (_: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
      const x = truth[0] + (truth[2] - truth[0]) / 2 + Math.random() * 100 - 50;
      const y = truth[1] + (truth[3] - truth[1]) / 2 + Math.random() * 100 - 50;

      context.beginPath();
      context.strokeStyle = "red";
      context.lineWidth = 2;
      context.arc(x, y, (100 * canvasSize) / DEFAULT_CANVAS_SIZE, 0, 2 * Math.PI);
      context.stroke();
    },
    [canvasSize, truth]
  );

  const getMousePosition = (playerX: number, playerY: number, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect(); // abs. size of element
    const scaleX = canvas.width / rect.width; // relationship bitmap vs. element for X
    const scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y

    return {
      x: (playerX - rect.left) * scaleX, // scale mouse coordinates after they have
      y: (playerY - rect.top) * scaleY, // been adjusted to be relative to element
    };
  };

  const drawPlayer = useCallback(
    (
      canvas: HTMLCanvasElement,
      context: CanvasRenderingContext2D,
      mouseX: number,
      mouseY: number,
      playerColour: string
    ) => {
      const { x, y } = getMousePosition(mouseX, mouseY, canvas);

      context.strokeStyle = playerColour;
      context.beginPath();
      context.moveTo(x - 5, y - 5);
      context.lineTo(x + 5, y + 5);
      context.moveTo(x + 5, y - 5);
      context.lineTo(x - 5, y + 5);
      context.stroke();
    },
    []
  );

  const isAIPredictionRight = useCallback(() => {
    return getIntersectionOverUnion(truth, predicted) > 0.5;
  }, [truth, predicted]);

  useEffect(() => {
    if (!running) {
      return;
    }

    if (timeRemaining <= 0) {
      stopTimer();

      setDraw(() => (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
        drawPredicted(canvas, context, DEFAULT_COLOUR);

        setTimeout(() => {
          drawTruth(canvas, context);
        }, 1000);

        setTimeout(() => {
          if (isAIPredictionRight()) {
            setAiPoints((prevState) => prevState + 1);
            drawPredicted(canvas, context, VALID_COLOUR);
            setAiCorrect(true);
          } else {
            setAiCorrect(false);
            drawPredicted(canvas, context, INVALID_COLOUR);
          }
          setAiResultVisible(true);
          setPlayerResultVisible(true);
          setShowDialog(true);
        }, 2000);
      });
    } else if (timeRemaining <= 2) {
      setTimerColor("red");
    } else if (timeRemaining <= 5) {
      setTimerColor("orange");

      if (hinted) {
        return;
      }

      setHinted(true);

      setDraw(() => (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) =>
        drawHint(canvas, context)
      );
    } else {
      setTimerColor("#373737");
    }
  }, [
    aiPoints,
    drawHint,
    drawTruth,
    drawPredicted,
    hinted,
    running,
    timeRemaining,
    isAIPredictionRight,
  ]);

  function isPlayerRight(canvas: HTMLCanvasElement, mouseX: number, mouseY: number) {
    const { x, y } = getMousePosition(mouseX, mouseY, canvas);
    return truth[0] <= x && x <= truth[2] && truth[1] <= y && y <= truth[3];
  }

  function getLeftCubes(canvas: HTMLCanvasElement) {
    const leftCubes = [];
    const size = canvas.width / 10;
    for (let i = 0; i < 5; i += 1) {
      const cubeParams = [0, 0, 0, 0];
      cubeParams[0] = 0;
      cubeParams[1] = 2 * i * size;
      cubeParams[2] = size;
      cubeParams[3] = (2 * i + 1) * size;
      leftCubes[i] = cubeParams;
    }
    return leftCubes;
  }

  function getRightCubes(canvas: HTMLCanvasElement) {
    const rightCubes = [];
    const size = canvas.width / 10;
    for (let i = 0; i < 5; i += 1) {
      const cubeParams = [0, 0, 0, 0];
      cubeParams[0] = canvas.width - size;
      cubeParams[1] = (2 * i + 1) * size;
      cubeParams[2] = canvas.width;
      cubeParams[3] = 2 * (i + 1) * size;
      rightCubes[i] = cubeParams;
    }
    return rightCubes;
  }

  function runAiSearchAnimation(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    const leftCubes = getLeftCubes(canvas);
    const rightCubes = getRightCubes(canvas);
    const offsetX = canvas.width / 10;
    // const offsetY = canvas.height / 10;
    const interval = setInterval(() => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      leftCubes.forEach((cube) => {
        drawRectangle(context, cube, INVALID_COLOUR, 3);
        // eslint-disable-next-line no-param-reassign
        cube[0] += offsetX;
        // eslint-disable-next-line no-param-reassign
        cube[2] += offsetX;
      });
      rightCubes.forEach((cube) => {
        drawRectangle(context, cube, "blue", 3);
        // eslint-disable-next-line no-param-reassign
        cube[0] -= offsetX;
        // eslint-disable-next-line no-param-reassign
        cube[2] -= offsetX;
      });
    }, 100);
    // TODO: Play with the time delay
    setTimeout(() => {
      clearInterval(interval);
    }, 1500);
  }

  const onCanvasClick = async (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (timeRemaining <= 0 || !running) {
      return;
    }

    stopTimer();

    const [mouseX, mouseY] = [event.clientX, event.clientY];

    setAnimDraw(() => (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
      runAiSearchAnimation(canvas, context);
    });

    setDraw(() => (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
      drawPlayer(canvas, context, mouseX, mouseY, DEFAULT_COLOUR);
      setTimeout(() => {
        drawPredicted(canvas, context, DEFAULT_COLOUR);
      }, 1000);

      setTimeout(() => {
        drawTruth(canvas, context);
      }, 1500);

      setTimeout(() => {
        if (isPlayerRight(canvas, mouseX, mouseY)) {
          setPlayerPoints((prevState) => prevState + 1);
          drawPlayer(canvas, context, mouseX, mouseY, VALID_COLOUR);
          setPlayerCorrect(true);
        } else {
          drawPlayer(canvas, context, mouseX, mouseY, INVALID_COLOUR);
          setPlayerCorrect(false);
        }
        setPlayerResultVisible(true);
      }, 2000);

      setTimeout(() => {
        if (isAIPredictionRight()) {
          setAiPoints((prevState) => prevState + 1);
          drawPredicted(canvas, context, VALID_COLOUR);
          setAiCorrect(true);
        } else {
          drawPredicted(canvas, context, INVALID_COLOUR);
          setAiCorrect(false);
        }
        setAiResultVisible(true);
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
    setAiResultVisible(false);
    setPlayerResultVisible(false);
    setTimeRemaining(TOTAL_TIME);
    setHinted(false);
    setLoading(true);

    const fileNumber = getNewFileNumber();

    await loadJson(fileNumber);
    await loadImage(fileNumber);

    setTimeRemainingText(timeRemaining.toFixed(1));
    setRunning(true);
    setLoading(false);
    setTotal((prevState) => prevState + 1);
  };

  /**
   * Called when the Start/Next button is clicked
   */
  const onStartNextClick = async () => {
    await startNewRound();
  };

  const submitScores = async () => {
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

    async function updateLeaderBoardFirebase() {
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
      const alltimeSnapshot = await db
        .collection(DbUtils.ALL_TIME_LEADERBOARD)
        .where("user", "==", username)
        .where("score", ">", playerPoints)
        .get();
      if (alltimeSnapshot.empty) {
        await db.collection(DbUtils.ALL_TIME_LEADERBOARD).doc(docNameForAllTime).set(entry);
      }
    }

    await updateLeaderBoardFirebase();
  };

  const displayCorrect = (correct: boolean, visible: boolean) => {
    if (!visible) {
      return null;
    }

    return (
      <span style={{ color: correct ? VALID_COLOUR : INVALID_COLOUR }}>
        {correct ? "Correct!" : "Wrong!"}
      </span>
    );
  };

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
          onClick={submitScores}
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
            Time remaining: {timeRemainingText}s
          </Typography>

          <ColoredLinearProgress
            barColor={timerColor}
            variant="determinate"
            value={timeRemaining * 10}
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

      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={showDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle className={classes.result} id="alert-dialog-title">
          <Typography variant="h3">Results</Typography>
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography className={classes.result} variant="h4">
              You were: {displayCorrect(playerCorrect, playerResultVisible)}
            </Typography>

            <Typography className={classes.result} variant="h4">
              AI was: {displayCorrect(aiCorrect, aiResultVisible)}
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
              Total Scans: {total}
            </Typography>
          </DialogContentText>
        </DialogContent>

        <DialogActions>{dialogAction()}</DialogActions>
      </Dialog>
    </>
  );
};

export default Game;
