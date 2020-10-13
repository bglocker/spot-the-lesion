import React from "react";

const About: React.FC<AboutProps> = ({ setRoute }: AboutProps) => {
  return (
    <div>
      <p>About</p>
      <button type="button" onClick={() => setRoute("home")}>
        Back
      </button>
    </div>
  );
};

export default About;
