import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
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
import ColoredLinearProgress from "../../components/ColoredLinearProgress";
import useInterval from "../../components/useInterval";
import { db } from "../../firebase/firebaseApp";
import LoadingButton from "../../components/LoadingButton";
import DbUtils from "../../utils/DbUtils";
import useCanvasContext from "../../components/useCanvasContext";

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
      width: "100%",
      height: "100%",
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
const MAX_CANVAS_SIZE = 750;

const MAX_FILE_NUMBER = 100;

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

  const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME_MS);
  const [timerColor, setTimerColor] = useState("#373737");

  const [truth, setTruth] = useState<number[]>([]);
  const [predicted, setPredicted] = useState<number[]>([]);

  const [playerPoints, setPlayerPoints] = useState(0);
  const [aiPoints, setAiPoints] = useState(0);

  const [playerCorrect, setPlayerCorrect] = useState(false);
  const [aiCorrect, setAiCorrect] = useState(false);

  const [username, setUsername] = useState("");

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

  /**
   * Draws a rectangle
   *
   * @param ctx         Context to draw the rectangle on
   * @param rect        Coordinates for the corners of the rectangle to draw
   * @param strokeStyle Style for drawing the rectangle
   * @param lineWidth   Width of the rectangle lines
   */
  const drawRectangle = useCallback(
    (ctx: CanvasRenderingContext2D, rect: number[], strokeStyle: string, lineWidth: number) => {
      const xBase = rect[0];
      const xEnd = rect[2];
      const yBase = rect[1];
      const yEnd = rect[3];

      const width = xEnd - xBase;
      const height = yEnd - yBase;

      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.rect(xBase, yBase, width, height);
      ctx.stroke();
    },
    []
  );

  /**
   * Draws a cross
   *
   * @param ctx         Context to draw the cross on
   * @param x           Width coordinate
   * @param y           Height coordinate
   * @param strokeStyle Style for drawing the cross
   */
  const drawCross = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, strokeStyle: string) => {
      ctx.strokeStyle = strokeStyle;
      ctx.beginPath();
      ctx.moveTo(x - size, y - size);
      ctx.lineTo(x + size, y + size);
      ctx.moveTo(x + size, y - size);
      ctx.lineTo(x - size, y + size);
      ctx.stroke();
    },
    []
  );

  /**
   * Draws a circle
   *
   * @param ctx         Context to draw the circle on
   * @param x           Width coordinate
   * @param y           Height coordinate
   * @param radius      Circle radius
   * @param width       Width of the circle line
   * @param strokeStyle Style for drawing the circle
   */
  const drawCircle = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number,
      width: number,
      strokeStyle: string
    ) => {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    },
    []
  );

  /**
   * Returns an array of cube coordinates, filling a side of a given canvas,
   * with gaps between every 2 cubes
   *
   * @param canvasWidth Width of the canvas, used to position cubes on the right side
   * @param numCubes    Number of cubes to return (on one side)
   * @param cubeSide    Length of a cube side
   * @param left        Whether to generate cubes for the left or right side of canvas
   *
   * @return Array of cube corner coordinates
   */
  const getCubes = useCallback(
    (canvasWidth: number, numCubes: number, cubeSide: number, left: boolean) => {
      const cubes: number[][] = [];

      for (let i = 0; i < numCubes; i++) {
        const cube: number[] = [];

        cube[0] = left ? 0 : canvasWidth - cubeSide;
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
    const animationTime = 1000;
    const numCubes = 5;

    const canvasWidth = animContext.canvas.width;
    const cubeSide = canvasWidth / (numCubes * 2);
    const leftCubes = getCubes(canvasWidth, numCubes, cubeSide, true);
    const rightCubes = getCubes(canvasWidth, numCubes, cubeSide, false);

    /* Draw cubes in initial position */
    leftCubes.forEach((cube) => drawRectangle(animContext, cube, INVALID_COLOUR, 3));
    rightCubes.forEach((cube) => drawRectangle(animContext, cube, TRUE_COLOUR, 3));

    const intervalId = window.setInterval(() => {
      /* Clear previous cubes */
      clearAnimCanvas();

      /* Advance left cubes */
      leftCubes.forEach((cube) => {
        cube[0] += cubeSide;
        cube[2] += cubeSide;

        drawRectangle(animContext, cube, INVALID_COLOUR, 3);
      });

      /* Advance right cubes */
      rightCubes.forEach((cube) => {
        cube[0] -= cubeSide;
        cube[2] -= cubeSide;

        drawRectangle(animContext, cube, TRUE_COLOUR, 3);
      });
    }, animationTime / (numCubes * 2));

    setTimeout(() => {
      clearInterval(intervalId);

      clearAnimCanvas();
    }, animationTime);
  }, [animContext, clearAnimCanvas, drawRectangle, getCubes]);

  /**
   * Draws the truth rectangle
   */
  const drawTruth = useCallback(() => {
    drawRectangle(context, truth, TRUE_COLOUR, 3);
  }, [context, drawRectangle, truth]);

  /**
   * Draws the predicted rectangle
   * @param strokeStyle Style for drawing the rectangle
   */
  const drawPredicted = useCallback(
    (strokeStyle: string) => {
      drawRectangle(context, predicted, strokeStyle, 3);
    },
    [context, drawRectangle, predicted]
  );

  /**
   * Draws the hint circle
   */
  const drawHint = useCallback(() => {
    const x = truth[0] + (truth[2] - truth[0]) / 2 + Math.random() * 100 - 50;
    const y = truth[1] + (truth[3] - truth[1]) / 2 + Math.random() * 100 - 50;
    const radius = 100;

    drawCircle(context, x, y, mapToCanvasScale(radius), 2, INVALID_COLOUR);
  }, [context, drawCircle, mapToCanvasScale, truth]);

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
      }, 1000);

      setTimeout(() => {
        drawTruth();
      }, 1500);

      setTimeout(() => {
        if (isAiPredictionRight()) {
          setAiPoints((prevState) => prevState + 1);
          drawPredicted(VALID_COLOUR);
          setAiCorrect(true);
        } else {
          drawPredicted(INVALID_COLOUR);
          setAiCorrect(false);
        }

        setLoading(false);
      }, 2500);
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

    drawAiSearchAnimation();

    const { x, y } = getClickPositionOnCanvas(clickX, clickY);

    drawPlayerClick(x, y, DEFAULT_COLOUR);

    setTimeout(() => {
      drawPredicted(DEFAULT_COLOUR);
    }, 1000);

    setTimeout(() => {
      drawTruth();
    }, 1500);

    setTimeout(() => {
      if (isPlayerRight(x, y)) {
        setPlayerPoints((prevState) => prevState + 1);
        drawPlayerClick(x, y, VALID_COLOUR);
        setPlayerCorrect(true);
      } else {
        drawPlayerClick(x, y, INVALID_COLOUR);
        setPlayerCorrect(false);
      }
    }, 2000);

    setTimeout(() => {
      if (isAiPredictionRight()) {
        setAiPoints((prevState) => prevState + 1);
        drawPredicted(VALID_COLOUR);
        setAiCorrect(true);
      } else {
        drawPredicted(INVALID_COLOUR);
        setAiCorrect(false);
      }

      setLoading(false);
    }, 2500);
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
    setCurrentRound((prevState) => prevState + 1);
    setAiCorrect(false);
    setPlayerCorrect(false);

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

  const displayCorrect = (correct: boolean) =>
    currentRound > 0 && !running && !loading ? (
      <span style={{ color: correct ? VALID_COLOUR : INVALID_COLOUR }}>
        {correct ? "(+ 1)" : "(+ 0)"}
      </span>
    ) : (
      ""
    );

  const onChangeUsername = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const onSubmitScore = async () => {
    await uploadScore();
    setRoute("leaderboard");
  };

  const dialogAction = () => {
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
          onClick={onSubmitScore}
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
            <div>
              <Typography className={classes.result} variant="h5">
                Results
              </Typography>

              <Typography className={classes.result} variant="h6">
                Correct (you): {playerPoints} {displayCorrect(playerCorrect)}
              </Typography>

              <Typography className={classes.result} variant="h6">
                Correct (AI): {aiPoints} {displayCorrect(aiCorrect)}
              </Typography>
            </div>

            {dialogAction()}
          </Card>
        </div>
      </div>
    </>
  );
};

export default Game;
