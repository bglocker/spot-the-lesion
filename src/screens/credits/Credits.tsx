import React from "react";

const Credits: React.FC<CreditsProps> = ({ setRoute }: CreditsProps) => {
  return (
    <div>
      <p>Credits</p>
      <button type="button" onClick={() => setRoute("home")}>
        Back
      </button>
    </div>
  );
};

export default Credits;
