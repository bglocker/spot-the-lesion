import React, { useEffect } from "react";
import { createMuiTheme, createStyles, makeStyles, ThemeProvider } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { getGlobalVariables, initializeFirebase } from "./firebase/firebaseApp";
import Achievements from "./screens/achievements/Achievements";
import AdminAuth from "./screens/admin_console/AdminAuth";
import Credits from "./screens/credits/Credits";
import GameMenu from "./screens/game/GameMenu";
import GameRoute from "./screens/game/GameRoute";
import Home from "./screens/home/Home";
import Leaderboard from "./screens/leaderboard/Leaderboard";
import Statistics from "./screens/statistics/Statistics";
import Tutorial from "./screens/tutorial/Tutorial";
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
    },
  })
);

const App: React.FC = () => {
  const classes = useStyles();

  useEffect(() => {
    const initializeApp = async () => {
      if (!(await initializeFirebase()) || !(await getGlobalVariables())) {
        console.warn("App initialization unsuccessful");
      }
    };

    initializeApp().then(() => {});
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={2} preventDuplicate>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <div className={classes.container}>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>

              <Route path="/achievements">
                <Achievements />
              </Route>

              <Route path="/admin">
                <AdminAuth />
              </Route>

              <Route
                path="/challenge"
                render={({ history, location }) => {
                  history.replace("/");
                  history.push("/game-menu");
                  history.push(`/game${location.search}`);

                  return null;
                }}
              />

              <Route path="/credits">
                <Credits />
              </Route>

              <Route
                path="/game"
                render={({ history, location }) => (
                  <GameRoute history={history} location={location} />
                )}
              />

              <Route path="/game-menu">
                <GameMenu />
              </Route>

              <Route path="/leaderboard">
                <Leaderboard />
              </Route>

              <Route path="/statistics">
                <Statistics />
              </Route>

              <Route path="/tutorial">
                <Tutorial />
              </Route>

              <Route path="*">
                {/* TODO: 404 page */}
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
