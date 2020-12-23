import React, { useState } from "react";
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from "react-share";
import { Button, Dialog } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
  createStyles({
    closeButton: {
      width: "60px",
      float: "right",
    },
    background: {
      width: "100%",
      textAlign: "center",
    },
    shareButton: {
      margin: "10px",
    },
  })
);

const ShareMenu: React.FC<ShareMenuProps> = ({ playerScore }: ShareMenuProps) => {
  const classes = useStyles();

  const [open, setOpen] = useState<boolean>(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button variant="contained" color="primary" size="large" onClick={handleClickOpen}>
        Share
      </Button>
      <Dialog open={open} fullWidth maxWidth="xs">
        <div>
          <Button className={classes.closeButton} onClick={handleClose}>
            X
          </Button>
        </div>
        <div className={classes.background}>
          <TwitterShareButton
            className={classes.shareButton}
            url="http://cb3618.pages.doc.ic.ac.uk/spot-the-lesion"
            title={`I got ${playerScore.total} points in Spot-the-Lesion! Can you beat my score?`}
          >
            <TwitterIcon size="50px" round />
          </TwitterShareButton>
          <FacebookShareButton
            className={classes.shareButton}
            url="http://cb3618.pages.doc.ic.ac.uk/spot-the-lesion"
            title={`I got ${playerScore.total} points in Spot-the-Lesion! Can you beat my score?`}
          >
            <FacebookIcon size="50px" round />
          </FacebookShareButton>
        </div>
      </Dialog>
    </>
  );
};

export default ShareMenu;
