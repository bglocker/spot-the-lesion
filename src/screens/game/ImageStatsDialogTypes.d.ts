interface ImageStatsDialogProps {
  open: boolean;
  fileNumber: number;
  data: { id: string; label: string; value: number; color: string }[];
  onClose: () => void;
}
