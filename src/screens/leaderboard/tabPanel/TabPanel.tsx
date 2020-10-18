import React from "react";
import { Grid, Typography } from "@material-ui/core";

const TabPanel: React.FC<TabPanelProps> = ({ currentIndex, index }: TabPanelProps) => {
  return (
    <Grid
      role="tabpanel"
      hidden={currentIndex !== index}
      id={`leaderboard-view-${index}`}
      aria-labelledby={`leaderboard-${index}`}
    >
      <Typography>{index}</Typography>
    </Grid>
  );
};

export default TabPanel;
