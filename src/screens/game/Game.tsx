import React, { useEffect, useRef, useState } from "react";
import { Button } from "@material-ui/core";

const Game: React.FC<GameProps> = ({ setRoute }: GameProps) => {
  let timeRemaining = 10;
  const seenFiles = new Set<number>();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [timeouts, setTimeouts] = useState<number[]>([]);
  const [countdown, setCountdown] = useState(0);
  const [countdownColor, setCountdownColor] = useState("#373737");
  const [timeRemainingDisplayValue, setTimeRemainingDisplayValue] = useState("10");
  const [correct, setCorrect] = useState(0);
  const [ourCorrect, setOurCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [truth, setTruth] = useState<number[]>([]);
  const [predicted, setPredicted] = useState<number[]>([]);
  const [clicked, setClicked] = useState(false);
  const [hinted, setHinted] = useState(false);

  type DrawType = ((canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => void) | null;
  const [draw, setDraw] = useState<DrawType>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null) {
      return;
    }

    const context = canvas.getContext("2d");
    if (context == null) {
      return;
    }

    if (draw == null) {
      return;
    }

    draw(canvas, context);
  }, [draw]);

  const bbIntersectionOverUnion = (boxA: number[], boxB: number[]): number => {
    const xA = Math.max(boxA[0], boxB[0]);
    const yA = Math.max(boxA[1], boxB[1]);
    const xB = Math.min(boxA[2], boxB[2]);
    const yB = Math.min(boxA[3], boxB[3]);

    const interArea = Math.max(0, xB - xA + 1) * Math.max(0, yB - yA + 1);

    const boxAArea = (boxA[2] - boxA[0] + 1) * (boxA[3] - boxA[1] + 1);
    const boxBArea = (boxB[2] - boxB[0] + 1) * (boxB[3] - boxB[1] + 1);

    return interArea / (boxAArea + boxBArea - interArea);
  };

  const clearTimeouts = () => {
    timeouts.forEach((element) => clearTimeout(element));
    setTimeouts([]);
  };

  const drawTruth = () =>
    setDraw(() => (_: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
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
    });

  const drawHint = () => {
    if (hinted) {
      return;
    }

    setHinted(true);

    const x = truth[0] + (truth[2] - truth[0]) / 2 + Math.random() * 100 - 50;
    const y = truth[1] + (truth[3] - truth[1]) / 2 + Math.random() * 100 - 50;

    setDraw(() => (_: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
      context.beginPath();
      context.strokeStyle = "red";
      context.lineWidth = 2;
      context.arc(x, y, 100, 0, 2 * Math.PI);
      context.stroke();
    });
  };

  const stopTimer = () => {
    clearInterval(countdown);
  };

  const getMousePosition = (playerX: number, playerY: number, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect(); // abs. size of element
    const scaleX = canvas.width / rect.width; // relationship bitmap vs. element for X
    const scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y

    return {
      x: (playerX - rect.left) * scaleX, // scale mouse coordinates after they have
      y: (playerY - rect.top) * scaleY, // been adjusted to be relative to element
    };
  };

  const onCanvasClick = async (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (timeRemaining <= 0 || clicked) {
      return;
    }

    setClicked(true);

    drawTruth();
    stopTimer();

    const [playerX, playerY] = [event.clientX, event.clientY];

    setDraw(() => (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
      const { x, y } = getMousePosition(playerX, playerY, canvas);

      if (truth[0] <= x && y <= truth[2] && truth[1] <= x && y <= truth[3]) {
        setCorrect((prevState) => prevState + 1);
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
    });

    clearTimeouts();
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
    clearTimeouts();

    setClicked(false);
    timeRemaining = 10;
    setHinted(false);
    const id = getNewFileNumber();

    // Retrieve annotations
    await fetch(`${process.env.PUBLIC_URL}/content/annotation/${id}.json`)
      .then((res) => res.json())
      .then((data) => {
        setTruth(data.truth);
        setPredicted(data.predicted);

        if (bbIntersectionOverUnion(truth, predicted) > 0.5) {
          setOurCorrect(ourCorrect + 1);
        }
      });

    // Build the image
    const img = new Image();
    img.src = `${process.env.PUBLIC_URL}/content/images/${id}.png`;
    img.onload = () =>
      setDraw(() => (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      });

    const hintTimeout = window.setTimeout(drawHint, 5000);
    const truthTimeout = window.setTimeout(drawTruth, 10000);
    setTimeouts((prevState) => [...prevState, hintTimeout, truthTimeout]);

    setCountdown(
      window.setInterval(() => {
        if (timeRemaining <= 0) {
          clearInterval(countdown);
        } else {
          setTimeRemainingDisplayValue(timeRemaining.toFixed(1));

          if (timeRemaining > 5) {
            setCountdownColor("#373737");
          } else if (timeRemaining > 2) {
            setCountdownColor("orange");
          } else {
            setCountdownColor("red");
          }
        }

        timeRemaining -= 0.1;
      }, 100)
    );

    setTotal((prevState) => prevState + 1);
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
          <h3 style={{ color: countdownColor }}>Time remaining: {timeRemainingDisplayValue}s</h3>

          <h3>Results</h3>

          <h4>Correct (you): {correct}</h4>

          <h4>Correct (AI): {ourCorrect}</h4>

          <h4>Total Scans: {total}</h4>
        </div>
      </div>
    </div>
  );
};

export default Game;
