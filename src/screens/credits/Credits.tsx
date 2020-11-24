import React from "react";
import { AppBar, IconButton, Toolbar, Typography, Card, Theme } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { KeyboardBackspace } from "@material-ui/icons";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backButton: {
      marginRight: 8,
    },
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
  })
);

const Credits: React.FC = () => {
  const classes = useStyles();

  const history = useHistory();

  return (
    <>
      <AppBar position="sticky">
        <Toolbar variant="dense">
          <IconButton
            className={classes.backButton}
            edge="start"
            color="inherit"
            aria-label="Back"
            onClick={() => history.goBack()}
          >
            <KeyboardBackspace />
          </IconButton>

          <Typography>Spot the Lesion</Typography>
        </Toolbar>
      </AppBar>

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
    </>
  );
};

export default Credits;
