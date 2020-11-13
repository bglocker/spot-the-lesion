import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@material-ui/core";

const SubmitScoreDialog: React.FC<SubmitScoreDialogProps> = ({
  open,
  onClose,
  onSubmit,
}: SubmitScoreDialogProps) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState(false);

  const onCloseDialog = () => {
    setUsername("");
    setError(false);

    onClose();
  };

  const onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setUsername(event.target.value);
  };

  const onSubmitClick = () => {
    if (username !== "") {
      onSubmit(username);
    } else {
      setError(true);
    }
  };

  return (
    <Dialog open={open} onClose={onCloseDialog}>
      <DialogTitle>Submit</DialogTitle>

      <DialogContent>
        <DialogContentText>
          To submit your score, please enter your username here.
        </DialogContentText>

        <TextField
          autoFocus
          margin="dense"
          label="Username"
          required
          type="text"
          fullWidth
          error={error}
          helperText={error ? "Username cannot be empty" : ""}
          value={username}
          onChange={onUsernameChange}
        />
      </DialogContent>

      <DialogActions>
        <Button color="primary" onClick={onCloseDialog}>
          Cancel
        </Button>

        <Button color="primary" onClick={onSubmitClick}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubmitScoreDialog;
