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

const errorText = "Username cannot be empty";

const SubmitScoreDialog: React.FC<SubmitScoreDialogProps> = ({
  open,
  onClose,
  onSubmit,
}: SubmitScoreDialogProps) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState(false);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setUsername(event.target.value);
  };

  const onClick = () => {
    if (username === "") {
      setError(true);
    } else {
      onSubmit(username);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Submit scores</DialogTitle>

      <DialogContent>
        <DialogContentText>To submit your score, please enter an username</DialogContentText>

        <TextField
          autoFocus
          margin="dense"
          label="Username"
          required
          type="text"
          fullWidth
          error={error}
          helperText={error ? errorText : ""}
          value={username}
          onChange={onChange}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClick}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubmitScoreDialog;
