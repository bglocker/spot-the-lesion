import React from "react";
import { AppBar, Card, Tab, Tabs, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { NavigationAppBar } from "../../components";

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    card: {
      height: "80%",
      width: "80%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
      padding: 8,
    },
    text: {
      textAlign: "center",
      [theme.breakpoints.only("xs")]: {
        fontSize: "1rem",
      },
      [theme.breakpoints.only("sm")]: {
        fontSize: "1.25rem",
      },
      [theme.breakpoints.only("md")]: {
        fontSize: "1.5rem",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "2rem",
      },
    },
    appBar: {
      alignItems: "center",
      backgroundColor: "#004445",
    },
    tabIndicator: {
      backgroundColor: "#C4DFE6",
    },
    tab: {
      fontSize: "1rem",
    },
  })
);

const Credits: React.FC = () => {
  const classes = useStyles();

  const [currentTableIndex, setCurrentTableIndex] = React.useState(0);

  const getTableContent = (tableIndex) => {
    if (tableIndex === 0) {
      return (
        <div className={classes.container}>
          <Card className={classes.card}>
            <Typography className={classes.text}>
              This demo is based on our{" "}
              <a href="https://arxiv.org/abs/1906.02283" target="blank">
                MICCAI 2019 paper
              </a>
            </Typography>

            <Typography className={classes.text}>
              CT Scan AI developed by Martin Zlocha, Qi Dou and Ben Glocker.
            </Typography>

            <Typography className={classes.text}>
              This site was made with React for the 3rd year Software Engineering Group Project by:
              Andrei-Matei Roman, Andrei-Ovidiu Badea, Calin-Andrei Alexandru, Calin Biberea,
              Cosmin-Ionut Baies, Tiberiu-Andrei Georgescu
            </Typography>

            <Typography className={classes.text}>
              (c) 2019 Data obtained from the{" "}
              <a
                href="https://www.nih.gov/news-events/news-releases/nih-clinical-center-releases-dataset-32000-ct-images"
                target="blank"
              >
                NIH Clinical Center
              </a>
            </Typography>
          </Card>
        </div>
      );
    }
    return <div>Revolution</div>;
  };

  return (
    <>
      <NavigationAppBar showBack />
      <AppBar className={classes.appBar} position="sticky">
        <Tabs
          value={currentTableIndex}
          onChange={(_, newTableIndex) => setCurrentTableIndex(newTableIndex)}
          aria-label="Leaderboards"
          classes={{ indicator: classes.tabIndicator }}
        >
          <Tab
            className={classes.tab}
            label="About The Game"
            id="game-info"
            aria-controls="about-view-0"
          />

          <Tab
            className={classes.tab}
            label="Libraries & Images"
            id="game-credits"
            aria-controls="about-view-1"
          />
        </Tabs>
      </AppBar>

      {getTableContent(currentTableIndex)}
    </>
  );
};

export default Credits;
