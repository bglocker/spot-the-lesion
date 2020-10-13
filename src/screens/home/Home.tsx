import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Container } from "@material-ui/core";
import logo from "./doctor2.png";

const useStyles = makeStyles({
  root: {
    background: "linear-gradient(315deg, #045de9 0%, #09c6f9 74%)",
    border: 1,
    borderRadius: 50,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: "white",
    height: 80,
    padding: "0 30px",
    width: 650,
    fontSize: 36,
    fontFamily: "roboto",
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
    <Container className={styles.container}>
      <p>
        <div>
          <img src={logo} alt="this is a logo" />
        </div>
      </p>
      <Button className={styles.root} onClick={() => setRoute("game")}>
        Play
      </Button>
      <br />
      <div>
        <Button className={styles.root} onClick={() => setRoute("tutorial1")}>
          Tutorial
        </Button>
      </div>
      <br />
      <div>
        <Button className={styles.root} onClick={() => setRoute("about")}>
          About
        </Button>
      </div>
      <br />
      <div>
        <Button className={styles.root} onClick={() => setRoute("credits")}>
          Credits
        </Button>
      </div>
    </Container>
  );
};

export default Home;
