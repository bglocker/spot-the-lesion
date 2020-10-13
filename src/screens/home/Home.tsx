import React from "react";

const Home: React.FC<HomeProps> = ({ setRoute }: HomeProps) => {
  return (
    <div>
      <p>Home</p>
      <button type="button" onClick={() => setRoute("home")}>
        Back
      </button>
    </div>
  );
};

export default Home;
