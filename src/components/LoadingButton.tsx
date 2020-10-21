import React from "react";
import { Button, CircularProgress } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";

interface LoadingButtonProps {
  loading: boolean;
  buttonDisabled: boolean;
  onButtonClick: () => void;
  buttonText: string;
}

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      position: "relative",
      marginTop: 16,
      marginBottom: 16,
    },
    circularProgress: {
      display: ({ loading }: Record<string, boolean>) => (loading ? "block" : "none"),
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12,
    },
  })
);

const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  buttonDisabled,
  onButtonClick,
  buttonText,
}: LoadingButtonProps) => {
  const classes = useStyles({ loading });

  return (
    <div className={classes.container}>
      <Button
        variant="contained"
        color="primary"
        size="large"
        disabled={buttonDisabled}
        onClick={onButtonClick}
      >
        {buttonText}
      </Button>

      <CircularProgress className={classes.circularProgress} color="primary" size={24} />
    </div>
  );
};

export default LoadingButton;
