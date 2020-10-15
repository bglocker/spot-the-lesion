import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  image: {
    margin: "3%",
    maxWidth: "50%",
    maxHeight: "40%",
  },
  textContent: {
    margin: "5%",
    fontSize: "calc((3vh + 3vw)/2)",
    textAlign: "center",
  },
  maxWidth: {
    width: "100%",
  },
  centerContent: {
    display: "flex",
    justifyContent: "center",
  },
}));

const TutorialCard: React.FC<TutorialCardProps> = ({
  textContent,
  imageLink,
}: TutorialCardProps) => {
  const styles = useStyles();
  return (
    <Grid container spacing={1}>
      <Grid container item xs={12} spacing={3}>
        <Typography className={`${styles.textContent} ${styles.maxWidth} ${styles.centerContent}`}>
          {textContent}
        </Typography>
      </Grid>
      {imageLink[0] !== "" ? (
        <Grid container item xs={12} spacing={3}>
          <div className={`${styles.maxWidth} ${styles.centerContent}`}>
            <img
              className={`${styles.image} ${styles.centerContent}`}
              src={imageLink[0]}
              alt={imageLink[0]}
            />
            {imageLink[1] !== "" ? (
              <img
                className={`${styles.image} ${styles.centerContent}`}
                src={imageLink[1]}
                alt={imageLink[1]}
              />
            ) : (
              ""
            )}
          </div>
        </Grid>
      ) : (
        ""
      )}
    </Grid>
  );
};

export default TutorialCard;
