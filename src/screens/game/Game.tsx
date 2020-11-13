import React, { useCallback, useEffect, useRef, useState } from "react";
import { AppBar, Button, Card, IconButton, Toolbar, Typography, useTheme } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { KeyboardBackspace } from "@material-ui/icons";
import { TwitterIcon, TwitterShareButton } from "react-share";
import { useSnackbar } from "notistack";
import axios from "axios";
import ColoredLinearProgress from "../../components/ColoredLinearProgress";
import LoadingButton from "../../components/LoadingButton";
import ScoreWithIncrement from "../../components/ScoreWithIncrement";
import useInterval from "../../components/useInterval";
import useCanvasContext from "../../components/useCanvasContext";
import useUniqueRandomGenerator from "../../components/useUniqueRandomGenerator";
import SubmitScoreDialog from "./SubmitScoreDialog";
import {
  drawCircle,
  drawCross,
  drawRectangle,
  mapClickToCanvas,
  mapToCanvasScale,
} from "../../components/CanvasUtils";
import { getImagePath, getIntersectionOverUnion, getJsonPath } from "../../utils/GameUtils";
import DbUtils from "../../utils/DbUtils";
import { db, firebaseStorage } from "../../firebase/firebaseApp";
import useHeatmap from "../../components/useHeatmap";

interface StylesProps {
  timerColor: string;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.modal + 1,
    },
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
    topBarCanvasContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    topBar: {
      margin: 8,
      padding: 8,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      [theme.breakpoints.down("sm")]: {
        width: "80vw",
        maxWidth: "60vh",
      },
      [theme.breakpoints.up("md")]: {
        width: "70vh",
        maxWidth: "70vw",
      },
    },
    timer: {
      marginBottom: 8,
      fontSize: "1.5rem",
      color: (props: StylesProps) => props.timerColor,
    },
    canvasContainer: {
      display: "grid",
      padding: 8,
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
      gridColumnStart: 1,
      gridRowStart: 1,
      height: "100%",
      width: "100%",
    },
    sideContainer: {
      [theme.breakpoints.up("md")]: {
        height: "100%",
        flex: 1,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
      },
    },
    sideCard: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      alignContent: "center",
      margin: 8,
      padding: 8,
      [theme.breakpoints.down("sm")]: {
        width: "80vw",
        maxWidth: "60vh",
      },
      [theme.breakpoints.up("md")]: {
        minWidth: "20vw",
      },
    },
    scoresContainer: {
      display: "flex",
      [theme.breakpoints.down("sm")]: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly",
      },
      [theme.breakpoints.up("md")]: {
        flexDirection: "column",
        alignItems: "center",
      },
    },
    sideCardText: {
      [theme.breakpoints.down("sm")]: {
        fontSize: "1.5rem",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "2rem",
      },
    },
    submitShareContainer: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
  })
);

const NUM_ROUNDS = 10;

const ROUND_START_TIME = 10000;

const ANIMATION_TIME = 3000;

const AI_SCORE_INCREASE_RATE = 75;

const NUM_SEARCH_CUBES = 10;

const MAX_CANVAS_SIZE = 750;

type JsonData = { truth: number[]; predicted: number[] };

const Game: React.FC<GameProps> = ({ setRoute, gameMode, MIN_FILE_ID, MAX_FILE_ID }: GameProps) => {
  const theme = useTheme();

  const AI_COLOUR = theme.palette.secondary.main;
  const DEFAULT_COLOUR = "#gray";
  const INVALID_COLOUR = "red";
  const PLAYER_COLOUR = "red";
  const VALID_COLOUR = "green";
  const TRUE_COLOUR = "blue";
  const INITIAL_TIMER_COLOR = "#373737";

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
  const [hintedAtLeastOnce, setHintedAtLeastOnce] = useState(false);

  const [timerColor, setTimerColor] = useState(INITIAL_TIMER_COLOR);

  const getNewFileId = useUniqueRandomGenerator(MIN_FILE_ID, MAX_FILE_ID);
  const [fileId, setFileId] = useState(0);

  const [truth, setTruth] = useState<number[]>([]);
  const [predicted, setPredicted] = useState<number[]>([]);
  const [click, setClick] = useState<{ x: number; y: number } | null>(null);

  const [round, setRound] = useState(0);

  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);

  const [playerRoundScore, setPlayerRoundScore] = useState(0);
  const [aiRoundScore, setAiRoundScore] = useState(0);

  const [playerCorrect, setPlayerCorrect] = useState(0);
  const [aiCorrect, setAiCorrect] = useState(0);

  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);

  const canvasContainer = useRef<HTMLDivElement>(null);

  const classes = useStyles({ timerColor });

  useHeatmap(showHeatmap, canvasContainer, fileId, classes.canvas);

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
    setHintedAtLeastOnce(true);

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
      const docNameForImage = `image_${fileId}`;
      let entry;
      let pointWasClickedBefore = false;
      let isClickCorrect = false;

      const newClickPoint = {
        x: Math.round((x * 10000) / context.canvas.width) / 100,
        y: Math.round((y * 10000) / context.canvas.height) / 100,
        clickCount: 1,
      };

      // Check whether click was correct
      if (truth[0] <= x && x <= truth[2] && truth[1] <= y && y <= truth[3]) {
        isClickCorrect = true;
      }

      const imageDoc = await db.collection(DbUtils.IMAGES).doc(docNameForImage).get();

      if (!imageDoc.exists) {
        // First time this image showed up in the game - entry will be singleton array
        entry = {
          clicks: [newClickPoint],
          correctClicks: isClickCorrect ? 1 : 0,
          wrongClicks: isClickCorrect ? 0 : 1,
          hintCount: hinted ? 1 : 0,
        };
      } else {
        const { clicks, correctClicks, wrongClicks, hintCount } = imageDoc.data()!;
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

        // Construct the updated DB entry for this image
        entry = {
          clicks,
          correctClicks: isClickCorrect ? correctClicks + 1 : correctClicks,
          wrongClicks: isClickCorrect ? wrongClicks : wrongClicks + 1,
          hintCount: hinted ? hintCount + 1 : hintCount,
        };
      }

      await db.collection(DbUtils.IMAGES).doc(docNameForImage).set(entry);
    },
    [context, fileId, hinted, truth]
  );

  const checkAchievements = (roundScore: number) => {
    if (!localStorage.getItem("firstCorrect")) {
      enqueueSnackbar("Achievement! First correct answer!", {
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
        variant: "success",
        autoHideDuration: 3000,
      });
      localStorage.setItem("firstCorrect", "true");
    }

    if (!localStorage.getItem("firstCorrectWithoutHint") && !hinted) {
      enqueueSnackbar("Achievement! No hint needed!", {
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
        variant: "success",
        autoHideDuration: 3000,
      });
      localStorage.setItem("firstCorrectWithoutHint", "true");
    }
    if (
      !localStorage.getItem("fiveCorrectSameRunCasual") &&
      gameMode === "casual" &&
      playerCorrect + 1 > 4
    ) {
      enqueueSnackbar("Achievement! Five correct in same casual run!", {
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
        variant: "success",
        autoHideDuration: 3000,
      });
      localStorage.setItem("fiveCorrectSameRunCasual", "true");
    }
    if (
      !localStorage.getItem("fiveCorrectSameRunCompetitive") &&
      gameMode === "competitive" &&
      playerCorrect + 1 > 4
    ) {
      enqueueSnackbar("Achievement! Five correct in same competitive run!", {
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
        variant: "success",
        autoHideDuration: 3000,
      });
      localStorage.setItem("fiveCorrectSameRunCompetitive", "true");
    }
    if (
      !localStorage.getItem("allCorrectCompetitive") &&
      gameMode === "competitive" &&
      playerCorrect + 1 > 9
    ) {
      enqueueSnackbar("Achievement! You got them all right!", {
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
        variant: "success",
        autoHideDuration: 3000,
      });
      localStorage.setItem("allCorrectCompetitive", "true");
    }
    if (
      !localStorage.getItem("competitivePoints") &&
      gameMode === "competitive" &&
      playerScore + roundScore > 1000
    ) {
      enqueueSnackbar("Achievement! 1000 points in a competitive run!", {
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
        variant: "success",
        autoHideDuration: 3000,
      });
      localStorage.setItem("competitivePoints", "true");
    }
    if (!localStorage.getItem("fastAnswer") && gameMode === "competitive" && roundTime > 8000) {
      enqueueSnackbar("Achievement! You answered correctly in less than 2 seconds!", {
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
        variant: "success",
        autoHideDuration: 3000,
      });
      localStorage.setItem("fastAnswer", "true");
    }
  };

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

        /* TODO: round x and y here */
        drawCross(context, x, y, 5, PLAYER_COLOUR);

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
      drawRectangle(context, predicted, AI_COLOUR, 3);
    } else if (endTime === 500) {
      /*
       * 0.5 seconds passed
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
        /* Casual Mode: half a point, doubled if no hint received */
        const casualScore = hinted ? 0.5 : 1;

        /* Competitive Mode: function of round time left, doubled if no hint received */
        const competitiveScore = (roundTime / 1000) * (hinted ? 10 : 20);

        setPlayerRoundScore(gameMode === "casual" ? casualScore : competitiveScore);
        setPlayerCorrect((prevState) => prevState + 1);

        checkAchievements(playerRoundScore);

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
        /* Casual mode: one point */
        const casualScore = 1;

        /* Competitive mode: function of prediction accuracy and constant increase rate */
        const competitiveRoundScore = Math.round(intersectionOverUnion * AI_SCORE_INCREASE_RATE);

        setAiRoundScore(gameMode === "casual" ? casualScore : competitiveRoundScore);
        setAiCorrect((prevState) => prevState + 1);

        drawRectangle(context, predicted, VALID_COLOUR, 3);
      } else {
        drawRectangle(context, predicted, INVALID_COLOUR, 3);
      }

      setEndRunning(false);
      setLoading(false);
    }
    // TODO:figure out how to fix this
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    AI_COLOUR,
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

    drawRectangle(animationContext, cube, AI_COLOUR, 3);
  }, [AI_COLOUR, animationContext, animationPosition, animationRunning]);

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
    const jsonStorageReference = firebaseStorage.refFromURL(
      "gs://spot-the-lesion.appspot.com/annotations"
    );

    /* Download the JSON */
    jsonStorageReference
      .child(getJsonPath(fileNumber))
      .getDownloadURL()
      .then((url) => {
        axios.get(url).then((response) => {
          const content: JsonData = response.data;
          setTruth(mapCoordinates(content.truth));
          setPredicted(mapCoordinates(content.predicted));
        });
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(`Ran into firebase storage error: ${error}`);
      });
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

      // Create a reference from a Google Cloud Storage URI
      const imageStorageReference = firebaseStorage.refFromURL(
        "gs://spot-the-lesion.appspot.com/images"
      );

      image.onerror = reject;

      /* Set source after onLoad to ensure onLoad gets called (in case the image is cached) */
      imageStorageReference
        .child(getImagePath(fileNumber))
        .getDownloadURL()
        .then((url) => {
          image.src = url;
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(`Ran into firebase storage error: ${error}`);
        });
    });

  /**
   * Starts a new round, loading a new image and its corresponding JSON data
   */
  const startRound = async () => {
    /* Update scores with last round scores */
    setPlayerScore((prevState) => prevState + playerRoundScore);
    setAiScore((prevState) => prevState + aiRoundScore);

    setLoading(true);

    /* Get a new file number and load the corresponding json and image */
    const newFileId = getNewFileId();
    setFileId(newFileId);

    await loadJson(newFileId);
    await loadImage(newFileId);

    /* Reset game state */
    setRoundTime(ROUND_START_TIME);
    setEndTime(0);
    setAnimationPosition(0);

    setHinted(false);
    setTimerColor(INITIAL_TIMER_COLOR);

    setClick(null);

    setShowHeatmap(false);

    setPlayerRoundScore(0);
    setAiRoundScore(0);

    setRound((prevState) => prevState + 1);

    setRoundRunning(true);
    setLoading(false);
  };

  /**
   * Function for triggering the effects associated with submitting the score
   * Submit button becomes disabled
   * Snackbar triggered
   * Scores uploaded into Firebase
   */
  const onSubmitScore = async (username: string) => {
    setLoading(true);

    const date = new Date();
    const entry = {
      user: username,
      score: playerScore + playerRoundScore,
      ai_score: aiScore + aiRoundScore,
      correct_player_answers: playerCorrect,
      usedHints: hintedAtLeastOnce,
      correct_ai_answers: aiCorrect,
      day: date.getDate(),
      month: DbUtils.monthNames[date.getMonth()],
      year: date.getFullYear(),
    };

    const leaderboard =
      gameMode === "casual" ? DbUtils.LEADERBOARD_CASUAL : DbUtils.LEADERBOARD_COMPETITIVE;

    const entryName = `${entry.year}.${entry.month}.${entry.day}.${entry.user}`;

    const playerDoc = await db.collection(leaderboard).doc(entryName).get();

    if (!playerDoc.exists) {
      // First time played today - add this score to DB
      await db.collection(leaderboard).doc(entryName).set(entry);
    } else if (playerDoc.data()!.score < entry.score) {
      // Current score is greater than what this player registered before => update it in the DB
      await db.collection(leaderboard).doc(entryName).set(entry);
    }

    setRoute("home");
    enqueueSnackbar("Score successfully submitted!");
  };

  const onToggleHeatmap = () => setShowHeatmap((prevState) => !prevState);

  const onShowSubmit = () => setShowSubmit(true);

  const onCloseSubmit = () => setShowSubmit(false);

  /**
   * Display the winner (only on competitive mode, after last round)
   */
  const showWinner = () => {
    if (gameMode === "casual" || round < NUM_ROUNDS || roundRunning || loading) {
      return null;
    }

    let text: string;
    let color: string;

    const endPlayerScore = playerScore + playerRoundScore;
    const endAiScore = aiScore + aiRoundScore;

    if (endPlayerScore > endAiScore) {
      if (!localStorage.getItem("firstCompetitiveWin")) {
        enqueueSnackbar("Achievement! First competitive win!", {
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          variant: "success",
          autoHideDuration: 3000,
        });
        localStorage.setItem("firstCompetitiveWin", "true");
        text = "You won!";
        color = VALID_COLOUR;
      } else if (endPlayerScore < endAiScore) {
        text = "AI won!";
        color = INVALID_COLOUR;
      } else {
        text = "It was a draw!";
        color = DEFAULT_COLOUR;
      }

      return (
        <Typography className={classes.sideCardText} variant="h6" style={{ color }}>
          {text}
        </Typography>
      );
    }

    return null;
  };

  const displayStartRoundButton = () => {
    if (gameMode === "competitive" && round === NUM_ROUNDS) {
      return null;
    }

    return (
      <LoadingButton
        loading={loading}
        buttonDisabled={roundRunning || loading}
        onButtonClick={startRound}
        buttonText={round === 0 ? "Start" : "Next"}
      />
    );
  };

  const displaySubmitShare = () => {
    if (
      (gameMode === "casual" && round === 0) ||
      (gameMode === "competitive" && round < NUM_ROUNDS) ||
      roundRunning ||
      loading
    ) {
      return null;
    }

    return (
      <div className={classes.submitShareContainer}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          disabled={roundRunning || loading}
          onClick={onShowSubmit}
        >
          Submit Score
        </Button>

        <TwitterShareButton
          url="http://cb3618.pages.doc.ic.ac.uk/spot-the-lesion"
          title={`I got ${playerScore} points in Spot-the-Lesion! Can you beat my score?`}
        >
          <TwitterIcon size="50px" round />
        </TwitterShareButton>
      </div>
    );
  };

  /**
   * Display game Top Bar
   *
   * Casual Mode: Hint Button
   * Competitive Mode: Timer
   */
  const gameTopBar = () => {
    let topBarContent;
    if (gameMode === "casual") {
      topBarContent = (
        <Button
          variant="contained"
          color="secondary"
          disabled={hinted || !roundRunning}
          onClick={showHint}
        >
          Show hint
        </Button>
      );
    } else {
      topBarContent = (
        <>
          <Typography className={classes.timer}>
            Time remaining: {(roundTime / 1000).toFixed(1)}s
          </Typography>

          <ColoredLinearProgress
            barColor={timerColor}
            variant="determinate"
            value={roundTime / 100}
          />
        </>
      );
    }

    return <Card className={classes.topBar}>{topBarContent}</Card>;
  };

  const gameContent = () => {
    return (
      <div className={classes.topBarCanvasContainer}>
        {gameTopBar()}

        <Card className={classes.canvasContainer} ref={canvasContainer}>
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
    );
  };

  /**
   * Function for displaying the side Score Card
   */
  const gameSideCard = () => {
    return (
      <div className={classes.sideContainer}>
        <Card className={classes.sideCard}>
          <div className={classes.scoresContainer}>
            <ScoreWithIncrement
              player="You"
              score={playerScore}
              increment={playerRoundScore}
              showIncrement={round > 0 && !roundRunning && !loading}
            />

            <Typography className={classes.sideCardText}>vs</Typography>

            <ScoreWithIncrement
              player="AI"
              score={aiScore}
              increment={aiRoundScore}
              showIncrement={round > 0 && !roundRunning && !loading}
            />
          </div>

          {showWinner()}

          {displayStartRoundButton()}

          {displaySubmitShare()}
        </Card>
      </div>
    );
  };

  /**
   * Main return from the React Functional Component
   */
  return (
    <>
      <AppBar className={classes.appBar} position="sticky">
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

          <Button
            disabled={round === 0 || roundRunning || loading}
            color="inherit"
            onClick={onToggleHeatmap}
          >
            {showHeatmap ? "Hide" : "Show"} Heatmap
          </Button>
        </Toolbar>
      </AppBar>

      <div className={classes.container}>
        <div className={classes.emptyDiv} />

        {gameContent()}

        {gameSideCard()}
      </div>

      <SubmitScoreDialog open={showSubmit} onClose={onCloseSubmit} onSubmit={onSubmitScore} />
    </>
  );
};

export default Game;
