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
  Container,
} from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { KeyboardBackspace, Check, Clear, Close } from "@material-ui/icons";
import { TwitterIcon, TwitterShareButton } from "react-share";
import { useSnackbar } from "notistack";
import ColoredLinearProgress from "../../components/ColoredLinearProgress";
import LoadingButton from "../../components/LoadingButton";
import HeatmapDisplay from "../../components/HeatmapDisplay";
import useInterval from "../../components/useInterval";
import useCanvasContext from "../../components/useCanvasContext";
import {
  drawCross,
  drawCircle,
  drawRectangle,
  mapClickToCanvas,
  mapToCanvasScale,
} from "../../components/CanvasUtils";
import { getImagePath, getIntersectionOverUnion, getJsonPath } from "./GameUitls";
import DbUtils from "../../utils/DbUtils";
import { db } from "../../firebase/firebaseApp";

const useStyles = makeStyles((theme: Theme) =>
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
      [theme.breakpoints.down("sm")]: {
        flex: 0,
      },
      [theme.breakpoints.up("md")]: {
        flex: 1,
      },
    },
    upperBarCanvasContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    hintButtonContainer: {
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
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
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
    timer: {
      marginBottom: 8,
      textAlign: "center",
      fontSize: "1.5rem",
      color: (props: Record<string, string>) => props.timerColor,
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
      flexDirection: "column",
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
    gameModeSelectionText: {
      alignItems: "center",
      alignSelf: "center",
      justifyContent: "center",
      textAlign: "center",
      margin: 8,
      fontSize: "250%",
      fontWeight: "bold",
      fontFamily: "segoe UI",
    },
    displayHintButton: {
      backgroundColor: "#63A2AB",
    },
    gameModeButton: {
      margin: 8,
      borderRadius: 20,
      [theme.breakpoints.only("xs")]: {
        width: 300,
        height: 50,
        fontSize: "1rem",
      },
      [theme.breakpoints.only("sm")]: {
        width: 350,
        height: 58,
        fontSize: "1rem",
      },
      [theme.breakpoints.up("md")]: {
        width: 370,
        height: 61,
        fontSize: "1.25rem",
      },
    },
    heatmapButton: {
      backgroundColor: "#021C1E",
    },
    checkGreen: {
      fill: "green",
    },
    clearRed: {
      fill: "red",
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

  const [gameMode, setGameMode] = useState<GameMode>("casual");
  const [isGameModeSelected, setGameModeSelected] = useState(false);

  const [showHeatmap, setShowHeatmap] = useState(false);

  const classes = useStyles({ timerColor });

  /* TODO: check if upload to database fails to give different message */
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
    setHinted(true);

    const x = truth[0] + (truth[2] - truth[0]) / 2 + Math.random() * 100 - 50;
    const y = truth[1] + (truth[3] - truth[1]) / 2 + Math.random() * 100 - 50;
    const radius = mapToCanvasScale(context, 100);

    drawCircle(context, x, y, radius, 2, INVALID_COLOUR);
  }, [context, truth]);

  /**
   * Round timer based events
   */
  useEffect(() => {
    if (!roundRunning) {
      return;
    }

    if (roundTime === 5000 && !hinted) {
      /*
       * 5 seconds left
       *
       * set Timer to orange
       * show hint
       */
      setTimerColor("orange");

      showHint();
    } else if (roundTime === 2000) {
      /*
       * 2 seconds left
       *
       * set Timer to red
       */
      setTimerColor("red");
    } else if (roundTime === 0) {
      /*
       * 0 seconds left
       *
       * start end timer
       */
      setEndRunning(true);
    }
  }, [hinted, roundRunning, roundTime, showHint]);

  /**
   * End timer
   *
   * Increment roundTime by 100, every 100ms
   *
   * Running only while endRunning is true
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
      /*
       * 0 seconds passed
       *
       * set loading true and stop round timer
       * draw and upload player click (if available)
       * start animation timer and pause end timer
       */
      setLoading(true);
      setRoundRunning(false);

      if (click) {
        const { x, y } = click;

        drawCross(context, x, y, 5, DEFAULT_COLOUR);

        uploadPlayerClick(Math.round(x), Math.round(y)).then(() => null);
      }

      enqueueSnackbar("The system is thinking...");

      setAnimationRunning(true);
      setEndRunning(false);
    } else if (endTime === 100) {
      /*
       * 0.1 seconds passed
       *
       * draw predicted rectangle in default color
       */
      drawRectangle(context, predicted, DEFAULT_COLOUR, 3);
    } else if (endTime === 500) {
      /*
       * 1 second passed
       *
       * draw truth rectangle
       */
      drawRectangle(context, truth, TRUE_COLOUR, 3);
    } else if (endTime === 1000 && click) {
      /*
       * 1 second passed
       *
       * evaluate player click (if available)
       */
      const { x, y } = click;

      enqueueSnackbar("Checking results...");

      /* Player was successful if the click coordinates are inside the truth rectangle */
      if (truth[0] <= x && x <= truth[2] && truth[1] <= y && y <= truth[3]) {
        /* For Casual Mode: if Hint was shown, receive half a point; otherwise receive full point */
        const casualRoundScore = hinted ? 0.5 : 1;

        /* For Competitive Mode: round time taken doubled if no hint provided */
        const competitiveRoundScore = (roundTime / 1000) * (hinted ? 10 : 20);

        const roundScore = gameMode === "casual" ? casualRoundScore : competitiveRoundScore;

        setPlayerScore((prevState) => prevState + roundScore);
        setPlayerCorrectAnswers((prevState) => prevState + 1);
        setPlayerCorrect(true);

        drawCross(context, x, y, 5, VALID_COLOUR);
      } else {
        drawCross(context, x, y, 5, INVALID_COLOUR);
      }
    } else if (endTime === 1500) {
      /*
       * 1.5 seconds passed
       *
       * evaluate AI prediction
       * stop end timer and set loading false
       */
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
    gameMode,
    hinted,
    predicted,
    roundTime,
    truth,
    uploadPlayerClick,
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

    /* Stop when all cube positions were reached, and resume end timer with one tick passed */
    if (animationPosition === NUM_SEARCH_CUBES * NUM_SEARCH_CUBES) {
      setAnimationRunning(false);
      setEndTime((prevState) => prevState + 100);
      setEndRunning(true);
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
      gameMode === "casual" ? DbUtils.LEADERBOARD_CASUAL : DbUtils.LEADERBOARD_COMPETITIVE;

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
   * Display a green Check or red Clear based on correct (only after first round, and between rounds)
   *
   * @param correct Boolean for icon picking
   */
  const showCorrect = (correct: boolean) => {
    if (round === 0 || roundRunning || loading) {
      return null;
    }

    return correct ? (
      <Check className={classes.checkGreen} fontSize="large" />
    ) : (
      <Clear className={classes.clearRed} fontSize="large" />
    );
  };

  /**
   * Function for filling up the username field before submitting score
   * @param event - username writing event listener
   */
  const onChangeUsername = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  /**
   * Display the winner
   */
  const showWinner = () => {
    let text: string;
    let color: string;

    if (playerScore > aiScore) {
      text = "You won!";
      color = VALID_COLOUR;
    } else if (playerScore < aiScore) {
      text = "AI won!";
      color = INVALID_COLOUR;
    } else {
      text = "It was a draw!";
      color = DEFAULT_COLOUR;
    }

    return (
      <Typography className={classes.result} variant="h6" style={{ color }}>
        {text}
      </Typography>
    );
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

  const sideAction = () => {
    if (round < NUM_ROUNDS || roundRunning || loading) {
      return (
        <LoadingButton
          loading={loading}
          buttonDisabled={roundRunning || loading}
          onButtonClick={startRound}
          buttonText={round === 0 ? "Start" : "Next"}
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

        {showWinner()}

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
   * Called when the Show Heatmap button is clicked
   */
  const onShowHeatmap = () => setShowHeatmap(true);

  /**
   * Called when the Show Heatmap Dialog is closed
   */
  const onCloseHeatmap = () => setShowHeatmap(false);

  /**
   * Function for displaying the game content
   * First display the game mode selection, then the game content
   */
  const displayGame = () => {
    if (!isGameModeSelected) {
      return (
        <>
          <Container className={classes.container} style={{ flexDirection: "column" }}>
            <Typography className={classes.gameModeSelectionText}>Choose a game mode</Typography>

            <ButtonGroup orientation="vertical">
              <Button
                className={classes.gameModeButton}
                variant="contained"
                color="primary"
                size="large"
                onClick={() => {
                  setGameModeSelected(true);
                  setGameMode("casual");
                }}
              >
                Casual
              </Button>

              <Button
                className={classes.gameModeButton}
                variant="contained"
                color="primary"
                size="large"
                onClick={() => {
                  setGameModeSelected(true);
                  setGameMode("competitive");
                }}
              >
                Competitive
              </Button>
            </ButtonGroup>
          </Container>
        </>
      );
    }

    // Game mode selected. Display the actual game content
    return (
      <>
        <div className={classes.container}>
          <div className={classes.emptyDiv} />

          {displayGameContent()}

          {displayScoreCard()}

          {displayHeatmapDialog()}
        </div>
      </>
    );
  };

  /**
   * Function for displaying the actual Game Content
   * Display Show Hint button for Casual Mode (gameMode === 0)
   * Display Timer Bar for Competitive Mode (gameMode === 1)
   */
  const displayGameContent = () => {
    return gameMode === "casual" ? (
      <div className={classes.upperBarCanvasContainer}>
        <Card className={classes.hintButtonContainer}>
          <Button
            className={classes.displayHintButton}
            onClick={showHint}
            disabled={round === 0 || loading || hinted || !roundRunning}
          >
            Show hint
          </Button>
        </Card>

        {displayGameCanvas()}
      </div>
    ) : (
      <div className={classes.upperBarCanvasContainer}>
        <Card className={classes.timerContainer}>
          <Typography className={classes.timer} variant="h4" style={{ color: timerColor }}>
            Time remaining: {(roundTime / 1000).toFixed(1)}s
          </Typography>

          <ColoredLinearProgress
            barColor={timerColor}
            variant="determinate"
            value={roundTime / 100}
          />
        </Card>

        {displayGameCanvas()}
      </div>
    );
  };

  /**
   * Function for displaying the side Score Card
   */
  const displayScoreCard = () => {
    return (
      <div className={classes.sideContainer}>
        <Card className={classes.sideCard}>
          <div className={classes.flexButton}>
            <Typography className={classes.result} variant="h4">
              You
            </Typography>

            <div className={classes.result}>{showCorrect(playerCorrect)}</div>
          </div>

          <div className={classes.flexButton}>
            <Typography className={classes.result} variant="h4">
              {playerScore} vs {gameMode === "casual" ? aiCorrectAnswers : aiScore}
            </Typography>
          </div>

          <div className={classes.flexButton}>
            <Typography className={classes.result} variant="h4">
              AI
            </Typography>

            <div className={classes.result}>{showCorrect(aiCorrect)}</div>
          </div>
          <div className={classes.result}>{sideAction()}</div>

          {displaySubmitButton()}
        </Card>
      </div>
    );
  };

  /**
   * Function for displaying the Heatmap Dialog Window
   */
  const displayHeatmapDialog = () => {
    return (
      <Dialog fullScreen open={showHeatmap} onClose={onShowHeatmap}>
        <AppBar position="sticky">
          <Toolbar variant="dense">
            <IconButton
              className={classes.backButton}
              edge="start"
              color="inherit"
              aria-label="close"
              onClick={onCloseHeatmap}
            >
              <Close />
            </IconButton>

            <Typography>Heatmap</Typography>
          </Toolbar>
        </AppBar>

        <HeatmapDisplay imageId={imageId} />
      </Dialog>
    );
  };

  /**
   * Function for displaying the game main canvas
   */
  const displayGameCanvas = () => {
    return (
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
    );
  };

  /**
   * Function for displaying the Submit button for Casual Game Mode
   * For Competitive Mode, display nothing
   */
  const displaySubmitButton = () => {
    return gameMode === "casual" ? (
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

        <div />

        <Button
          variant="contained"
          color="primary"
          size="large"
          disabled={roundRunning || loading || username === "" || round === 0}
          onClick={onSubmitScore}
          style={{ marginTop: 8 }}
        >
          Submit Score
        </Button>
      </>
    ) : null;
  };

  /**
   * Function for displaying the heatmap button after the game mode was selected
   */
  const showHeatmapButton = () => {
    if (!isGameModeSelected) {
      return null;
    }

    return (
      <Button
        disabled={round === 0 || roundRunning || loading}
        color="inherit"
        onClick={onShowHeatmap}
      >
        Show Heatmap
      </Button>
    );
  };

  /**
   * Main return from the React Functional Component
   */
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

          {showHeatmapButton()}
        </Toolbar>
      </AppBar>

      {displayGame()}
    </>
  );
};

export default Game;
