import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Container } from "@material-ui/core";
import logo from "./logo.png";

const useStyles = makeStyles({
  root: {
    background: "#0063B2FF",
    borderRadius: 50,
    color: "white",
    height: 100,
    width: 1000,
    fontSize: 36,
    fontFamily: "segoe UI",
    fontWeight: "bold",
  },
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});

const Home: React.FC<HomeProps> = ({ setRoute }: HomeProps) => {
  const styles = useStyles();
  return (
    <div
      style={{
        backgroundColor: "#9CC3D5FF",
      }}
    >
      <Container className={styles.container}>
        <p>
          <div>
            <img width="700" height="750" src={logo} alt="this is a logo" />
          </div>
        </p>
        <br />
        <br />
        <br />
        <Button className={styles.root} onClick={() => setRoute("game")}>
          Play
        </Button>
        <br />
        <div>
          <Button className={styles.root} onClick={() => setRoute("tutorial1")}>
            How to Play
          </Button>
        </div>
        <br />
        <div>
          <Button className={styles.root} onClick={() => setRoute("about")}>
            About CT Scans
          </Button>
        </div>
        <br />
        <div>
          <Button className={styles.root} onClick={() => setRoute("credits")}>
            Credits
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default Home;
