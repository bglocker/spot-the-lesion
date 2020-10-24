import React, { useState } from "react";
import { makeStyles, createStyles, createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import colors from "./res/colors";
import Home from "./screens/home/Home";
import Game from "./screens/game/Game";
import Tutorial from "./screens/tutorial/Tutorial";
import About from "./screens/about/About";
import Credits from "./screens/credits/Credits";
import Leaderboard from "./screens/leaderboard/Leaderboard";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.primary,
    },
  },
});

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#63A2AB",
    },
  })
);

const App: React.FC = () => {
  const classes = useStyles();

  const [route, setRoute] = useState<Route>("home");

  let currentScreen: React.ReactNode;
  switch (route) {
    default: // fall-through
    case "home":
      currentScreen = <Home setRoute={setRoute} />;
      break;
    case "game":
      currentScreen = <Game setRoute={setRoute} />;
      break;
    case "leaderboard":
      currentScreen = <Leaderboard setRoute={setRoute} />;
      break;
    case "tutorial":
      currentScreen = <Tutorial setRoute={setRoute} />;
      break;
    case "about":
      currentScreen = <About setRoute={setRoute} />;
      break;
    case "credits":
      currentScreen = <Credits setRoute={setRoute} />;
      break;
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.container}>{currentScreen}</div>
    </ThemeProvider>
  );
};

export default App;
