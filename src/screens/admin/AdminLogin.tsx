import React, { useContext, useState } from "react";
import { Button, Card, IconButton, InputAdornment, TextField, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import firebase from "firebase/app";
import AdminAuthContext from "./AdminAuthContext";
import { NavigationAppBar } from "../../components";

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    card: {
      width: "60%",
      height: "60%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    text: {
      marginBottom: 24,
      textAlign: "center",
      [theme.breakpoints.only("xs")]: {
        fontSize: "1.25rem",
      },
      [theme.breakpoints.only("sm")]: {
        fontSize: "1.5rem",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "2rem",
      },
    },
    formContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    button: {
      width: "100%",
      marginTop: 24,
      borderRadius: 20,
      [theme.breakpoints.only("xs")]: {
        fontSize: "1rem",
      },
      [theme.breakpoints.only("sm")]: {
        fontSize: "1rem",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "1.25rem",
      },
    },
  })
);

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);

  const { adminLogIn } = useContext(AdminAuthContext);

  const classes = useStyles();

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowError(false);
    setPassword(event.target.value);
  };

  const onPasswordKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSubmitClick().then(() => {});
    }
  };

  const onShowPasswordClick = () => setShowPassword((prevState) => !prevState);

  const onShowPasswordMouseDown = (event: React.MouseEvent<HTMLButtonElement>) =>
    event.preventDefault();

  const onSubmitClick = () =>
    firebase
      .auth()
      .signInWithEmailAndPassword("spot-the-lesion@gmail.com", password)
      .then(() => adminLogIn())
      .catch((_error) => setShowError(true));

  return (
    <>
      <NavigationAppBar showBack />

      <div className={classes.container}>
        <Card className={classes.card}>
          <Typography className={classes.text}>Admin Screen</Typography>

          <div className={classes.formContainer}>
            <TextField
              autoFocus
              variant="outlined"
              label="Password"
              required
              type={showPassword ? "text" : "password"}
              error={showError}
              helperText={showError ? "Incorrect password" : ""}
              value={password}
              onChange={onPasswordChange}
              InputProps={{
                onKeyDown: onPasswordKeyDown,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={onShowPasswordClick}
                      onMouseDown={onShowPasswordMouseDown}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              size="large"
              onClick={onSubmitClick}
            >
              Log In
            </Button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default AdminLogin;
