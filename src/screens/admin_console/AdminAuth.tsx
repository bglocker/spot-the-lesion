import React, { useState } from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { firebaseAuth } from "../../firebase/firebaseApp";
import colors from "../../res/colors";
import Settings from "./Settings";

const useStyles = makeStyles((theme) =>
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
      height: "60%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
      boxSizing: "border-box",
    },
    text: {
      [theme.breakpoints.only("xs")]: {
        fontSize: "1.25rem",
      },
      [theme.breakpoints.only("sm")]: {
        fontSize: "1.5rem",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "2rem",
      },
      textAlign: "center",
      marginBottom: 24,
    },
    submit: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    spacing: {
      margin: 10,
    },
  })
);

const AdminAuth: React.FC = () => {
  const classes = useStyles();

  const [password, setPassword] = useState<string>("");
  const [wasLogged, setWasLogged] = useState<boolean>(false);

  if (wasLogged) {
    return <Settings />;
  }

  const submitClick = () => {
    firebaseAuth
      .signInWithEmailAndPassword("spot-the-lesion@gmail.com", password)
      .then(() => {
        // eslint-disable-next-line no-console
        console.log("Managed to log in");

        setWasLogged(true);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  };

  return (
    <>
      <AppBar position="absolute">
        <Toolbar variant="dense">
          <Typography>Spot the Lesion</Typography>
        </Toolbar>
      </AppBar>

      <div className={classes.container}>
        <div className={classes.box}>
          <Typography className={classes.text}> Password </Typography>
          <div className={classes.submit}>
            <input
              className={classes.spacing}
              type="text"
              onChange={(changeTextbox) => setPassword(changeTextbox.target.value)}
            />
            <input className={classes.spacing} type="submit" value="Submit" onClick={submitClick} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminAuth;
