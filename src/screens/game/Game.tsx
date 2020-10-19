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
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import BackButtonIcon from "@material-ui/icons/KeyboardBackspace";
import useInterval from "../../components/useInterval";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  canvasContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  cardCanvas: {
    position: "relative",
    height: "min(81vh, 81vw)",
    width: "min(81vh, 81vw)",
    padding: 8,
  },
  loadingButtonContainer: {
    position: "relative",
    marginTop: 16,
  },
  startNextButton: {
    backgroundColor: "#07575B",
    color: "white",
  },
  circularProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  scoresContainer: {
    display: "block",
    flexDirection: "column",
    alignItems: "center",
    width: "min(81vh, 81vw)",
    height: "5vh",
    margin: "1%",
    padding: 8,
  },
  countdown: {
    marginBottom: "1%",
    textAlign: "center",
    fontSize: "min(calc((10vw+10vh)/2), 3vh)",
  },
  linearProgress: {
    width: "100%",
  },
  results: {
    marginTop: 8,
    marginBottom: 8,
  },
  scoreTypography: {
    fontWeight: "bold",
  },
  navbar: {
    background: "#07575B",
  },
});

const Game: React.FC<GameProps> = ({ setRoute }: GameProps) => {
  const styles = useStyles();

  const [open, setOpen] = React.useState(true);

  const seenFiles = new Set<number>();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [running, setRunning] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [hinted, setHinted] = useState(false);

  const totalTime = 10;
  const [timeRemaining, setTimeRemaining] = useState(totalTime);
  const [timeRemainingText, setTimeRemainingText] = useState("10.0");
  const [countdownColor, setCountdownColor] = useState("green");

  // const [playerPoints, setPlayerPoints] = useState(0);
  const [aiPoints, setAiPoints] = useState(0);
  // const [aiPointsText, setAiPointsText] = useState(0);
  // const [total, setTotal] = useState(0);

  const [truth, setTruth] = useState<number[]>([]);
  const [predicted, setPredicted] = useState<number[]>([]);

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

  const drawTruth = useCallback(
    (_: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
      context.beginPath();
      context.strokeStyle = "yellow";
      context.lineWidth = 3;
      context.rect(truth[0], truth[1], truth[2] - truth[0], truth[3] - truth[1]);
      context.stroke();

      if (bbIntersectionOverUnion(truth, predicted) > 0.5) {
        context.strokeStyle = "green";
      } else {
        context.strokeStyle = "red";
      }

      context.lineWidth = 3;
      context.beginPath();
      context.rect(
        predicted[0],
        predicted[1],
        predicted[2] - predicted[0],
        predicted[3] - predicted[1]
      );
      context.stroke();
    },
    [predicted, truth]
  );

  const drawHint = useCallback(
    (_: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
      const x = truth[0] + (truth[2] - truth[0]) / 2 + Math.random() * 100 - 50;
      const y = truth[1] + (truth[3] - truth[1]) / 2 + Math.random() * 100 - 50;

      context.beginPath();
      context.strokeStyle = "red";
      context.lineWidth = 2;
      context.arc(x, y, 100, 0, 2 * Math.PI);
      context.stroke();
    },
    [truth]
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

  const drawPlayer = (
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    mouseX: number,
    mouseY: number
  ) => {
    const { x, y } = getMousePosition(mouseX, mouseY, canvas);

    if (truth[0] <= x && x <= truth[2] && truth[1] <= y && y <= truth[3]) {
      // setPlayerPoints((prevState) => prevState + 1);
      context.strokeStyle = "green";
    } else {
      context.strokeStyle = "red";
    }

    context.beginPath();
    context.moveTo(x - 5, y - 5);
    context.lineTo(x + 5, y + 5);
    context.moveTo(x + 5, y - 5);
    context.lineTo(x - 5, y + 5);
    context.stroke();
  };

  useEffect(() => {
    if (timeRemaining <= 0) {
      setOpen(true);
      stopTimer();

      setDraw(() => (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) =>
        drawTruth(canvas, context)
      );

      // setAiPointsText(aiPoints);
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
  }, [aiPoints, drawHint, drawTruth, hinted, timeRemaining]);

  const onCanvasClick = async (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (timeRemaining <= 0 || clicked || !running) {
      return;
    }

    setClicked(true);

    stopTimer();

    const [mouseX, mouseY] = [event.clientX, event.clientY];

    setDraw(() => (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
      drawTruth(canvas, context);
      drawPlayer(canvas, context, mouseX, mouseY);
    });

    // setAiPointsText(aiPoints);

    setOpen(true);
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
    setTimeRemaining(totalTime);
    setLoading(true);

    const fileNumber = getNewFileNumber();

    // Retrieve annotations
    await fetch(`${process.env.PUBLIC_URL}/content/annotation/${fileNumber}.json`)
      .then((res) => res.json())
      .then((data: { truth: number[]; predicted: number[] }) => {
        setTruth(data.truth);
        setPredicted(data.predicted);

        if (bbIntersectionOverUnion(truth, predicted) > 0.5) {
          setAiPoints((prevState) => prevState + 1);
        }
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
      // setTotal((prevState) => prevState + 1);
    };
  };

  const onStartNextClick = async () => {
    if (!started) {
      setStarted(true);
    }
    setOpen(false);

    await loadNewImage();
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

  const cavasSize = IsFullWidth();

  return (
    <div>
      <AppBar position="static">
        <Toolbar className={styles.navbar} variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setRoute("home")}
          >
            <BackButtonIcon />
          </IconButton>
          <Typography>Spot the Lesion</Typography>
        </Toolbar>
      </AppBar>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Sugi?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous location data to
            Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <div className={styles.loadingButtonContainer}>
            <Button
              className={styles.startNextButton}
              variant="contained"
              size="large"
              disabled={running || loading}
              onClick={onStartNextClick}
            >
              {started ? "Next" : "Start"}
            </Button>

            {loading && <CircularProgress className={styles.circularProgress} size={24} />}
          </div>
        </DialogActions>
      </Dialog>
      <div className={styles.container}>
        <Card className={styles.scoresContainer}>
          <Typography variant="h4" className={styles.countdown} style={{ color: countdownColor }}>
            Time remaining: {timeRemainingText}s
          </Typography>

          <LinearProgress
            variant="determinate"
            value={timeRemaining * 10}
            className={styles.linearProgress}
            classes={{ barColorPrimary: countdownColor }}
          />
        </Card>
        <div className={styles.canvasContainer}>
          <Card className={styles.cardCanvas}>
            <canvas ref={canvasRef} onClick={onCanvasClick} width={cavasSize} height={cavasSize} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Game;
