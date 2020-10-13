import React from "react";

const Tutorial1: React.FC<Tutorial1Props> = ({ setRoute }: Tutorial1Props) => {
  return (
    <div>
      <p>Tutorial 1</p>
      <button type="button" onClick={() => setRoute("home")}>
        Back
      </button>
    </div>
  );
};

export default Tutorial1;
