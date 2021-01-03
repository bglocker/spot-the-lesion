import React from "react";
import { Dialog, DialogTitle, IconButton, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  EmailIcon,
  EmailShareButton,
} from "react-share";

const useStyles = makeStyles((theme) =>
  createStyles({
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    container: {
      width: "100%",
      textAlign: "center",
    },
    shareButton: {
      margin: "10px",
    },
  })
);

const ShareScoreDialog: React.FC<ShareScoreDialogProps> = ({
  open,
  onClose,
  score,
}: ShareScoreDialogProps) => {
  const classes = useStyles();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        <Typography variant="h6">Share your score!</Typography>

        <IconButton className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <div className={classes.container}>
        <TwitterShareButton
          className={classes.shareButton}
          url="http://cb3618.pages.doc.ic.ac.uk/spot-the-lesion"
          title={`I got ${score} points in Spot-the-Lesion! Can you beat my score?`}
        >
          <TwitterIcon size="50px" round />
        </TwitterShareButton>

        <FacebookShareButton
          className={classes.shareButton}
          url="http://cb3618.pages.doc.ic.ac.uk/spot-the-lesion"
          quote={`I got ${score} points in Spot-the-Lesion! Can you beat my score?`}
        >
          <FacebookIcon size="50px" round />
        </FacebookShareButton>

        <LinkedinShareButton
          className={classes.shareButton}
          url="http://cb3618.pages.doc.ic.ac.uk/spot-the-lesion"
          title={`I got ${score} points in Spot-the-Lesion! Can you beat my score?`}
        >
          <LinkedinIcon size="50px" round />
        </LinkedinShareButton>

        <EmailShareButton
          className={classes.shareButton}
          url="http://cb3618.pages.doc.ic.ac.uk/spot-the-lesion"
          subject={`I got ${score} points in Spot-the-Lesion! Can you beat my score?`}
        >
          <EmailIcon size="50px" round />
        </EmailShareButton>
      </div>
    </Dialog>
  );
};

export default ShareScoreDialog;
