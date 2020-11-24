import React, { useState } from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import Settings from "./Settings";
import colors from "../../res/colors";
import { firebaseAuth } from "../../firebase/firebaseApp";

const useStyles = makeStyles((theme) =>
  createStyles({
    backButton: {
      marginRight: 8,
    },
    container: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.secondary,
    },
    box: {
      backgroundColor: "white",
      width: "60%",
      height: "60%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
      boxSizing: "border-box",
    },
    text: {
      [theme.breakpoints.only("xs")]: {
        fontSize: "1.25rem",
      },
      [theme.breakpoints.only("sm")]: {
        fontSize: "1.5rem",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "2rem",
      },
      textAlign: "center",
      marginBottom: 24,
    },
    submit: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    spacing: {
      margin: 50,
    },
    button: {
      margin: 24,
      borderRadius: 20,
      [theme.breakpoints.only("xs")]: {
        width: 250,
        fontSize: "1rem",
      },
      [theme.breakpoints.only("sm")]: {
        width: 300,
        fontSize: "1rem",
      },
      [theme.breakpoints.up("md")]: {
        width: 320,
        fontSize: "1.25rem",
      },
    },
    password: {
      margin: theme.spacing(1),
    },
    textField: {
      width: "25ch",
    },
  })
);

const AdminAuth: React.FC = () => {
  const classes = useStyles();

  const [wasLogged, setWasLogged] = useState<boolean>(false);

  const [password, setPassword] = React.useState<PasswordType>({
    value: "",
    showPassword: false,
  });

  const handleChange = (prop: keyof PasswordType) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPassword({ ...password, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setPassword({ ...password, showPassword: !password.showPassword });
  };

  if (wasLogged) {
    return <Settings />;
  }

  const submitClick = () => {
    firebaseAuth
      .signInWithEmailAndPassword("spot-the-lesion@gmail.com", password.value)
      .then(() => {
        // eslint-disable-next-line no-console
        console.log("Managed to log in");

        setWasLogged(true);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
  };

  return (
    <>
      <AppBar position="absolute">
        <Toolbar variant="dense">
          <Typography>Spot the Lesion</Typography>
        </Toolbar>
      </AppBar>

      <div className={classes.container}>
        <div className={classes.box}>
          <Typography className={classes.text}> Enter Password </Typography>
          <div className={[classes.submit, classes.spacing].join(" ")}>
            <FormControl
              className={[
                classes.submit,
                classes.spacing,
                classes.password,
                classes.textField,
              ].join(" ")}
            >
              <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
              <Input
                id="standard-adornment-password"
                type={password.showPassword ? "text" : "password"}
                value={password.value}
                onChange={handleChange("value")}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                    >
                      {password.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              size="large"
              onClick={submitClick}
            >
              Log In
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminAuth;
