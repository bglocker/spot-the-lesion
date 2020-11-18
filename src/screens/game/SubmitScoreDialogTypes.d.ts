interface SubmitScoreDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (string) => Promise<void>;
}
