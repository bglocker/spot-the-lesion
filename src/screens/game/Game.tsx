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
import {
  drawCross,
  drawCircle,
  drawRectangle,
  mapToCanvasScale,
} from "../../components/CanvasUtils";
import { getImagePath, getIntersectionOverUnion, getJsonPath } from "./GameUitls";
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
  })
);

const VALID_COLOUR = "green";
const INVALID_COLOUR = "red";
const DEFAULT_COLOUR = "yellow";
const TRUE_COLOUR = "blue";

const NUMBER_OF_ROUNDS = 10;
const TOTAL_TIME_MS = 10000;
const AI_SCORE_INCREASE_RATE = 75;

const MAX_CANVAS_SIZE = 750;

const MAX_FILE_NUMBER = 100;
const AI_ANIMATION_TIME = 5000;

type JsonData = { truth: number[]; predicted: number[] };

const Game: React.FC<GameProps> = ({ setRoute }: GameProps) => {
  const classes = useStyles();

  const seenFiles = new Set<number>();

  const [context, canvasRef] = useCanvasContext();
  const [animContext, animCanvasRef] = useCanvasContext();

  const [round, setRound] = useState(0);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [hinted, setHinted] = useState(false);

  const [roundTime, setRoundTime] = useState(TOTAL_TIME_MS);
  const [timerColor, setTimerColor] = useState("#373737");

  const [truth, setTruth] = useState<number[]>([]);
  const [predicted, setPredicted] = useState<number[]>([]);

  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);

  const [playerCorrect, setPlayerCorrect] = useState(false);
  const [aiCorrect, setAiCorrect] = useState(false);

  const [playerCorrectAnswers, setPlayerCorrectAnswers] = useState(0);
  const [aiCorrectAnswers, setAiCorrectAnswers] = useState(0);

  const [username, setUsername] = useState("");

  const [imageId, setImageId] = useState(0);

  const [submitEnabled, setSubmitEnabled] = useState(false);
  const [heatmapEnable, setHeatmapEnabled] = useState(false);

  // const [dataPoints, setDataPoints] = useState<[number, number][]>([]);

  /**
   * The heatmap dialog box information
   */
  const [heatmapDialogOpen, setHeatmapDialogOpen] = useState(false);

  /* TODO: check if upload to database fails to give different message */
  const { enqueueSnackbar } = useSnackbar();

  /**
   * Called every timer tick
   */
  const timerTick = () => {
    setRoundTime((prevState) => prevState - 100);
  };

  useInterval(timerTick, running ? 100 : null);

  /**
   * Draws the predicted rectangle
   *
   * @param strokeStyle Style for drawing the rectangle
   */
  const drawPredicted = useCallback(
    (strokeStyle: string) => {
      drawRectangle(context, predicted, strokeStyle, 3);
    },
    [context, predicted]
  );

  /**
   * Draws the truth rectangle
   */
  const drawTruth = useCallback(() => {
    drawRectangle(context, truth, TRUE_COLOUR, 3);
  }, [context, truth]);

  /**
   * Draws the hint circle
   */
  const drawHint = useCallback(() => {
    const x = truth[0] + (truth[2] - truth[0]) / 2 + Math.random() * 100 - 50;
    const y = truth[1] + (truth[3] - truth[1]) / 2 + Math.random() * 100 - 50;
    const radius = 100;

    drawCircle(context, x, y, mapToCanvasScale(radius, context), 2, INVALID_COLOUR);
  }, [context, truth]);

  /**
   * Draws the player click cross
   *
   * @param x           Width coordinate
   * @param y           Height coordinate
   * @param strokeStyle Style for drawing the cross
   */
  const drawPlayerClick = useCallback(
    (x: number, y: number, strokeStyle: string) => {
      drawCross(context, x, y, 5, strokeStyle);
    },
    [context]
  );

  const setCube = useCallback(
    (cube: number[], baseCornerX: number, baseCornerY: number, cubeSide: number) => {
      cube[0] = baseCornerX;
      cube[1] = baseCornerY;
      cube[2] = baseCornerX + cubeSide;
      cube[3] = baseCornerY + cubeSide;
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
   * Draw an AI search animation
   */
  const drawAiSearchAnimation = useCallback(() => {
    enqueueSnackbar("The system is thinking...");

    /* Number of cubes on width or height */
    const numCubes = 10;

    const canvasWidth = animContext.canvas.width;
    const canvasHeight = animContext.canvas.height;
    const cubeSide = canvasWidth / numCubes;
    const cube: number[] = [];

    setCube(cube, 0, 0, cubeSide);

    /* Draw cubes in initial position */
    drawRectangle(animContext, cube, VALID_COLOUR, 3);

    const intervalId = window.setInterval(() => {
      /* Clear previous cubes */
      clearAnimCanvas();

      /* Advance cube to right */
      cube[0] += cubeSide;
      cube[2] += cubeSide;

      drawRectangle(animContext, cube, VALID_COLOUR, 3);

      /* When cube gets to right-most bound, advance cube below & restart */
      if (cube[2] > canvasWidth) {
        setCube(cube, -cubeSide, cube[1] + cubeSide, cubeSide);
      }

      /* When cube gets out of lower bound, end animation */
      if (cube[1] > canvasHeight) {
        clearInterval(intervalId);
        clearAnimCanvas();
      }
    }, AI_ANIMATION_TIME / (numCubes * numCubes));
  }, [animContext, clearAnimCanvas, enqueueSnackbar, setCube]);

  const checkPlayer = useCallback(
    (x: number, y: number) => {
      enqueueSnackbar("Checking results...");

      /* Player was successful if the click coordinates are inside the truth rectangle */
      if (truth[0] <= x && x <= truth[2] && truth[1] <= y && y <= truth[3]) {
        const roundScore = (roundTime / 1000) * (hinted ? 10 : 20);

        setPlayerScore((prevState) => prevState + roundScore);
        setPlayerCorrectAnswers((prevState) => prevState + 1);
        setPlayerCorrect(true);

        drawPlayerClick(x, y, VALID_COLOUR);
      } else {
        setPlayerCorrect(false);

        drawPlayerClick(x, y, INVALID_COLOUR);
      }
    },
    [drawPlayerClick, enqueueSnackbar, hinted, roundTime, truth]
  );

  const checkAi = useCallback(() => {
    const intersectionOverUnion = getIntersectionOverUnion(truth, predicted);

    /* Ai was successful if the ratio of the intersection over the union is greater than 0.5 */
    if (intersectionOverUnion > 0.5) {
      const roundScore = Math.round(intersectionOverUnion * AI_SCORE_INCREASE_RATE);

      setAiScore((prevState) => prevState + roundScore);
      setAiCorrectAnswers((prevState) => prevState + 1);
      setAiCorrect(true);

      drawPredicted(VALID_COLOUR);
    } else {
      setAiCorrect(false);

      drawPredicted(INVALID_COLOUR);
    }

    /* TODO: final state reset */
    setHeatmapEnabled(true);
    setHinted(false);
    setLoading(false);
  }, [drawPredicted, predicted, truth]);

  /**
   * Upload the player click, in order to gather statistics and generate heatmaps
   *
   * @param x       Width coordinate
   * @param y       Height coordinate
   */
  const uploadPlayerClick = useCallback(
    async (x: number, y: number) => {
      const docNameForImage = `image_${imageId}`;
      let entry;
      let pointWasClickedBefore = false;

      const newClickPoint = {
        x,
        y,
        clickCount: 1,
      };

      const imageDoc = await db.collection(DbUtils.IMAGES).doc(docNameForImage).get();

      if (!imageDoc.exists) {
        // First time this image showed up in the game - entry will be singleton array
        entry = { clicks: [newClickPoint] };
      } else {
        const { clicks } = imageDoc.data()!;

        clicks.forEach((click: { x: number; y: number; count: number }) => {
          if (click.x === x && click.y === y) {
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
    },
    [imageId]
  );

  /**
   * Ends the current round, drawing the search animations, and calculating AI and Player scores
   *
   * @param click Player click position, undefined if timer ended before the player clicked
   */
  const endRound = useCallback(
    (click?: { x: number; y: number }) => {
      setLoading(true);
      setRunning(false);

      if (click !== undefined) {
        const { x, y } = click;

        drawPlayerClick(x, y, DEFAULT_COLOUR);

        uploadPlayerClick(Math.round(x), Math.round(y));
      }

      drawAiSearchAnimation();

      setTimeout(() => {
        drawPredicted(DEFAULT_COLOUR);
      }, AI_ANIMATION_TIME);

      setTimeout(() => {
        drawTruth();
      }, AI_ANIMATION_TIME + 500);

      if (click !== undefined) {
        const { x, y } = click;

        setTimeout(() => {
          checkPlayer(x, y);
        }, AI_ANIMATION_TIME + 1000);
      }

      setTimeout(() => {
        checkAi();
      }, AI_ANIMATION_TIME + 1500);
    },
    [
      checkAi,
      checkPlayer,
      drawAiSearchAnimation,
      drawPlayerClick,
      drawPredicted,
      drawTruth,
      uploadPlayerClick,
    ]
  );

  /**
   * Track roundTime based events
   */
  useEffect(() => {
    if (!running) {
      return;
    }

    if (roundTime === 0) {
      endRound();
    } else if (roundTime === 2000) {
      setTimerColor("red");
    } else if (roundTime === 5000 && !hinted) {
      setTimerColor("orange");
      setHinted(true);

      drawHint();
    } else if (roundTime === 10000) {
      setTimerColor("#373737");
    }
  }, [drawHint, endRound, hinted, roundTime, running]);

  // <editor-fold>
  /**
   * Maps the click position relative to the canvas
   *
   * @param event Mouse event, used to get click position
   *
   * @return Click coordinates relative to the canvas
   */
  const mapClickToCanvas = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const rect = context.canvas.getBoundingClientRect();
    const widthScale = context.canvas.width / rect.width;
    const heightScale = context.canvas.height / rect.height;

    return {
      x: (event.clientX - rect.left) * widthScale,
      y: (event.clientY - rect.top) * heightScale,
    };
  };

  /**
   * Called when the canvas is clicked
   *
   * @param event Mouse event, used to get click position
   */
  const onCanvasClick = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!running) {
      return;
    }

    endRound(mapClickToCanvas(event));
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
   * Maps the coordinates of a given rectangle to the current canvas scale
   *
   * @param rect Coordinates for the corners of the rectangle to map
   *
   * @return Given rectangle coordinates, mapped to the canvas scale
   */
  const mapCoordinates = (rect: number[]) => rect.map((x) => mapToCanvasScale(x, context));

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
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.drawImage(image, 0, 0, context.canvas.width, context.canvas.height);

        resolve();
      };

      image.onerror = reject;

      /* Set source after onLoad to ensure onLoad gets called (in case the image is cached) */
      image.src = getImagePath(fileNumber);
    });

  /**
   * Starts a new round, loading a new image and its corresponding JSON data
   */
  const startRound = async () => {
    setLoading(true);
    setRound((prevState) => prevState + 1);

    const fileNumber = getNewFileNumber();
    setImageId(fileNumber);

    await loadJson(fileNumber);
    await loadImage(fileNumber);

    setRoundTime(TOTAL_TIME_MS);
    setRunning(true);
    setLoading(false);
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
      .where("score", ">", playerScore)
      .get();

    if (snapshot.empty) {
      await db.collection(DbUtils.LEADERBOARD).doc(entryName).set(entry);
    }
  };

  /**
   * Function for displaying a green or red thick depending on the correctness of the answer
   * @param correct - true if answer was correct, false otherwise
   */
  const displayCorrect = (correct: boolean) => {
    if (round === 0 || running || loading) {
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
    if (round < NUMBER_OF_ROUNDS || running || loading) {
      return (
        <LoadingButton
          loading={loading}
          buttonDisabled={running || loading}
          onButtonClick={startRound}
          buttonText={round === 0 ? "START" : "NEXT"}
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

  const getClickedPoints = async () => {
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
   * Function for opening the heatmap tab
   */
  const openHeatmap = () => {
    getClickedPoints();
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
              Time remaining: {(roundTime / 1000).toFixed(1)}s
            </Typography>

            <ColoredLinearProgress
              barColor={timerColor}
              variant="determinate"
              value={roundTime / 100}
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
  // </editor-fold>
};

export default Game;
