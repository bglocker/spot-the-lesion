import React, { useEffect, useState } from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import { getGlobalVariables, initializeFirebase } from "./firebase/firebaseApp";
import { HideFragment } from "./components";
import Loading from "./screens/loading/Loading";
import Router from "./Router";
import colors from "./res/colors";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
    },
  },
});

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      if (!(await initializeFirebase()) || !(await getGlobalVariables())) {
        console.warn("App initialization unsuccessful");
      }

      setLoading(false);
    };

    initializeApp().then(() => {});
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={2} preventDuplicate>
        <HideFragment hide={!loading}>
          <Loading />
        </HideFragment>

        <HideFragment hide={loading}>
          <Router />
        </HideFragment>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
