import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      height: (props: Record<string, unknown>) => (props.imageLink !== "" ? "100%" : "50%"),
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
      boxSizing: "border-box",
    },
    text: {
      fontSize: "2rem",
      textAlign: "center",
      marginBottom: 24,
    },
    image: {
      display: (props: Record<string, unknown>) =>
        props.imageLink !== "" ? "inline-block" : "none",
      maxWidth: "75%",
      maxHeight: "75%",
    },
  })
);

const TutorialCard: React.FC<TutorialCardProps> = ({
  textContent,
  imageLink,
}: TutorialCardProps) => {
  const classes = useStyles({ imageLink });

  return (
    <div className={classes.container}>
      <Typography className={classes.text}>{textContent}</Typography>

      <img className={classes.image} src={imageLink} alt={imageLink} />
    </div>
  );
};

export default TutorialCard;
