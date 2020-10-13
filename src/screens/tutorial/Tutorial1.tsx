import React, { useState } from "react";

const Tutorial1: React.FC<Tutorial1Props> = ({ setRoute }: Tutorial1Props) => {
  const [page, setPage] = useState<number>(1);

  return (
    <div>
      <p>Tutorial {page}</p>
      <button type="button" onClick={() => setRoute("home")}>
        Back
      </button>
      {page < 6? <button type="button" onClick={() => setPage(page + 1)}>
        Next
      </button> : ""}
    </div>
  );
};

export default Tutorial1;
