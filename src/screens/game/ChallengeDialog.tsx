import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

const ChallengeDialog: React.FC<ChallengeDialogProps> = ({
  open,
  onClose,
  link,
}: ChallengeDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Challenge</DialogTitle>

      <DialogContent>
        <DialogContentText>{link}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button color="primary" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChallengeDialog;
