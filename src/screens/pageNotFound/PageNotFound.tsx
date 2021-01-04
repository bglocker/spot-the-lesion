import React from "react";
import { Button, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import notFound from "../../res/images/pageNotFound/notFound.gif";

const useStyles = makeStyles((theme) =>
  createStyles({
    returnButton: {
      borderRadius: 20,
      [theme.breakpoints.only("xs")]: {
        width: 300,
        height: 50,
        fontSize: "1rem",
      },
      [theme.breakpoints.only("sm")]: {
        width: 350,
        height: 58,
        fontSize: "1rem",
      },
      [theme.breakpoints.up("md")]: {
        width: 370,
        height: 61,
        fontSize: "1.25rem",
      },
    },
    container: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    pageNotFoundText: {
      fontSize: "3rem",
      fontWeight: "bold",
      [theme.breakpoints.only("xs")]: {
        fontSize: "150%",
      },
      [theme.breakpoints.only("sm")]: {
        fontSize: "1.5rem",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "3rem",
      },
    },
    gif: {
      marginTop: 16,
      marginBottom: 24,
      [theme.breakpoints.down("xs")]: {
        height: 200,
      },
      [theme.breakpoints.up("sm")]: {
        height: 300,
      },
    },
  })
);

const PageNotFound: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

  const onReturnClick = () => history.push("/");

  return (
    <div className={classes.container}>
      <img className={classes.gif} src={notFound} alt="404 Not Found Meme" />
      <Typography className={classes.pageNotFoundText}>404 - Page Not Found</Typography>
      <Button
        className={classes.returnButton}
        variant="contained"
        color="primary"
        size="large"
        onClick={onReturnClick}
      >
        Go To Main Menu
      </Button>
    </div>
  );
};

export default PageNotFound;
