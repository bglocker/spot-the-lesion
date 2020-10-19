import React from "react";
import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import BackButtonIcon from "@material-ui/icons/KeyboardBackspace";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  white: {
    marginTop: "2vh",
    backgroundColor: "white",
    height: "80vh",
    borderRadius: 25,
    borderColor: "black",
    borderWidth: "5px",
    borderStyle: "solid",
    justifyContent: "center",
    alignItems: "center",
  },
  textContent: {
    margin: "5%",
    fontSize: "calc((3vh + 3vw)/2)",
    textAlign: "center",
  },
  maxWidth: {
    width: "100%",
  },
  centerContent: {
    lineItems: "center",
  },
  navbar: {
    background: "#07575B",
  },
});

const About: React.FC<AboutProps> = ({ setRoute }: AboutProps) => {
  const styles = useStyles();

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
    </div>
  );
};

export default About;
