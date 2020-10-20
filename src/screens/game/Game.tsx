import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AppBar,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  LinearProgress,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { KeyboardBackspace } from "@material-ui/icons";
import { TwitterIcon, TwitterShareButton } from "react-share";
import useInterval from "../../components/useInterval";
import { db } from "../../firebase/firebaseApp";
// import { db } from "../../firebase/firebaseApp";

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
    countdownContainer: {
      width: "min(81vh, 81vw)",
      margin: 8,
      padding: 8,
    },
    countdown: {
      marginBottom: 8,
      textAlign: "center",
      fontSize: "1.5rem",
    },
    linearProgress: {
      width: "100%",
    },
    canvasContainer: {
      height: "min(81vh, 81vw)",
      width: "min(81vh, 81vw)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 8,
    },
    dialogPaper: {
      width: "200vw",
    },
    result: {
      marginTop: 8,
      marginBottom: 8,
      textAlign: "center",
    },
    loadingButtonContainer: {
      position: "relative",
      marginTop: 16,
      marginBottom: 16,
    },
    circularProgress: {
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12,
    },
  })
);

const VALID_COLOUR = "green";
const INVALID_COLOUR = "red";
const DEFAULT_COLOUR = "yellow";
const TRUE_COLOUR = "blue";

const NUMBER_OF_ROUNDS = 10;
const TOTAL_TIME = 10;

const Game: React.FC<GameProps> = ({ setRoute }: GameProps) => {
  const classes = useStyles();

  const seenFiles = new Set<number>();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [currentRound, setCurrentRound] = useState(0);
  const [showDialog, setShowDialog] = useState(true);

  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [hinted, setHinted] = useState(false);

  const [timeRemaining, setTimeRemaining] = useState(TOTAL_TIME);
  const [timeRemainingText, setTimeRemainingText] = useState(TOTAL_TIME.toFixed(1));
  const [countdownColor, setCountdownColor] = useState("green");

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

  type DrawType = ((canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => void) | null;
  const [draw, setDraw] = useState<DrawType>(null);

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

  useInterval(
    () => {
      setTimeRemaining((prevState) => prevState - 0.1);
      setTimeRemainingText(timeRemaining.toFixed(1));
    },
    running ? 100 : null
  );

  const stopTimer = () => {
    setRunning(false);
  };

  const IsFullWidth = () => {
    const [size, setSize] = useState(Math.min(window.innerWidth * 0.8, window.innerHeight * 0.8));
    window.addEventListener("resize", () => {
      const newWidth = window.innerWidth * 0.8;
      const newHeight = window.innerHeight * 0.8;
      setSize(Math.min(newHeight, newWidth));
    });
    return size;
  };

  const canvasSize = IsFullWidth();

  const bbIntersectionOverUnion = (boxA: number[], boxB: number[]): number => {
    const xA = Math.max(boxA[0], boxB[0]);
    const yA = Math.max(boxA[1], boxB[1]);
    const xB = Math.min(boxA[2], boxB[2]);
    const yB = Math.min(boxA[3], boxB[3]);

    const interArea = Math.max(0, xB - xA + 1) * Math.max(0, yB - yA + 1);

    const boxAArea = (boxA[2] - boxA[0] + 1) * (boxA[3] - boxA[1] + 1);
    const boxBArea = (boxB[2] - boxB[0] + 1) * (boxB[3] - boxB[1] + 1);

    const unionArea = boxAArea + boxBArea - interArea;

    return interArea / unionArea;
  };

  function setRect(context: CanvasRenderingContext2D, rectBounds: number[]) {
    const xBase = rectBounds[0];
    const yBase = rectBounds[1];
    const xEnd = rectBounds[2];
    const yEnd = rectBounds[3];
    const widthRect = xEnd - xBase;
    const heightRect = yEnd - yBase;
    context.rect(xBase, yBase, widthRect, heightRect);
  }

  const drawRectangle = useCallback(
    (
      context: CanvasRenderingContext2D,
      rectBounds: number[],
      strokeStyle: string,
      lineWidth: number
    ) => {
      context.strokeStyle = strokeStyle;
      context.lineWidth = lineWidth;
      context.beginPath();
      setRect(context, rectBounds);
      context.stroke();
    },
    []
  );

  const drawTruth = useCallback(
    (_: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
      // Drawing True Rectangle
      drawRectangle(context, truth, TRUE_COLOUR, 3);
    },
    [truth, drawRectangle]
  );

  const drawPredicted = useCallback(
    (_: HTMLCanvasElement, context: CanvasRenderingContext2D, strokeStyle: string) => {
      // Drawing Predicted Rectangle
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
      context.arc(x, y, (100 * canvasSize) / 512, 0, 2 * Math.PI);
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
    return bbIntersectionOverUnion(truth, predicted) > 0.5;
  }, [truth, predicted]);

  useEffect(() => {
    if (!running) {
      return;
    }

    if (timeRemaining <= 0) {
      setShowDialog(true);
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
        }, 2000);
      });
    } else if (timeRemaining <= 2) {
      setCountdownColor("red");
    } else if (timeRemaining <= 5) {
      setCountdownColor("orange");

      if (hinted) {
        return;
      }

      setHinted(true);

      setDraw(() => (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) =>
        drawHint(canvas, context)
      );
    } else {
      setCountdownColor("#373737");
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

  const onCanvasClick = async (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (timeRemaining <= 0 || clicked || !running) {
      return;
    }

    setClicked(true);

    stopTimer();

    const [mouseX, mouseY] = [event.clientX, event.clientY];

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
      }, 2500);
    });

    setShowDialog(true);
  };

  const getNewFileNumber = (): number => {
    const max = 100;
    const newFileNumber = Math.round(Math.random() * max);

    if (seenFiles.has(newFileNumber)) {
      return getNewFileNumber();
    }

    seenFiles.add(newFileNumber);

    return newFileNumber;
  };

  const loadNewImage = async () => {
    stopTimer();
    setTimeRemaining(TOTAL_TIME);
    setLoading(true);

    const fileNumber = getNewFileNumber();

    // Retrieve annotations
    await fetch(`${process.env.PUBLIC_URL}/content/annotation/${fileNumber}.json`)
      .then((res) => res.json())
      .then((data: { truth: number[]; predicted: number[] }) => {
        setTruth(data.truth.map((pixel) => (pixel * canvasSize) / 512));
        setPredicted(data.predicted.map((pixel) => (pixel * canvasSize) / 512));
      });

    // Build the image
    const img = new Image();
    img.src = `${process.env.PUBLIC_URL}/content/images/${fileNumber}.png`;
    img.onload = () => {
      setDraw(() => (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      });

      setClicked(false);
      setHinted(false);
      setTimeRemainingText(timeRemaining.toFixed(1));
      setRunning(true);
      setLoading(false);
      setTotal((prevState) => prevState + 1);
    };
  };

  const onStartNextClick = async () => {
    setCurrentRound((prevState) => prevState + 1);
    setShowDialog(false);
    setAiCorrect(false);
    setPlayerCorrect(false);
    setAiResultVisible(false);
    setPlayerResultVisible(false);

    await loadNewImage();
  };

  const submitScores = async () => {
    const date = new Date();
    const score = {
      score: playerPoints,
    };

    await db
      .collection("daily-scores")
      .doc(date.getDay().toString())
      .collection("scores")
      .doc(username)
      .set(score);

    await db
      .collection("monthly-scores")
      .doc(date.getMonth().toString())
      .collection("scores")
      .doc(username)
      .set(score);

    await db
      .collection("all-time-scores")
      .doc(date.getFullYear().toString())
      .collection("scores")
      .doc(username)
      .set(score);
  };

  const displayCorrect = (correct: boolean, visible: boolean) => {
    if (!visible) {
      return null;
    }

    return (
      <Typography
        className={classes.result}
        variant="h4"
        style={{ color: correct ? VALID_COLOUR : INVALID_COLOUR }}
      >
        {correct ? "Correct!" : "Wrong!"}
      </Typography>
    );
  };

  const dialogAction = () => {
    if (currentRound < NUMBER_OF_ROUNDS) {
      return (
        <div className={classes.loadingButtonContainer}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            disabled={running || loading}
            onClick={onStartNextClick}
          >
            {currentRound === 0 ? "Next" : "Start"}
          </Button>

          {loading && (
            <CircularProgress className={classes.circularProgress} color="primary" size={24} />
          )}
        </div>
      );
    }

    return (
      <div>
        <TwitterShareButton
          url="http://cb3618.pages.doc.ic.ac.uk/spot-the-lesion"
          title={`I got ${playerPoints} points in Spot-the-Lesion! Can you beat my score?`}
        >
          <TwitterIcon size="50px" round />
        </TwitterShareButton>

        <TextField
          id="username"
          label="Username"
          variant="outlined"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
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
      </div>
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
        <Card className={classes.countdownContainer}>
          <Typography className={classes.countdown} variant="h4" style={{ color: countdownColor }}>
            Time remaining: {timeRemainingText}s
          </Typography>

          <LinearProgress
            className={classes.linearProgress}
            style={{ color: countdownColor }}
            variant="determinate"
            value={timeRemaining * 10}
          />
        </Card>

        <Card className={classes.canvasContainer}>
          <canvas ref={canvasRef} width={canvasSize} height={canvasSize} onClick={onCanvasClick} />
        </Card>
      </div>

      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={showDialog}
        onClose={() => setShowDialog(false)}
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
