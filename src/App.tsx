import React, { useState } from "react";
import { createMuiTheme, createStyles, makeStyles, ThemeProvider } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import colors from "./res/colors";
import Home from "./screens/home/Home";
import Tutorial from "./screens/tutorial/Tutorial";
import About from "./screens/about/About";
import Credits from "./screens/credits/Credits";
import Leaderboard from "./screens/leaderboard/Leaderboard";
import Statistics from "./screens/statistics/Statistics";
import OptionsManager from "./screens/game/selectMode/OptionsManager";
import Achievements from "./screens/achievements/Achievements";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary /* TODO: secondary should contrast primary */,
    },
  },
});

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: colors.secondary,
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
      currentScreen = <OptionsManager setRoute={setRoute} />;
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
    case "statistics":
      currentScreen = <Statistics setRoute={setRoute} />;
      break;
    case "achievements":
      currentScreen = <Achievements setRoute={setRoute} />;
      break;
  }

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <ThemeProvider theme={theme}>
        <Switch>
          <Route path="/admin">
            <h3>Admin Page</h3>
          </Route>

          <Route path="/">
            <SnackbarProvider maxSnack={2} preventDuplicate>
              <div className={classes.container}>{currentScreen}</div>
            </SnackbarProvider>
          </Route>
        </Switch>
      </ThemeProvider>
    </Router>
  );
};

export default App;
