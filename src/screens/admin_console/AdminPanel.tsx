import React, { useState } from "react";
import { Button } from "@material-ui/core/";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { NavigationAppBar } from "../../components";
import GameSettings from "./GameSettings";
import FileUpload from "./FileUpload";

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    buttonContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    button: {
      margin: 8,
      borderRadius: 20,
      [theme.breakpoints.only("xs")]: {
        width: 250,
        fontSize: "1rem",
      },
      [theme.breakpoints.only("sm")]: {
        width: 300,
        fontSize: "1rem",
      },
      [theme.breakpoints.up("md")]: {
        width: 320,
        fontSize: "1.25rem",
      },
    },
  })
);

const AdminPanel: React.FC = () => {
  const classes = useStyles();

  const [showGameSettings, setShowGameSettings] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);

  if (showGameSettings) {
    return <GameSettings />;
  }

  if (showFileUpload) {
    return <FileUpload />;
  }

  return (
    <>
      <NavigationAppBar />

      <div className={classes.container}>
        <div className={classes.buttonContainer}>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            size="large"
            onClick={() => setShowGameSettings(true)}
          >
            Game Settings Panel
          </Button>

          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            size="large"
            onClick={() => setShowFileUpload(true)}
          >
            File Upload Panel
          </Button>
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
