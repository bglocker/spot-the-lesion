import React from "react";
import { Button, ButtonProps } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import clsx from "clsx";

interface ToggleButtonProps extends ButtonProps {
  value: string;
  onToggle?: (event: React.MouseEvent<HTMLButtonElement>, value: string) => void;
  selected?: boolean;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      color: fade(theme.palette.action.active, 0.38),
    },
    selected: {
      backgroundColor: fade(theme.palette.action.active, 0.12),
      "&:hover": {
        backgroundColor: fade(theme.palette.action.active, 0.15),
      },
    },
  })
);

const ToggleButton: React.FC<ToggleButtonProps> = ({
  children,
  className,
  value,
  onClick,
  onToggle,
  selected,
  ...other
}: ToggleButtonProps) => {
  const classes = useStyles();

  const onButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(event);
    }

    if (onToggle) {
      onToggle(event, value);
    }
  };

  return (
    <Button
      className={clsx(
        {
          [classes.selected]: selected,
        },
        className
      )}
      onClick={onButtonClick}
      // Props are properly destructured and passed
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...other}
    >
      {children}
    </Button>
  );
};

export default ToggleButton;
