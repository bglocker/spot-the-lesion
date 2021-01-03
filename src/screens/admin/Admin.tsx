import React from "react";
import { Button } from "@material-ui/core/";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { NavigationAppBar } from "../../components";

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

const Admin: React.FC = () => {
  const history = useHistory();

  const classes = useStyles();

  const onGameSettingsClick = () => history.push("/admin/game-settings");

  const onFileUploadClick = () => history.push("/admin/file-upload");

  return (
    <>
      <NavigationAppBar showBack />

      <div className={classes.container}>
        <div className={classes.buttonContainer}>
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            size="large"
            onClick={onGameSettingsClick}
          >
            Game Settings Panel
          </Button>

          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            size="large"
            onClick={onFileUploadClick}
          >
            File Upload Panel
          </Button>
        </div>
      </div>
    </>
  );
};

export default Admin;
