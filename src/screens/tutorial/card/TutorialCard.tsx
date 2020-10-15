import React from "react";
import { Grid } from "@material-ui/core";

const TutorialCard: React.FC<TutorialCardProps> = ({ textContent }: TutorialCardProps) => {
  return (
    <Grid container spacing={1}>
      {textContent}
      <Grid container item xs={12} spacing={3} />
      <Grid container item xs={12} spacing={3} />
      <Grid container item xs={12} spacing={3} />
    </Grid>
  );
};

export default TutorialCard;
