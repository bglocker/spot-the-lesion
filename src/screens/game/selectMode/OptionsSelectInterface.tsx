import React from "react";
import { Button, ButtonGroup, Typography } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    selectText: {
      fontSize: "3rem",
      fontWeight: "bold",
      textAlign: "center",
      [theme.breakpoints.only("xs")]: {
        fontSize: "150%",
      },
      [theme.breakpoints.only("sm")]: {
        fontSize: "1.5rem",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "3rem",
      },
    },
    buttonDesign: {
      margin: 8,
      borderRadius: 20,
      [theme.breakpoints.only("xs")]: {
        width: 300,
        height: 50,
        fontSize: "1rem",
      },
      [theme.breakpoints.only("sm")]: {
        width: 350,
        height: 58,
        fontSize: "1rem",
      },
      [theme.breakpoints.up("md")]: {
        width: 370,
        height: 61,
        fontSize: "1.25rem",
      },
    },
  })
);

const OptionsSelectInterface: React.FC<OptionsSelectInterface> = ({
  optionName,
  options,
}: OptionsSelectInterface) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Typography className={classes.selectText}>Choose a {optionName}</Typography>

      <ButtonGroup orientation="vertical">
        {options.map(([optionDefinition, optionFunction]) => (
          <Button
            key={optionDefinition}
            id={optionDefinition}
            className={classes.buttonDesign}
            variant="contained"
            color="primary"
            size="large"
            onClick={optionFunction}
          >
            {optionDefinition}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default OptionsSelectInterface;
