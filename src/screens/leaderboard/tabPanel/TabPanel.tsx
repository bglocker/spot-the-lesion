import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";

const TabPanel: React.FC<TabPanelProps> = ({ currentIndex, index, dbRef }: TabPanelProps) => {
  const [leaderboard, setLeaderboard] = useState<Score[]>([]);

  useEffect(() => {
    const getData = async () => {
      const doc = await dbRef.get();
      const scores: Score[] = [];
      doc.forEach((entry) => {
        const score: Score = {
          username: entry.get("username"),
          score: entry.get("score"),
        };
        scores.push(score);
      });
      setLeaderboard(scores);
    };

    if (currentIndex === index) {
      getData();
    }
  }, [dbRef, currentIndex, index]);

  console.log(leaderboard);

  return (
    <Grid
      role="tabpanel"
      hidden={currentIndex !== index}
      id={`leaderboard-view-${index}`}
      aria-labelledby={`leaderboard-${index}`}
    />
  );
};

export default TabPanel;
