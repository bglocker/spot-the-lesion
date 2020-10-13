import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Container } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    border: 0,
    borderRadius: 3,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: "white",
    height: 50,
    padding: "0 30px",
    width: 100,
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
      <p>Home</p>
      <Button className={styles.root} onClick={() => setRoute("game")}>
        Play
      </Button>
      <div>
        <Button className={styles.root} onClick={() => setRoute("tutorial1")}>
          Tutorial
        </Button>
      </div>
      <div>
        <Button className={styles.root} onClick={() => setRoute("about")}>
          About
        </Button>
      </div>
      <div>
        <Button className={styles.root} onClick={() => setRoute("credits")}>
          Credits
        </Button>
      </div>
    </Container>
  );
};

export default Home;
