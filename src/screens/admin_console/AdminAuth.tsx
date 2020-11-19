import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { firebaseAuth } from "../../firebase/firebaseApp";

const useStyles = makeStyles(() =>
  createStyles({
    backButton: {
      marginRight: 8,
    },
    container: {
      height: "100%",
    },
  })
);

const AdminAuth: React.FC = () => {
  const classes = useStyles();

  firebaseAuth
    .signInWithEmailAndPassword("spot-the-lesion@gmail.com", "spot2020")
    .then(() => {
      // eslint-disable-next-line no-console
      console.log("Managed to log in");
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error);
    });

  return (
    <>
      <AppBar position="sticky">
        <Toolbar variant="dense">
          <Typography>Spot the Lesion</Typography>
        </Toolbar>
      </AppBar>

      <div className={classes.container} />
    </>
  );
};

export default AdminAuth;
