import React, { useState } from "react";
import { AppBar, CircularProgress, Grid, IconButton, Toolbar, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { KeyboardBackspace } from "@material-ui/icons";
import { CanvasJSChart } from "canvasjs-react-charts";
import { db } from "../../firebase/firebaseApp";

const useStyles = makeStyles(() =>
  createStyles({
    backButton: {
      marginRight: 8,
    },
    container: {
      height: "100%",
    },
  })
);

const Statistics: React.FC<StatisticsProps> = ({ setRoute }: StatisticsProps) => {
  const classes = useStyles();

  /**
   * Loading flag to enable waiting
   */
  const [loading, setLoading] = useState(true);

  const [aiScore, setAiScore] = useState(0);
  const [humanScore, setHumanScore] = useState(0);
  const [aiWins, setAiWins] = useState(0);
  const [humanWins, setHumanWins] = useState(0);

  /**
   * Retrieves the data from the databse to display into the pie-chart and graph
   */
  const retrieveStatistics = async () => {
    const snapshot = await db.collection("alltime-scores").get();
    let aiScoreCounter = 0;
    let humanScoreCounter = 0;
    let noOfHumanWins = 0;
    let noOfGames = 0;

    snapshot.forEach((doc) => {
      aiScoreCounter += doc.data().ai_score;
      humanScoreCounter += doc.data().score;
      if (doc.data().correct_player_answers > doc.data().correct_ai_answers) {
        noOfHumanWins += 1;
      }
      noOfGames += 1;
    });
    setAiScore(aiScoreCounter / noOfGames);
    setHumanScore(humanScoreCounter / noOfGames);
    setHumanWins(noOfHumanWins);
    setAiWins(noOfGames - noOfHumanWins);

    setLoading(false);
  };

  const getOptionsPieChart = (title: string, aiLabel: string, humanLabel: string) => {
    return {
      animationEnabled: true,
      exportEnabled: true,
      backgroundColor: "#63A2AB",
      title: {
        text: title,
        fontColor: "white",
      },
      data: [
        {
          type: "pie",
          indexLabel: "{label}: {y}",
          indexLabelFontColor: "white",
          startAngle: -90,
          dataPoints: [
            {
              y: aiWins,
              label: aiLabel,
            },
            {
              y: humanWins,
              label: humanLabel,
            },
          ],
        },
      ],
    };
  };

  const getOptionsContainerChart = (title: string, aiLabel: string, humanLabel: string) => {
    return {
      animationEnabled: true,
      exportEnabled: true,
      backgroundColor: "#63A2AB",
      title: {
        text: title,
        fontColor: "white",
      },
      axisX: {
        labelFontSize: "32",
        labelFontColor: "white",
      },
      data: [
        {
          type: "column",
          indexLabel: "{label}: {y}",
          indexLabelFontColor: "white",
          startAngle: -90,
          dataPoints: [
            {
              y: aiScore,
              label: aiLabel,
            },
            {
              y: humanScore,
              label: humanLabel,
            },
          ],
        },
      ],
    };
  };

  const options1 = getOptionsPieChart("Human vs AI", "AI Victories", "Human Victories");
  const options2 = getOptionsContainerChart("Average Scores", "AI Average", "Human Average");

  if (loading) {
    retrieveStatistics();
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

        <CircularProgress />
      </>
    );
  }
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

      <Grid>
        <div>
          <CanvasJSChart options={options1} />
        </div>
        <div>
          <CanvasJSChart options={options2} />
        </div>
      </Grid>
    </>
  );
};

export default Statistics;
