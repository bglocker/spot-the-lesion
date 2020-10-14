import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  logoStyle: {
    alignItems: "center",
    marginTop: "5vh",
    display: "flex",
    justifyContent: "center",
  },
  button: {
    background: "#07575B",
    borderRadius: 25,
    borderColor: "black",
    borderWidth: 10,
    color: "white",
    height: 100,
    width: 1000,
    fontSize: 36,
    fontFamily: "segoe UI",
    fontWeight: "bold",
    marginTop: "2vh",
  },
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  visible: {},
  invisible: {
    display: "none",
  },
});

export default useStyles;
