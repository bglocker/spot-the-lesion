import React, { ReactNode } from "react";
import { Button, ButtonProps, CircularProgress } from "@material-ui/core";

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
  children: ReactNode;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  loading,
  disabled,
  ...other
}: LoadingButtonProps) => {
  return (
    // Props are properly destructured and passed
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Button disabled={disabled || loading} {...other}>
      {loading ? <CircularProgress color="primary" size={24} /> : children}
    </Button>
  );
};

export default LoadingButton;
