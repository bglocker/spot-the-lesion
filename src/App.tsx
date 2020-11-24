import React from "react";
import { createMuiTheme, createStyles, makeStyles, ThemeProvider } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./screens/home/Home";
import GameMenu from "./screens/game/GameMenu";
import GameRoute from "./screens/game/GameRoute";
import Tutorial from "./screens/tutorial/Tutorial";
import Leaderboard from "./screens/leaderboard/Leaderboard";
import Achievements from "./screens/achievements/Achievements";
import Statistics from "./screens/statistics/Statistics";
import About from "./screens/about/About";
import Credits from "./screens/credits/Credits";
import colors from "./res/colors";

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

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={2} preventDuplicate>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <div className={classes.container}>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>

              <Route path="/admin">
                <h3>Admin Page</h3>
              </Route>

              <Route path="/game-menu">
                <GameMenu />
              </Route>

              <Route path="/game">
                <GameRoute />
              </Route>

              <Route path="/tutorial">
                <Tutorial />
              </Route>

              <Route path="/leaderboard">
                <Leaderboard />
              </Route>

              <Route path="/achievements">
                <Achievements />
              </Route>

              <Route path="/statistics">
                <Statistics />
              </Route>

              <Route path="/about">
                <About />
              </Route>

              <Route path="/credits">
                <Credits />
              </Route>

              <Route path="*">
                <h1>Error 404</h1>
              </Route>
            </Switch>
          </div>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
