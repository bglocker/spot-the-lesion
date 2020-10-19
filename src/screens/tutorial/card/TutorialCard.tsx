import React from "react";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  image: {
    maxWidth: "inherit",
    maxHeight: "70vh",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
  textContent: {
    marginTop: "1%",
    fontSize: "calc((3vh + 3vw)/2)",
    textAlign: "center",
  },
  textWrapper: {
    width: "inherit",
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
    <Grid container direction="column" justify="center" alignItems="center" spacing={1}>
      <Grid item xs={12} spacing={3}>
        <div className={styles.textWrapper}>
          <Typography
            className={`${styles.textContent} ${styles.maxWidth} ${styles.centerContent}`}
          >
            {textContent}
          </Typography>
        </div>
      </Grid>
      {imageLink !== "" ? (
        <Grid item xs={9} spacing={3}>
          <img className={styles.image} src={imageLink} alt={imageLink} />
        </Grid>
      ) : (
        ""
      )}
    </Grid>
  );
};

export default TutorialCard;
