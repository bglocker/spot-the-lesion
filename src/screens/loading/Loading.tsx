import React from "react";
import { CircularProgress } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
  })
);

const Loading: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <CircularProgress color="primary" size={128} />
    </div>
  );
};

export default Loading;
