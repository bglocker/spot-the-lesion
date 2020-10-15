import React, { useState } from "react";
import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import BackButtonIcon from "@material-ui/icons/KeyboardBackspace";
import Home from "./screens/home/Home";
import Game from "./screens/game/Game";
import Tutorial from "./screens/tutorial/Tutorial";
import About from "./screens/about/About";
import Credits from "./screens/credits/Credits";

const useStyles = makeStyles((theme) =>
  createStyles({
    navbar: {
      background: "#07575B",
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
  })
);

const App: React.FC = () => {
  const styles = useStyles();

  const [route, setRoute] = useState<Route>("home");
  const [backButton, setBackButton] = useState(false);

  let currentScreen: React.ReactNode;
  switch (route) {
    default: // fall-through
    case "home":
      currentScreen = <Home setRoute={setRoute} setBackButton={setBackButton} />;
      break;
    case "game":
      currentScreen = <Game setRoute={setRoute} setBackButton={setBackButton} />;
      break;
    case "tutorial1":
      currentScreen = <Tutorial setRoute={setRoute} setBackButton={setBackButton} />;
      break;
    case "about":
      currentScreen = <About setRoute={setRoute} setBackButton={setBackButton} />;
      break;
    case "credits":
      currentScreen = <Credits setRoute={setRoute} setBackButton={setBackButton} />;
      break;
  }

  const returnHome = () => {
    setRoute("home");
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar className={styles.navbar} variant="dense">
          {backButton && (
            <IconButton
              className={styles.menuButton}
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={returnHome}
            >
              <BackButtonIcon />
            </IconButton>
          )}
          <Typography>Spot the Lesion</Typography>
        </Toolbar>
      </AppBar>
      {currentScreen}
    </div>
  );
};

export default App;
