import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "30vw",
    maxHeight: "30vh%",
  },
  textContent: {
    fontSize: "calc((3vw + 3vh)/2)",
  },
}));

const TutorialCard: React.FC<TutorialCardProps> = ({
  textContent,
  imageLink,
}: TutorialCardProps) => {
  const styles = useStyles();
  return (
    <Grid container spacing={1}>
      <Typography className={styles.textContent}>{textContent}</Typography>
      <img src={imageLink} alt={imageLink} />
      <Grid container item xs={12} spacing={3} />
      <Grid container item xs={12} spacing={3} />
      <Grid container item xs={12} spacing={3} />
    </Grid>
  );
};

export default TutorialCard;
