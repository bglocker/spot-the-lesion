import React, { useState } from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import axios from "axios";
import colors from "../../../res/colors";

const useStyles = makeStyles((theme) =>
  createStyles({
    backButton: {
      marginRight: 8,
    },
    container: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.secondary,
    },
    box: {
      backgroundColor: "white",
      width: "60%",
      height: "60%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
      boxSizing: "border-box",
    },
    text: {
      [theme.breakpoints.only("xs")]: {
        fontSize: "1.25rem",
      },
      [theme.breakpoints.only("sm")]: {
        fontSize: "1.5rem",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "2rem",
      },
      textAlign: "center",
      marginBottom: 24,
    },
    submit: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    spacing: {
      margin: 10,
    },
  })
);

const FileUpload: React.FC = () => {
  const classes = useStyles();

  const [currentImagesForUpload, setCurrentImagesForUpload] = useState([]);
  const [currentJsonsForUpload, setCurrentJsonsForUpload] = useState([]);

  const axiosConfig = {
    headers: { "content-type": "multipart/form-data" },
  };

  const prepareCurrentImagesForUpload = (event) => {
    setCurrentImagesForUpload(event.currentTarget.files);
  };

  const prepareCurrentJsonsForUpload = (event) => {
    setCurrentJsonsForUpload(event.currentTarget.files);
  };

  const submitClick = () => {
    if (currentImagesForUpload == null || !currentJsonsForUpload == null) {
      // eslint-disable-next-line no-console
      console.log("No files to upload for images or jsons, aborting.");
    }

    for (let index = 0; index < currentImagesForUpload.length; index++) {
      // eslint-disable-next-line no-console
      console.log(currentImagesForUpload[index]);
    }

    const formData = new FormData();
    // eslint-disable-next-line no-console
    console.log(formData);
    formData.append("scan", currentImagesForUpload[0]);

    axios
      .post("https://spot-the-lesion.herokuapp.com/post/", formData, axiosConfig)
      // eslint-disable-next-line no-console
      .then((response) => console.log(response))
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error.response.data);
      });
  };

  return (
    <>
      <AppBar position="absolute">
        <Toolbar variant="dense">
          <Typography>Spot the Lesion</Typography>
        </Toolbar>
      </AppBar>

      <div className={classes.container}>
        <div className={classes.box}>
          <Typography className={classes.text}>
            Please select the images and jsons to upload (just select all of them at once).
          </Typography>
          <div className={classes.submit}>
            <input
              type="file"
              multiple
              onChange={(event) => prepareCurrentImagesForUpload(event)}
            />
            <input type="file" multiple onChange={(event) => prepareCurrentJsonsForUpload(event)} />
            <input className={classes.spacing} type="submit" value="Submit" onClick={submitClick} />
          </div>
        </div>
      </div>
    </>
  );
};

export default FileUpload;
