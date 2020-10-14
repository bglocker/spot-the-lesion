import React, { useEffect, useRef, useState } from "react";
import { Button } from "@material-ui/core";

const Game: React.FC<GameProps> = ({ setRoute }: GameProps) => {
  let hinted = false;
  let clicked = false;
  let truth: number[];
  let predicted: number[];
  let correct = 0;
  let ourCorrect = 0;
  let total = 0;
  let timeOuts: NodeJS.Timeout[] = [];
  let countdown: NodeJS.Timeout;
  let timeRemaining = 10;
  const seen = new Set<number>();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  let canvas: HTMLCanvasElement | null;
  let context: CanvasRenderingContext2D | null;

  const [countdownColor, setCountdownColor] = useState("#373737");
  const [timeRemainingDisplayValue, setTimeRemainingDisplayValue] = useState("10");
  const [displayCorrect, setDisplayCorrect] = useState(0);
  const [displayOurCorrect, setDisplayOurCorrect] = useState(0);
  const [displayTotal, setDisplayTotal] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    canvas = canvasRef.current;
    if (canvas) {
      context = canvas.getContext("2d");
    }
  }, []);

  // todo: add seed for random

  const randomFileNumber = (): number => {
    const max = 4817;
    const value = Math.round(Math.random() * max);

    if (seen.has(value)) {
      return randomFileNumber();
    }

    seen.add(value);
    return value;
  };

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

  const updateScores = () => {
    setDisplayCorrect(correct);
    setDisplayOurCorrect(ourCorrect);
    setDisplayTotal(total);
  };

  const drawTruth = () => {
    if (context == null) {
      return;
    }

    // Ground Truth
    context.beginPath();
    context.strokeStyle = "yellow";
    context.lineWidth = 3;
    context.rect(truth[0], truth[1], truth[2] - truth[0], truth[3] - truth[1]);
    context.stroke();

    context.beginPath();

    if (bbIntersectionOverUnion(truth, predicted) > 0.5) {
      context.strokeStyle = "green";
    } else {
      context.strokeStyle = "red";
    }

    context.lineWidth = 3;
    context.rect(
      predicted[0],
      predicted[1],
      predicted[2] - predicted[0],
      predicted[3] - predicted[1]
    );
    context.stroke();

    updateScores();
  };

  const getMousePosition = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (canvas == null) {
      return { x: 0, y: 0 };
    }

    const rect = canvas.getBoundingClientRect(); // abs. size of element
    const scaleX = canvas.width / rect.width; // relationship bitmap vs. element for X
    const scaleY = canvas.height / rect.height; // relationship bitmap vs. element for Y

    return {
      x: (event.clientX - rect.left) * scaleX, // scale mouse coordinates after they have
      y: (event.clientY - rect.top) * scaleY, // been adjusted to be relative to element
    };
  };

  const stopTimer = () => {
    clearInterval(countdown);
  };

  const resetState = () => {
    timeOuts.forEach((element) => {
      clearTimeout(element);
    });

    timeOuts = [];
  };

  const onCanvasClick = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (timeRemaining <= 0 || clicked) {
      return;
    }

    clicked = true;

    drawTruth();
    stopTimer();

    if (context == null) {
      return;
    }

    // Cross for the mouse click
    context.beginPath();

    const position = getMousePosition(event);

    if (
      truth[0] <= position.x &&
      position.x <= truth[2] &&
      truth[1] <= position.y &&
      position.y <= truth[3]
    ) {
      correct += 1;
      context.strokeStyle = "green";
    } else {
      context.strokeStyle = "red";
    }

    context.moveTo(position.x - 5, position.y - 5);
    context.lineTo(position.x + 5, position.y + 5);
    context.moveTo(position.x + 5, position.y - 5);
    context.lineTo(position.x - 5, position.y + 5);
    context.stroke();

    updateScores();
    resetState();
  };

  const drawHint = () => {
    if (hinted) {
      return;
    }

    hinted = true;

    const x = truth[0] + (truth[2] - truth[0]) / 2 + Math.random() * 100 - 50;
    const y = truth[1] + (truth[3] - truth[1]) / 2 + Math.random() * 100 - 50;

    if (context == null) {
      return;
    }

    context.beginPath();
    context.strokeStyle = "red";
    context.lineWidth = 2;
    context.arc(x, y, 100, 0, 2 * Math.PI);
    context.stroke();
  };

  const loadRandomImage = () => {
    stopTimer();
    resetState();
    updateScores();

    clicked = false;
    timeRemaining = 10;

    hinted = false;
    const id = randomFileNumber();
    const img = new Image();

    img.onload = () => {
      if (context == null || canvas == null) {
        return;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.setAttribute("src", `src/screens/game/content/images/${id}.png`);

    fetch(`content/annotation/${id}.json`)
      .then((res) => res.json())
      .then((data) => {
        truth = data.truth;
        predicted = data.predicted;

        if (bbIntersectionOverUnion(truth, predicted) > 0.5) {
          ourCorrect += 1;
        }
      });

    timeOuts.push(setTimeout(() => drawHint(), 5000));
    timeOuts.push(setTimeout(() => drawTruth(), 10000));

    countdown = setInterval(() => {
      if (timeRemaining <= 0) {
        clearInterval(countdown);
      } else {
        setTimeRemainingDisplayValue((Math.round(timeRemaining * 10) / 10).toFixed(1));

        if (timeRemaining > 5) {
          setCountdownColor("#373737");
        } else if (timeRemaining > 2) {
          setCountdownColor("orange");
        } else {
          setCountdownColor("red");
        }
      }

      timeRemaining -= 0.1;
    }, 100);

    total += 1;
  };

  const start = () => {
    if (started) {
      return;
    }

    setStarted(true);
    loadRandomImage();
  };

  return (
    <div>
      <p>Game</p>
      <Button onClick={() => setRoute("home")}>Back</Button>

      <div className="page-wrap">
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
          <div className="item" id="item-2">
            {!started ? (
              <div id="initial">
                <Button onClick={() => start()}>Start</Button>
              </div>
            ) : (
              <div id="main">
                <canvas
                  onClick={(event) => onCanvasClick(event)}
                  ref={canvasRef}
                  id="canvas"
                  width="512px"
                  height="512px"
                />
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                  <Button onClick={() => loadRandomImage()}>Next</Button>
                </div>
              </div>
            )}
          </div>

          <div className="item sidebar" id="item-3">
            <h3 id="countdown" style={{ color: countdownColor }}>
              Time remaining: {timeRemainingDisplayValue}s
            </h3>

            <h3>Results</h3>
            <h4>
              <div id="correct">Correct (you): {displayCorrect}</div>
            </h4>
            <h4>
              <div id="ourCorrect">Correct (AI): {displayOurCorrect}</div>
            </h4>
            <h4>
              <div id="total">Total Scans: {displayTotal}</div>
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
