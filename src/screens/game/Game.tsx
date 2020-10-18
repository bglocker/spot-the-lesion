import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  CircularProgress,
  LinearProgress,
  Typography,
  makeStyles,
} from "@material-ui/core";
import useInterval from "../../components/useInterval";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: "93vh",
  },
  canvasContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  cardCanvas: {
    height: 512,
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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 8,
  },
  countdown: {
    marginBottom: 8,
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
});

// Colour codes
const VALID_COLOUR = "green";
const INVALID_COLOUR = "red";
const DEFAULT_COLOUR = "yellow";
const TRUE_COLOUR = "blue";

const Game: React.FC<GameProps> = ({ setBackButton }: GameProps) => {
  const classes = useStyles();

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

  const [playerPoints, setPlayerPoints] = useState(0);
  const [aiPoints, setAiPoints] = useState(0);
  const [total, setTotal] = useState(0);

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

  // WARNING: Don't use this function outside of this class
  // PRE: rectBounds has at least 4 elements
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
          } else {
            drawPredicted(canvas, context, INVALID_COLOUR);
          }
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
      }, 2000);

      setTimeout(() => {
        if (isPlayerRight(canvas, mouseX, mouseY)) {
          setPlayerPoints((prevState) => prevState + 1);
          drawPlayer(canvas, context, mouseX, mouseY, VALID_COLOUR);
        } else {
          drawPlayer(canvas, context, mouseX, mouseY, INVALID_COLOUR);
        }
      }, 3000);

      setTimeout(() => {
        if (isAIPredictionRight()) {
          setAiPoints((prevState) => prevState + 1);
          drawPredicted(canvas, context, VALID_COLOUR);
        } else {
          drawPredicted(canvas, context, INVALID_COLOUR);
        }
      }, 4000);
    });
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
    if (!started) {
      setStarted(true);
    }
    await loadNewImage();
  };

  setBackButton(true);

  return (
    <div className={classes.container}>
      <div className={classes.canvasContainer}>
        <Card className={classes.cardCanvas}>
          <canvas ref={canvasRef} onClick={onCanvasClick} width="512px" height="512px" />
        </Card>

        <div className={classes.loadingButtonContainer}>
          <Button
            className={classes.startNextButton}
            variant="contained"
            size="large"
            disabled={running || loading}
            onClick={onStartNextClick}
          >
            {started ? "Next" : "Start"}
          </Button>

          {loading && <CircularProgress className={classes.circularProgress} size={24} />}
        </div>
      </div>

      <Card className={classes.scoresContainer}>
        <Typography variant="h4" className={classes.countdown} style={{ color: countdownColor }}>
          Time remaining: {timeRemainingText}s
        </Typography>

        <LinearProgress
          variant="determinate"
          value={timeRemaining * 10}
          className={classes.linearProgress}
          classes={{ barColorPrimary: countdownColor }}
        />

        <Typography variant="h4" className={classes.results}>
          Results
        </Typography>

        <Typography variant="subtitle1" className={classes.scoreTypography}>
          Correct (you): {playerPoints}
        </Typography>

        <Typography variant="subtitle1" className={classes.scoreTypography}>
          Correct (AI): {aiPoints}
        </Typography>

        <Typography variant="subtitle1" className={classes.scoreTypography}>
          Total Scans: {total}
        </Typography>
      </Card>
    </div>
  );
};

export default Game;
