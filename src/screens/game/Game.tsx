import React, { useRef, useState } from "react";
import { Button } from "@material-ui/core";

const Game: React.FC<GameProps> = ({ setRoute }: GameProps) => {
  let timeOuts: NodeJS.Timeout[] = [];
  let countdown: NodeJS.Timeout;
  let timeRemaining = 10;
  const seen = new Set<number>();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [countdownColor, setCountdownColor] = useState("#373737");
  const [timeRemainingDisplayValue, setTimeRemainingDisplayValue] = useState("10");
  const [correct, setCorrect] = useState(0);
  const [displayCorrect, setDisplayCorrect] = useState(0);
  const [ourCorrect, setOurCorrect] = useState(0);
  const [displayOurCorrect, setDisplayOurCorrect] = useState(0);
  const [total, setTotal] = useState(0);
  const [displayTotal, setDisplayTotal] = useState(0);
  const [started, setStarted] = useState(false);
  const [truth, setTruth] = useState([]);
  const [predicted, setPredicted] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [hinted, setHinted] = useState(false);

  const randomFileNumber = (): number => {
    const max = 4723;
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
    if (!canvasRef.current) {
      return;
    }
    const canvasContext = canvasRef.current.getContext("2d");

    if (!canvasContext) {
      return;
    }

    canvasContext.beginPath();
    canvasContext.strokeStyle = "yellow";
    canvasContext.lineWidth = 3;
    canvasContext.rect(truth[0], truth[1], truth[2] - truth[0], truth[3] - truth[1]);
    canvasContext.stroke();

    canvasContext.beginPath();

    if (bbIntersectionOverUnion(truth, predicted) > 0.5) {
      canvasContext.strokeStyle = "green";
    } else {
      canvasContext.strokeStyle = "red";
    }

    canvasContext.lineWidth = 3;
    canvasContext.rect(
      predicted[0],
      predicted[1],
      predicted[2] - predicted[0],
      predicted[3] - predicted[1]
    );
    canvasContext.stroke();

    updateScores();
  };

  const getMousePosition = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (canvasRef.current == null) {
      return { x: 0, y: 0 };
    }

    const rect = canvasRef.current.getBoundingClientRect(); // abs. size of element
    const scaleX = canvasRef.current.width / rect.width; // relationship bitmap vs. element for X
    const scaleY = canvasRef.current.height / rect.height; // relationship bitmap vs. element for Y

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

  const onCanvasClick = async (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!canvasRef.current) {
      return;
    }
    const canvasContext = canvasRef.current.getContext("2d");

    if (!canvasContext) {
      return;
    }

    if (timeRemaining <= 0 || clicked) {
      return;
    }

    setClicked(true);

    drawTruth();
    stopTimer();

    canvasContext.beginPath();

    const position = getMousePosition(event);

    if (
      truth[0] <= position.x &&
      position.x <= truth[2] &&
      truth[1] <= position.y &&
      position.y <= truth[3]
    ) {
      setCorrect(correct + 1);
      canvasContext.strokeStyle = "green";
    } else {
      canvasContext.strokeStyle = "red";
    }

    canvasContext.moveTo(position.x - 5, position.y - 5);
    canvasContext.lineTo(position.x + 5, position.y + 5);
    canvasContext.moveTo(position.x + 5, position.y - 5);
    canvasContext.lineTo(position.x - 5, position.y + 5);
    canvasContext.stroke();

    updateScores();
    resetState();
  };

  const drawHint = () => {
    if (!canvasRef.current) {
      return;
    }
    const canvasContext = canvasRef.current.getContext("2d");

    if (!canvasContext) {
      return;
    }

    if (hinted) {
      return;
    }

    setHinted(true);

    const x = truth[0] + (truth[2] - truth[0]) / 2 + Math.random() * 100 - 50;
    const y = truth[1] + (truth[3] - truth[1]) / 2 + Math.random() * 100 - 50;

    canvasContext.beginPath();
    canvasContext.strokeStyle = "red";
    canvasContext.lineWidth = 2;
    canvasContext.arc(x, y, 100, 0, 2 * Math.PI);
    canvasContext.stroke();
  };

  const loadRandomImage = async () => {
    stopTimer();
    resetState();
    updateScores();

    setClicked(false);
    timeRemaining = 10;
    setHinted(false);
    const id = randomFileNumber();
    const img = new Image();

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
    img.src = `${process.env.PUBLIC_URL}/content/images/${id}.png`;
    img.onload = () => {
      if (!canvasRef.current) {
        return;
      }
      const canvasContext = canvasRef.current.getContext("2d");

      if (!canvasContext) {
        return;
      }

      canvasContext.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasContext.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
    };

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

    setTotal(total + 1);
  };

  const start = async () => {
    if (started) {
      return;
    }

    setStarted(true);
    await loadRandomImage();
  };

  return (
    <div>
      <p>Game</p>
      <Button onClick={() => setRoute("home")}>Back</Button>

      <div className="page-wrap">
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
          <div className="item" id="item-2">
            <div id="initial">
              <Button onClick={() => start()}>Start</Button>
            </div>
            <div id="main">
              <canvas
                ref={canvasRef}
                onClick={(event) => onCanvasClick(event)}
                id="canvas"
                width="512px"
                height="512px"
              />
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Button onClick={() => loadRandomImage()}>Next</Button>
              </div>
            </div>
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
