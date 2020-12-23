import React, { useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import colors from "../../res/colors";
import Settings from "./Settings";
import FileUpload from "./fileUpload/FileUpload";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backButton: {
      marginRight: 8,
    },
    container: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.secondary,
    },
    box: {
      backgroundColor: "white",
      width: "60%",
      height: "80%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
      boxSizing: "border-box",
    },
    buttonContainer: {
      alignSelf: "center",
      align: "center",
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
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

  const [displayGameOptions, setDisplayGameOptions] = useState(false);
  const [displayImageUpload, setDisplayImageUpload] = useState(false);

  /**
   * Function for conditional rendering of the Admin Panel
   */
  if (displayGameOptions) {
    return <Settings />;
  }
  if (displayImageUpload) {
    return <FileUpload />;
  }
  return (
    <div className={classes.buttonContainer}>
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        size="large"
        onClick={() => setDisplayGameOptions(true)}
      >
        Game Options Panel
      </Button>

      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        size="large"
        onClick={() => setDisplayImageUpload(true)}
      >
        Image Upload Panel
      </Button>
    </div>
  );
};

export default AdminPanel;
