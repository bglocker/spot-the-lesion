import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@material-ui/core";
import useInterval from "../../components/useInterval";

const Game: React.FC<GameProps> = ({ setRoute }: GameProps) => {
  const seenFiles = new Set<number>();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [running, setRunning] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [hinted, setHinted] = useState(false);

  const [timeRemaining, setTimeRemaining] = useState(10);
  const [timeRemainingText, setTimeRemainingText] = useState("10.0");
  const [countdownColor, setCountdownColor] = useState("#373737");

  const [playerPoints, setPlayerPoints] = useState(0);
  const [aiPoints, setAiPoints] = useState(0);
  const [aiPointsText, setAiPointsText] = useState(0);
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
      setPlayerPoints((prevState) => prevState + 1);
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
      stopTimer();

      setDraw(() => (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) =>
        drawTruth(canvas, context)
      );

      setAiPointsText(aiPoints);
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
    if (timeRemaining <= 0 || clicked) {
      return;
    }

    setClicked(true);

    stopTimer();

    const [mouseX, mouseY] = [event.clientX, event.clientY];

    setDraw(() => (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
      drawTruth(canvas, context);
      drawPlayer(canvas, context, mouseX, mouseY);
    });

    setAiPointsText(aiPoints);
  };

  const getNewFileNumber = (): number => {
    const max = 4723;
    const newFileNumber = Math.round(Math.random() * max);

    if (seenFiles.has(newFileNumber)) {
      return getNewFileNumber();
    }

    seenFiles.add(newFileNumber);

    return newFileNumber;
  };

  const loadNewImage = async () => {
    stopTimer();
    setTimeRemaining(10);

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
      setTotal((prevState) => prevState + 1);
    };
  };

  const onStartClick = async () => {
    await loadNewImage();
  };

  const onNextClick = async () => {
    await loadNewImage();
  };

  return (
    <div>
      <p>Game</p>

      <Button onClick={() => setRoute("home")}>Back</Button>

      <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
        <div>
          <Button onClick={onStartClick}>Start</Button>
        </div>

        <div style={{ borderStyle: "solid" }}>
          <canvas ref={canvasRef} onClick={onCanvasClick} width="512px" height="512px" />

          <div>
            <Button onClick={onNextClick}>Next</Button>
          </div>
        </div>

        <div>
          <h3 style={{ color: countdownColor }}>Time remaining: {timeRemainingText}s</h3>

          <h3>Results</h3>

          <h4>Correct (you): {playerPoints}</h4>

          <h4>Correct (AI): {aiPointsText}</h4>

          <h4>Total Scans: {total}</h4>
        </div>
      </div>
    </div>
  );
};

export default Game;
