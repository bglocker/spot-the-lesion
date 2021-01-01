import React, { useRef, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@material-ui/core";
import { AssignmentTurnedInOutlined } from "@material-ui/icons";

const ChallengeDialog: React.FC<ChallengeDialogProps> = ({
  open,
  onClose,
  link,
}: ChallengeDialogProps) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipTitle, setTooltipTitle] = useState("Copy to clipboard");

  const inputRef = useRef<HTMLInputElement>(null);

  const selectInputText = () => {
    if (inputRef.current === null) {
      return;
    }

    inputRef.current.select();

    /* For mobile devices */
    inputRef.current.setSelectionRange(0, link.length);
  };

  const onCopyToClipboardClick = () => {
    selectInputText();

    document.execCommand("copy");

    setTooltipTitle("Copied!");
  };

  const onMouseEnterAdornment = () => {
    setTooltipTitle("Copy to clipboard");
    setTooltipOpen(true);
  };

  const onMouseLeaveAdornment = () => setTooltipOpen(false);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Challenge</DialogTitle>

      <DialogContent>
        <DialogContentText>Share this link to a friend to challenge them</DialogContentText>

        <TextField
          inputRef={inputRef}
          variant="outlined"
          fullWidth
          margin="dense"
          autoFocus
          type="url"
          label="Challenge link"
          value={link}
          onClick={selectInputText}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment
                position="end"
                onMouseEnter={onMouseEnterAdornment}
                onMouseLeave={onMouseLeaveAdornment}
              >
                <Tooltip open={tooltipOpen} title={tooltipTitle}>
                  <IconButton size="small" edge="end" onClick={onCopyToClipboardClick}>
                    <AssignmentTurnedInOutlined />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
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
