import React from "react";
import { ButtonGroup, ButtonGroupProps } from "@material-ui/core";

interface ToggleButtonGroupProps<T> extends ButtonGroupProps {
  exclusive?: boolean;
  value: T[];
  onToggle?: (event: React.MouseEvent<HTMLButtonElement>, newValue: T[]) => void;
}

const isValueSelected = <T extends string>(value: T, selectedValues: T[]) =>
  selectedValues.indexOf(value) >= 0;

const ToggleButtonGroup = <T extends string>({
  children,
  exclusive = false,
  value,
  onToggle,
  size = "medium",
  ...other
}: ToggleButtonGroupProps<T>): JSX.Element => {
  const handleToggle = (event: React.MouseEvent<HTMLButtonElement>, buttonValue: T) => {
    if (!onToggle) {
      return;
    }

    const ix = value.indexOf(buttonValue);
    const newValue = value.slice();

    if (ix >= 0) {
      newValue.splice(ix, 1);
    } else {
      newValue.push(buttonValue);
    }

    onToggle(event, newValue);
  };

  const handleExclusiveToggle = (event: React.MouseEvent<HTMLButtonElement>, buttonValue: T) => {
    if (!onToggle) {
      return;
    }

    const ix = value.indexOf(buttonValue);
    const newValue: T[] = [];

    if (ix < 0) {
      newValue.push(buttonValue);
    }

    onToggle(event, newValue);
  };

  return (
    // Props are properly destructured and passed
    // eslint-disable-next-line react/jsx-props-no-spreading
    <ButtonGroup {...other}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
          return null;
        }

        return React.cloneElement(child, {
          onToggle: exclusive ? handleExclusiveToggle : handleToggle,
          selected: child.props.selected || isValueSelected(child.props.value, value),
          size: child.props.size || size,
        });
      })}
    </ButtonGroup>
  );
};

export default ToggleButtonGroup;
