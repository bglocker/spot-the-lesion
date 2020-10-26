import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  AppBar,
  Button,
  Card,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { KeyboardBackspace } from "@material-ui/icons";
import { TwitterIcon, TwitterShareButton } from "react-share";
import { useSnackbar } from "notistack";
import ColoredLinearProgress from "../../components/ColoredLinearProgress";
import useInterval from "../../components/useInterval";
import { db } from "../../firebase/firebaseApp";
import LoadingButton from "../../components/LoadingButton";
import DbUtils from "../../utils/DbUtils";

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
      [theme.breakpoints.only("xs")]: {
        width: 300,
      },
      [theme.breakpoints.only("sm")]: {
        width: 450,
      },
      [theme.breakpoints.only("md")]: {
        width: 550,
      },
      [theme.breakpoints.only("lg")]: {
        width: 650,
      },
      [theme.breakpoints.only("xl")]: {
        width: 750,
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
      [theme.breakpoints.only("xs")]: {
        height: 300,
        width: 300,
      },
      [theme.breakpoints.only("sm")]: {
        height: 450,
        width: 450,
      },
      [theme.breakpoints.only("md")]: {
        height: 550,
        width: 550,
      },
      [theme.breakpoints.only("lg")]: {
        height: 650,
        width: 650,
      },
      [theme.breakpoints.only("xl")]: {
        height: 750,
        width: 750,
      },
      display: "grid",
      justifyContent: "center",
      alignItems: "center",
      padding: 8,
    },
    canvas: {
      gridColumnStart: 1,
      gridRowStart: 1,
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
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      margin: 8,
      padding: 8,
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

  const [canvasSize, setCanvasSize] = useState(750);

  const [currentRound, setCurrentRound] = useState(0);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [submitEnabled, setSubmitEnabled] = useState(false);

  const [hinted, setHinted] = useState(false);

  const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME_MS);
  const [timerColor, setTimerColor] = useState("#373737");

  const [username, setUsername] = useState("");

  const [truth, setTruth] = useState<number[]>([]);
  const [predicted, setPredicted] = useState<number[]>([]);

  const [playerScore, setPlayerScore] = useState(0);
  const [aiCorrectAnswers, setAiCorrectAnswers] = useState(0);
  const [playerCorrectAnswers, setPlayerCorrectAnswers] = useState(0);

  const [isPlayerCorrect, setIsPlayerCorrect] = useState(false);
  const [isAiCorrect, setIsAiCorrect] = useState(false);

  type DrawType = (context: CanvasRenderingContext2D) => void;
  const [draw, setDraw] = useState<DrawType | null>(null);
  const [animDraw, setAnimDraw] = useState<DrawType | null>(null);

  /* TODO: check if upload to databse fails to give different message */
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
   * Called on windows resize
   */
  const onResize = () => {
    const newWidth = window.innerWidth * 0.8;
    const newHeight = window.innerHeight * 0.8;

    setCanvasSize(Math.floor(Math.min(newHeight, newWidth)));
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

    draw(context);
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

    animDraw(animContext);
  }, [animDraw]);

  /**
   * Draws a rectangle
   *
   * @param context     Context to draw the rectangle on
   * @param rect        Coordinates for the corners of the rectangle to draw
   * @param strokeStyle Style for drawing the rectangle
   * @param lineWidth   Width of the rectangle lines
   */
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

  /**
   * Draws a cross
   *
   * @param context     Context to draw the cross on
   * @param x           Width coordinate
   * @param y           Height coordinate
   * @param strokeStyle Style for drawing the cross
   */
  const drawCross = useCallback(
    (
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
    },
    []
  );

  /**
   * Draws a circle
   *
   * @param context     Context to draw the circle on
   * @param x           Width coordinate
   * @param y           Height coordinate
   * @param radius      Circle radius
   * @param width       Width of the circle line
   * @param strokeStyle Style for drawing the circle
   */
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

  /**
   * Returns an array of cube coordinates, filling a side of a given canvas,
   * with gaps between every 2 cubes
   *
   * @param numCubes Number of cubes to return (on one side)
   * @param cubeSide Length of a cube side
   * @param left     Whether to generate cubes for the left or right side of canvas
   *
   * @return Array of cube corner coordinates
   */
  const getCubes = useCallback(
    (context: CanvasRenderingContext2D, numCubes: number, cubeSide: number, left: boolean) => {
      const cubes: number[][] = [];

      for (let i = 0; i < numCubes; i++) {
        const cube: number[] = [];

        cube[0] = left ? 0 : context.canvas.width - cubeSide;
        cube[1] = left ? 2 * i * cubeSide : (2 * i + 1) * cubeSide;
        cube[2] = cube[0] + cubeSide;
        cube[3] = cube[1] + cubeSide;

        cubes[i] = cube;
      }

      return cubes;
    },
    []
  );

  /**
   * Draw an AI search animation, rendering cubes on both sides of the canvas,
   * moving towards their opposite side
   *
   * @param context Context to draw the animation on
   */
  const drawAiSearchAnimation = useCallback(
    (context: CanvasRenderingContext2D) => {
      const animationTime = 1000;
      const numCubes = 5;
      const cubeSide = context.canvas.width / (numCubes * 2);
      const leftCubes = getCubes(context, numCubes, cubeSide, true);
      const rightCubes = getCubes(context, numCubes, cubeSide, false);

      /* Draw cubes in initial position */
      leftCubes.forEach((cube) => drawRectangle(context, cube, INVALID_COLOUR, 3));
      rightCubes.forEach((cube) => drawRectangle(context, cube, TRUE_COLOUR, 3));

      const intervalId = window.setInterval(() => {
        /* Clear previous cubes */
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        /* Advance left cubes */
        leftCubes.forEach((cube) => {
          cube[0] += cubeSide;
          cube[2] += cubeSide;

          drawRectangle(context, cube, INVALID_COLOUR, 3);
        });

        /* Advance right cubes */
        rightCubes.forEach((cube) => {
          cube[0] -= cubeSide;
          cube[2] -= cubeSide;

          drawRectangle(context, cube, TRUE_COLOUR, 3);
        });
      }, animationTime / (numCubes * 2));

      setTimeout(() => {
        clearInterval(intervalId);

        /* Clear whole canvas */
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      }, animationTime);
    },
    [drawRectangle, getCubes]
  );

  /**
   * Draws the truth rectangle
   *
   * @param context Context to draw the rectangle on
   */
  const drawTruth = useCallback(
    (context: CanvasRenderingContext2D) => {
      drawRectangle(context, truth, TRUE_COLOUR, 3);
    },
    [truth, drawRectangle]
  );

  /**
   * Draws the predicted rectangle
   *
   * @param context     Context to draw the rectangle on
   * @param strokeStyle Style for drawing the rectangle
   */
  const drawPredicted = useCallback(
    (context: CanvasRenderingContext2D, strokeStyle: string) => {
      drawRectangle(context, predicted, strokeStyle, 3);
    },
    [predicted, drawRectangle]
  );

  /**
   * Draws the hint circle
   *
   * @param context Context to draw the circle on
   */
  const drawHint = useCallback(
    (context: CanvasRenderingContext2D) => {
      const x = truth[0] + (truth[2] - truth[0]) / 2 + Math.random() * 100 - 50;
      const y = truth[1] + (truth[3] - truth[1]) / 2 + Math.random() * 100 - 50;

      drawCircle(context, x, y, 100, 2, INVALID_COLOUR);
    },
    [drawCircle, truth]
  );

  /**
   * Draws the player click cross
   *
   * @param context     Context to draw the cross on
   * @param x           Width coordinate
   * @param y           Height coordinate
   * @param strokeStyle Style for drawing the cross
   */
  const drawPlayerClick = useCallback(
    (context: CanvasRenderingContext2D, x: number, y: number, strokeStyle: string) => {
      drawCross(context, x, y, 5, strokeStyle);
    },
    [drawCross]
  );

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
  const isPlayerRight = useCallback(
    (x: number, y: number) => {
      return truth[0] <= x && x <= truth[2] && truth[1] <= y && y <= truth[3];
    },
    [truth]
  );

  useEffect(() => {
    if (!running) {
      return;
    }

    if (timeRemaining <= 0) {
      setLoading(true);
      stopTimer();

      setAnimDraw(() => (context: CanvasRenderingContext2D) => {
        drawAiSearchAnimation(context);
      });

      setDraw(() => (context: CanvasRenderingContext2D) => {
        setTimeout(() => {
          drawPredicted(context, DEFAULT_COLOUR);
        }, 1000);

        setTimeout(() => {
          drawTruth(context);
        }, 1500);

        setTimeout(() => {
          if (isAiPredictionRight()) {
            setAiCorrectAnswers((prevState) => prevState + 1);
            drawPredicted(context, VALID_COLOUR);
            setIsAiCorrect(true);
          } else {
            drawPredicted(context, INVALID_COLOUR);
            setIsAiCorrect(false);
          }

          setLoading(false);
        }, 2500);
      });
    } else if (timeRemaining <= 2000) {
      setTimerColor("red");
    } else if (timeRemaining <= 5000) {
      if (hinted) {
        return;
      }

      setHinted(true);

      setTimerColor("orange");

      setDraw(() => (context: CanvasRenderingContext2D) => drawHint(context));
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
  ]);

  /**
   * Maps the mouse position relative to the given canvas
   *
   * @param canvas Canvas to map relative to
   * @param clickX Click coordinate on width
   * @param clickY Click coordinate on height
   *
   * @return Click width and height coordinates, relative to the canvas
   */
  const getClickPositionOnCanvas = useCallback(
    (context: CanvasRenderingContext2D, clickX: number, clickY: number) => {
      const rect = context.canvas.getBoundingClientRect();
      const widthScale = context.canvas.width / rect.width;
      const heightScale = context.canvas.height / rect.height;

      return {
        x: (clickX - rect.left) * widthScale,
        y: (clickY - rect.top) * heightScale,
      };
    },
    []
  );

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

    setAnimDraw(() => (context: CanvasRenderingContext2D) => drawAiSearchAnimation(context));

    setDraw(() => (context: CanvasRenderingContext2D) => {
      const { x, y } = getClickPositionOnCanvas(context, clickX, clickY);

      drawPlayerClick(context, x, y, DEFAULT_COLOUR);

      setTimeout(() => {
        drawPredicted(context, DEFAULT_COLOUR);
      }, 1000);

      setTimeout(() => {
        drawTruth(context);
      }, 1500);

      setTimeout(() => {
        if (isPlayerRight(x, y)) {
          const timeRate = timeRemaining / 1000;
          const increaseRate = hinted ? timeRate * 10 : timeRate * 20;
          setPlayerCorrectAnswers((prevState) => prevState + 1);
          setPlayerScore((prevState) => prevState + increaseRate);
          drawPlayerClick(context, x, y, VALID_COLOUR);
          setIsPlayerCorrect(true);
        } else {
          drawPlayerClick(context, x, y, INVALID_COLOUR);
          setIsPlayerCorrect(false);
        }
      }, 2000);

      setTimeout(() => {
        if (isAiPredictionRight()) {
          setAiCorrectAnswers((prevState) => prevState + 1);
          drawPredicted(context, VALID_COLOUR);
          setIsAiCorrect(true);
        } else {
          drawPredicted(context, INVALID_COLOUR);
          setIsAiCorrect(false);
        }

        setLoading(false);
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
   * Maps the coordinates of a given rectangle according to the current canvas size
   *
   * @param rect Coordinates for the corners of the rectangle to map
   */
  const mapCoordinates = (rect: number[]): number[] =>
    rect.map((coordinate) => (coordinate * canvasSize) / DEFAULT_CANVAS_SIZE);

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
        setAnimDraw(() => (context: CanvasRenderingContext2D) =>
          context.clearRect(0, 0, context.canvas.width, context.canvas.height)
        );

        setDraw(() => (context: CanvasRenderingContext2D) => {
          context.clearRect(0, 0, context.canvas.width, context.canvas.height);
          context.drawImage(image, 0, 0, context.canvas.width, context.canvas.height);
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
    setLoading(true);
    setHinted(false);
    setCurrentRound((prevState) => prevState + 1);
    setIsAiCorrect(false);
    setIsPlayerCorrect(false);

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
    if (username === "") {
      return;
    }

    const date = new Date();
    const entry = {
      user: username,
      score: playerScore,
      correctPlayerAnswers: playerCorrectAnswers,
      correctAiAnswers: aiCorrectAnswers,
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
      .where("score", ">", playerScore)
      .get();

    if (dailySnapshot.empty) {
      await db.collection(DbUtils.DAILY_LEADERBOARD).doc(docNameForDaily).set(entry);
    }

    const monthlySnapshot = await db
      .collection(DbUtils.MONTHLY_LEADERBOARD)
      .where("year", "==", entry.year)
      .where("month", "==", entry.month)
      .where("user", "==", username)
      .where("score", ">", playerScore)
      .get();

    if (monthlySnapshot.empty) {
      await db.collection(DbUtils.MONTHLY_LEADERBOARD).doc(docNameForMonthly).set(entry);
    }

    const allTimeSnapshot = await db
      .collection(DbUtils.ALL_TIME_LEADERBOARD)
      .where("user", "==", username)
      .where("score", ">", playerScore)
      .get();

    if (allTimeSnapshot.empty) {
      await db.collection(DbUtils.ALL_TIME_LEADERBOARD).doc(docNameForAllTime).set(entry);
    }
  };

  const displayCorrect = (correct: boolean) =>
    currentRound > 0 && !running && !loading ? (
      <span style={{ color: correct ? VALID_COLOUR : INVALID_COLOUR }}>
        {correct ? "(+ 1)" : "(+ 0)"}
      </span>
    ) : (
      ""
    );

  const onChangeUsername = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value !== "") {
      setSubmitEnabled(true);
    }
    if (event.target.value === "") {
      setSubmitEnabled(false);
    }
    setUsername(event.target.value);
  };

  const onSubmitScore = async () => {
    setSubmitEnabled(false);
    await uploadScore();
    setTimeout(() => {
      setRoute("home");
    }, 2000);
    enqueueSnackbar("Score successfully submitted!");
  };

  const enableNextClick = () => {
    if (currentRound < NUMBER_OF_ROUNDS || running || loading) {
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

  const hideAnswersOnStart = (round: number) => {
    if (round > 0) {
      return (
        <div>
          <Typography className={classes.result} variant="h4">
            You were: {displayCorrect(isPlayerCorrect)}
          </Typography>

          <Typography className={classes.result} variant="h4">
            AI was: {displayCorrect(isAiCorrect)}
          </Typography>

          <Typography className={classes.result} variant="h4">
            Results
          </Typography>
        </div>
      );
    }
    return null;
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

        <div className={classes.sideContainer}>
          <Card className={classes.sideCard}>
            <div>
              <Typography className={classes.result} variant="h5">
                Results
              </Typography>

              <Typography className={classes.result} variant="h6">
                Correct (you): {playerScore}
              </Typography>

              <Typography className={classes.result} variant="h6">
                Correct (AI): {aiCorrectAnswers}
              </Typography>
            </div>

            {enableNextClick()}
          </Card>
        </div>
      </div>
    </>
  );
};

export default Game;
