interface ImageStatsDialogProps {
  open: boolean;
  onClose: () => void;
  data: { id: string; label: string; value: number; color: string }[];
}
