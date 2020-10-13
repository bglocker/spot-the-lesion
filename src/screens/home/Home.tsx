import React from "react";

const Home: React.FC<HomeProps> = ({ setRoute }: HomeProps) => {
  return (
    <div>
      <p>Home</p>
      <button type="button" onClick={() => setRoute("game")}>
        Play
      </button>
      <button type="button" onClick={() => setRoute("tutorial1")}>
        Tutorial
      </button>
      <button type="button" onClick={() => setRoute("about")}>
        About
      </button>
      <button type="button" onClick={() => setRoute("credits")}>
        Credits
      </button>
    </div>
  );
};

export default Home;
