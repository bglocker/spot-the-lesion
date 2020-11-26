import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { NavigationAppBar } from "../../components";

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      height: "100%",
    },
  })
);

const About: React.FC = () => {
  const classes = useStyles();

  return (
    <>
      <NavigationAppBar showBack />

      <div className={classes.container} />
    </>
  );
};

export default About;
