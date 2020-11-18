interface ImageStatsDialogProps {
  open: boolean;
  data: { id: string; label: string; value: number; color: string }[];
  onClose: () => void;
}
