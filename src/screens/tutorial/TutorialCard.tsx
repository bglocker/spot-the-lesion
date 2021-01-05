import React, { ReactNode } from "react";
import { Card, Typography } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import clsx from "clsx";

interface TutorialCardProps {
  tutorialItem: TutorialItem;
  className?: string;
  children?: ReactNode;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      boxSizing: "border-box",
      padding: 24,
    },
    textContainer: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
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
    },
    imageContainer: {
      flex: 3,
      height: "0%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      maxWidth: "100%",
      maxHeight: "100%",
    },
  })
);

const TutorialCard = React.forwardRef<JSX.Element, TutorialCardProps>(
  ({ children, className, tutorialItem: { text, imageSrc } }, ref) => {
    const classes = useStyles();

    return (
      <Card className={clsx(classes.container, className)} ref={ref}>
        <div className={classes.textContainer}>
          <Typography className={classes.text}>{text}</Typography>
        </div>

        <div
          className={classes.imageContainer}
          style={{ display: imageSrc === undefined ? "none" : "" }}
        >
          <img className={classes.image} src={imageSrc} alt="Tutorial card" />
        </div>

        {children}
      </Card>
    );
  }
);

TutorialCard.displayName = "TutorialCard";

export default TutorialCard;
