import React, { useState } from "react";
import {
  AppBar,
  Card,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  Theme,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { getLibraries } from "../../utils/creditsUtils";
import { NavigationAppBar, TabPanel } from "../../components";

const useStyles = makeStyles((theme) =>
  createStyles({
    appBar: {
      backgroundColor: "#004445",
    },
    tabIndicator: {
      backgroundColor: "#C4DFE6",
    },
    tab: {
      fontSize: "1rem",
    },
    container: {
      flex: 1,
      height: 0,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    card: {
      height: "80%",
      width: "80%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly",
      padding: 8,
    },
    text: {
      textAlign: "center",
      [theme.breakpoints.only("xs")]: {
        fontSize: "1rem",
      },
      [theme.breakpoints.only("sm")]: {
        fontSize: "1.25rem",
      },
      [theme.breakpoints.only("md")]: {
        fontSize: "1.5rem",
      },
      [theme.breakpoints.up("lg")]: {
        fontSize: "2rem",
      },
    },
    list: {
      flex: 1,
      height: 0,
      overflow: "auto",
    },
  })
);

const Credits: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const smallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down("xs"));

  const classes = useStyles();

  const onTabChange = (_event, newValue: number) => setTabIndex(newValue);

  return (
    <>
      <NavigationAppBar showBack />

      <AppBar className={classes.appBar} position="sticky">
        <Tabs
          classes={{ indicator: classes.tabIndicator }}
          variant={smallScreen ? "fullWidth" : "standard"}
          centered
          aria-label="Credits pages"
          value={tabIndex}
          onChange={onTabChange}
        >
          <Tab className={classes.tab} label="About The Game" />

          <Tab className={classes.tab} label="Libraries & Images" />
        </Tabs>
      </AppBar>

      <div className={classes.container}>
        <TabPanel value={tabIndex} index={0}>
          <Card className={classes.card}>
            <Typography className={classes.text}>
              The AI for this game is based on the{" "}
              <a href="https://arxiv.org/abs/1906.02283" target="blank">
                MICCAI 2019 paper
              </a>
            </Typography>

            <Typography className={classes.text}>
              CT Scan AI developed by Martin Zlocha, Qi Dou and Ben Glocker.
            </Typography>

            <Typography className={classes.text}>
              This site was made with React for the 3rd year Software Engineering Group Project by:
              Andrei-Matei Roman, Andrei-Ovidiu Badea, Calin-Andrei Alexandru, Calin Biberea,
              Cosmin-Ionut Baies, Tiberiu-Andrei Georgescu
            </Typography>

            <Typography className={classes.text}>
              (c) 2019 Data obtained from the{" "}
              <a
                href="https://www.nih.gov/news-events/news-releases/nih-clinical-center-releases-dataset-32000-ct-images"
                target="blank"
              >
                NIH Clinical Center
              </a>
            </Typography>
          </Card>
        </TabPanel>

        <TabPanel value={tabIndex} index={1}>
          <Card className={classes.card}>
            <Typography className={classes.text}>
              Here is a list of libraries and images used, kudos to the creators for enabling us to
              work effectively.
            </Typography>

            <Typography className={classes.text}>
              You can find a link to the authors and the licenses for the images by following{" "}
              <a href="https://drive.google.com/file/d/1zAs8cqA91jkWzLExid3EvleiB8e1yIuu/view?usp=sharing">
                this link
              </a>
              .
            </Typography>

            <Typography className={classes.text}>
              Here are the libraries that this game uses:
            </Typography>

            <List className={classes.list}>
              {getLibraries().map(({ name, version }) => (
                <ListItem key={name}>
                  <ListItemText primary={name} secondary={version} />
                </ListItem>
              ))}
            </List>
          </Card>
        </TabPanel>
      </div>
    </>
  );
};

export default Credits;
