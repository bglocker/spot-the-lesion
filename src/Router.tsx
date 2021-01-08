import React, { useCallback } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { useSessionState } from "./hooks";
import Achievements from "./screens/achievements/Achievements";
import Admin from "./screens/admin/Admin";
import AdminAuthContext from "./screens/admin/AdminAuthContext";
import AdminLogin from "./screens/admin/AdminLogin";
import GameSettings from "./screens/admin/GameSettings";
import FileUpload from "./screens/admin/FileUpload";
import Credits from "./screens/credits/Credits";
import GameMenu from "./screens/game/GameMenu";
import GameRoute from "./screens/game/GameRoute";
import Home from "./screens/home/Home";
import Leaderboard from "./screens/leaderboard/Leaderboard";
import PageNotFound from "./screens/404/PageNotFound";
import Statistics from "./screens/statistics/Statistics";
import Tutorial from "./screens/tutorial/Tutorial";

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
    },
  })
);

const Router: React.FC = () => {
  const [adminLoggedIn, setAdminLoggedIn] = useSessionState(false, "adminLoggedIn");

  const classes = useStyles();

  const adminLogIn = useCallback(() => setAdminLoggedIn(true), [setAdminLoggedIn]);

  return (
    <AdminAuthContext.Provider value={{ adminLoggedIn, adminLogIn }}>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <div className={classes.container}>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>

            <Route exact path="/achievements">
              <Achievements />
            </Route>

            <ProtectedRoute exact path="/admin" show={adminLoggedIn} redirectTo="/admin-login">
              <Admin />
            </ProtectedRoute>

            <ProtectedRoute exact path="/admin-login" show={!adminLoggedIn} redirectTo="/admin">
              <AdminLogin />
            </ProtectedRoute>

            <ProtectedRoute
              exact
              path="/admin/game-settings"
              show={adminLoggedIn}
              redirectTo="/admin-login"
            >
              <GameSettings />
            </ProtectedRoute>

            <ProtectedRoute
              exact
              path="/admin/file-upload"
              show={adminLoggedIn}
              redirectTo="/admin-login"
            >
              <FileUpload />
            </ProtectedRoute>

            <Route
              exact
              path="/challenge"
              render={({ history, location }) => {
                history.replace("/");
                history.push("/game-menu");
                history.push(`/game${location.search}`);

                return null;
              }}
            />

            <Route exact path="/credits">
              <Credits />
            </Route>

            <Route
              exact
              path="/game"
              render={({ history, location }) => (
                <GameRoute history={history} location={location} />
              )}
            />

            <Route exact path="/game-menu">
              <GameMenu />
            </Route>

            <Route exact path="/leaderboard">
              <Leaderboard />
            </Route>

            <Route exact path="/statistics">
              <Statistics />
            </Route>

            <Route exact path="/tutorial">
              <Tutorial />
            </Route>

            <Route path="*">
              <PageNotFound />
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    </AdminAuthContext.Provider>
  );
};

export default Router;
