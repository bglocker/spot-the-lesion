import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import {
  AppBar,
  Button,
  Card,
  Dialog,
  IconButton,
  TextField,
  Toolbar,
  ButtonGroup,
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
  mapClickToCanvas,
  mapToCanvasScale,
} from "../../components/CanvasUtils";
import { getImagePath, getIntersectionOverUnion, getJsonPath } from "./GameUitls";
import useInterval from "../../components/useInterval";
import useCanvasContext from "../../components/useCanvasContext";
import LoadingButton from "../../components/LoadingButton";
import Heatmap from "../../components/HeatmapComponent";
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
const INITIAL_TIMER_COLOR = "#373737";

const NUM_ROUNDS = 10;

const ROUND_START_TIME = 10000;

const ANIMATION_TIME = 5000;

const AI_SCORE_INCREASE_RATE = 75;

const NUM_SEARCH_CUBES = 10;

const MAX_CANVAS_SIZE = 750;

const MAX_FILE_NUMBER = 100;

type JsonData = { truth: number[]; predicted: number[] };

const Game: React.FC<GameProps> = ({ setRoute }: GameProps) => {
  const classes = useStyles();

  const seenFiles = new Set<number>();

  const [context, canvasRef] = useCanvasContext();
  const [animationContext, animationCanvasRef] = useCanvasContext();

  const [loading, setLoading] = useState(false);

  const [roundRunning, setRoundRunning] = useState(false);
  const [endRunning, setEndRunning] = useState(false);
  const [animationRunning, setAnimationRunning] = useState(false);

  const [roundTime, setRoundTime] = useState(ROUND_START_TIME);
  const [endTime, setEndTime] = useState(0);
  const [animationPosition, setAnimationPosition] = useState(0);

  const [hinted, setHinted] = useState(false);
  const [timerColor, setTimerColor] = useState(INITIAL_TIMER_COLOR);

  const [imageId, setImageId] = useState(0);
  const [truth, setTruth] = useState<number[]>([]);
  const [predicted, setPredicted] = useState<number[]>([]);
  const [click, setClick] = useState<{ x: number; y: number } | null>(null);

  const [round, setRound] = useState(0);

  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);

  const [playerCorrect, setPlayerCorrect] = useState(false);
  const [aiCorrect, setAiCorrect] = useState(false);

  const [playerCorrectAnswers, setPlayerCorrectAnswers] = useState(0);
  const [aiCorrectAnswers, setAiCorrectAnswers] = useState(0);

  const [username, setUsername] = useState("");

  const [gameMode, setGameMode] = useState(0);
  const [isGameModeSelected, setGameModeSelected] = useState(false);

  const [heatmapDialogOpen, setHeatmapDialogOpen] = useState(false);

  /* TODO: check if upload to database fails to give different message */
  const { enqueueSnackbar } = useSnackbar();

  /**
   * Round timer
   */
  useInterval(() => setRoundTime((prevState) => prevState - 100), roundRunning ? 100 : null);

  /**
   * Round timer based events
   */
  useEffect(() => {
    if (!roundRunning) {
      return;
    }

    if (roundTime === 5000 && !hinted) {
      /* 5 seconds left: draw Hint circle, set Timer to orange */
      setTimerColor("orange");
      setHinted(true);

      const x = truth[0] + (truth[2] - truth[0]) / 2 + Math.random() * 100 - 50;
      const y = truth[1] + (truth[3] - truth[1]) / 2 + Math.random() * 100 - 50;
      const radius = mapToCanvasScale(context, 100);

      drawCircle(context, x, y, radius, 2, INVALID_COLOUR);
    } else if (roundTime === 2000) {
      /* 2 seconds left: set Timer to red */
      setTimerColor("red");
    } else if (roundTime === 0) {
      /* 0 seconds left: start end timer */
      setEndRunning(true);
    }
  }, [context, hinted, roundTime, roundRunning, truth]);

  /**
   * End timer
   */
  useInterval(() => setEndTime((prevState) => prevState + 100), endRunning ? 100 : null);

  /**
   * Upload the player click, in order to gather statistics and generate heatmaps
   *
   * @param x Width coordinate
   * @param y Height coordinate
   */
  const uploadPlayerClick = useCallback(
    async (x: number, y: number) => {
      const docNameForImage = `image_${imageId}`;
      let entry;
      let pointWasClickedBefore = false;

      const newClickPoint = {
        x: Math.round((x * 10000) / context.canvas.width) / 100,
        y: Math.round((y * 10000) / context.canvas.height) / 100,
        clickCount: 1,
      };

      const imageDoc = await db.collection(DbUtils.IMAGES).doc(docNameForImage).get();

      if (!imageDoc.exists) {
        // First time this image showed up in the game - entry will be singleton array
        entry = { clicks: [newClickPoint] };
      } else {
        const { clicks } = imageDoc.data()!;

        clicks.forEach((clk: { x: number; y: number; count: number }) => {
          if (clk.x === x && clk.y === y) {
            clk.count += 1;
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
    [context, imageId]
  );

  /**
   * End timer based events
   */
  useEffect(() => {
    if (!endRunning) {
      return;
    }

    if (endTime === 0) {
      /* 0 seconds passed: draw and upload player click if available, and start the AI search animation */
      setLoading(true);
      setRoundRunning(false);

      if (click) {
        const { x, y } = click;

        drawCross(context, x, y, 5, DEFAULT_COLOUR);

        uploadPlayerClick(Math.round(x), Math.round(y));
      }

      enqueueSnackbar("The system is thinking...");

      setAnimationRunning(true);
    } else if (endTime === ANIMATION_TIME + 100) {
      /* 5 seconds passed: stop AI search animation, draw predicted rectangle in default color */
      setAnimationRunning(false);

      drawRectangle(context, predicted, DEFAULT_COLOUR, 3);
    } else if (endTime === ANIMATION_TIME + 500) {
      /* 5.5 seconds passed: draw truth rectangle */
      drawRectangle(context, truth, TRUE_COLOUR, 3);
    } else if (endTime === ANIMATION_TIME + 1000 && click) {
      /* 6 seconds passed: evaluate player click if available  */
      const { x, y } = click;

      enqueueSnackbar("Checking results...");

      /* Player was successful if the click coordinates are inside the truth rectangle */
      if (truth[0] <= x && x <= truth[2] && truth[1] <= y && y <= truth[3]) {
        const roundScore = (roundTime / 1000) * (hinted ? 10 : 20);

        setPlayerScore((prevState) => prevState + roundScore);
        setPlayerCorrectAnswers((prevState) => prevState + 1);
        setPlayerCorrect(true);

        drawCross(context, x, y, 5, VALID_COLOUR);
      } else {
        drawCross(context, x, y, 5, INVALID_COLOUR);
      }
    } else if (endTime === ANIMATION_TIME + 1500) {
      /* 6.5 seconds passed: evaluate AI prediction */
      const intersectionOverUnion = getIntersectionOverUnion(truth, predicted);

      /* AI was successful if the ratio of the intersection over the union is greater than 0.5 */
      if (intersectionOverUnion > 0.5) {
        const roundScore = Math.round(intersectionOverUnion * AI_SCORE_INCREASE_RATE);

        setAiScore((prevState) => prevState + roundScore);
        setAiCorrectAnswers((prevState) => prevState + 1);
        setAiCorrect(true);

        drawRectangle(context, predicted, VALID_COLOUR, 3);
      } else {
        drawRectangle(context, predicted, INVALID_COLOUR, 3);
      }

      setEndRunning(false);
      setLoading(false);
    }
  }, [
    click,
    context,
    endRunning,
    endTime,
    enqueueSnackbar,
    hinted,
    predicted,
    roundTime,
    truth,
    uploadPlayerClick,
  ]);

  /**
   * Animation timer
   */
  useInterval(
    () => setAnimationPosition((prevState) => prevState + 1),
    animationRunning ? ANIMATION_TIME / (NUM_SEARCH_CUBES * NUM_SEARCH_CUBES) : null
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

    /* Stop when all cube positions were reached */
    if (animationPosition === NUM_SEARCH_CUBES * NUM_SEARCH_CUBES) {
      return;
    }

    const cubeSide = animationContext.canvas.width / NUM_SEARCH_CUBES;
    const baseX = (animationPosition % NUM_SEARCH_CUBES) * cubeSide;
    const baseY = Math.floor(animationPosition / NUM_SEARCH_CUBES) * cubeSide;
    const cube = [baseX, baseY, baseX + cubeSide, baseY + cubeSide];

    drawRectangle(animationContext, cube, VALID_COLOUR, 3);
  }, [animationContext, animationPosition, animationRunning]);

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
  const mapCoordinates = (rect: number[]) => rect.map((x) => mapToCanvasScale(context, x));

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

    const fileNumber = getNewFileNumber();
    setImageId(fileNumber);

    await loadJson(fileNumber);
    await loadImage(fileNumber);

    setRoundTime(ROUND_START_TIME);
    setEndTime(0);
    setAnimationPosition(0);

    setHinted(false);
    setTimerColor(INITIAL_TIMER_COLOR);

    setClick(null);

    setRound((prevState) => prevState + 1);

    setPlayerCorrect(false);
    setAiCorrect(false);

    setRoundRunning(true);
    setLoading(false);
  };

  /**
   * Uploads the score to the database
   */
  const uploadScore = async () => {
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

    const leaderboard =
      gameMode === 0 ? DbUtils.LEADERBOARD_CASUAL : DbUtils.LEADERBOARD_COMPETITIVE;

    const entryName = `${entry.year}.${entry.month}.${entry.day}.${entry.user}`;

    const snapshot = await db
      .collection(leaderboard)
      .where("year", "==", entry.year)
      .where("month", "==", entry.month)
      .where("day", "==", entry.day)
      .where("user", "==", username)
      .get();

    if (snapshot.empty) {
      // First time played today - add this score to DB
      await db.collection(leaderboard).doc(entryName).set(entry);
    } else {
      // Check if this score is better than what this player registered before
      let newScoreRecord = true;
      snapshot.forEach((doc) => {
        if (doc.data().score > entry.score) {
          newScoreRecord = false;
        }
      });

      // Add current score in DB only if it is a new Score Record
      if (newScoreRecord) {
        await db.collection(leaderboard).doc(entryName).set(entry);
      }
    }
  };

  /**
   * Function for displaying a green or red thick depending on the correctness of the answer
   * @param correct - true if answer was correct, false otherwise
   */
  const displayCorrect = (correct: boolean) => {
    if (round === 0 || roundRunning || loading) {
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
    setUsername(event.target.value);
  };

  /**
   * Function for triggering the effects associated with submitting the score
   * Submit button becomes disabled
   * Snackbar triggered
   * Scores uploaded into Firebase
   */
  const onSubmitScore = async () => {
    setLoading(true);
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
    if (round < NUM_ROUNDS || roundRunning || loading) {
      return (
        <LoadingButton
          loading={loading}
          buttonDisabled={roundRunning || loading}
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
          disabled={roundRunning || loading || username === ""}
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
    setHeatmapDialogOpen(true);
  };

  /**
   * Function for closing the heatmap tab
   */
  const closeHeatmap = () => {
    setHeatmapDialogOpen(false);
  };

  const displayGameContent = () => {
    if (!isGameModeSelected) {
      return (
        <>
          <Typography>Choose a game mode</Typography>

          <ButtonGroup>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
                setGameModeSelected(true);
                setGameMode(0);
              }}
            >
              Casual
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => {
                setGameModeSelected(true);
                setGameMode(1);
              }}
            >
              Competitive
            </Button>
          </ButtonGroup>
        </>
      );
    }
    return (
      <>
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
                ref={animationCanvasRef}
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

            <Heatmap currentImageId={imageId} />
          </Dialog>
        </div>
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
          <Button
            hidden={isGameModeSelected}
            disabled={round === 0 || roundRunning || loading}
            variant="contained"
            color="primary"
            size="large"
            onClick={openHeatmap}
          >
            See the heatmap
          </Button>
        </Toolbar>
      </AppBar>
      {displayGameContent()}
    </>
  );
};

export default Game;
