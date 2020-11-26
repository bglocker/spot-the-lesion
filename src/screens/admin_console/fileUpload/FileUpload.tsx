import React, { useState } from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import TextField from "@material-ui/core/TextField";
import StringBuilder from "string-builder";
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
      height: "80%",
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
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      margin: 24,
    },
    uploadButton: {
      margin: theme.spacing(5),
    },
    uploadSection: {
      display: "flex",
      flexDirection: "row",
    },
    submitButton: {
      margin: theme.spacing(10),
      borderRadius: 20,
      [theme.breakpoints.only("xs")]: {
        width: 250,
        fontSize: "1rem",
      },
      [theme.breakpoints.only("sm")]: {
        width: 300,
        fontSize: "1rem",
      },
      [theme.breakpoints.up("md")]: {
        width: 320,
        fontSize: "1.25rem",
      },
    },
    successMessage: {
      color: "green",
    },
    errorMessage: {
      color: "red",
    },
    displayColumn: {
      display: "flex",
      flexDirection: "column",
    },
  })
);

const FileUpload: React.FC = () => {
  const classes = useStyles();

  const [currentImagesForUpload, setCurrentImagesForUpload] = useState([]);
  const [currentJsonsForUpload, setCurrentJsonsForUpload] = useState([]);

  const [selectedImageFileNames, setSelectedImageFileNames] = useState("No file selected");
  const [selectedJSONFileNames, setSelectedJSONFileNames] = useState("No file selected");

  const axiosConfig = {
    headers: { "content-type": "multipart/form-data" },
  };

  const prepareCurrentImagesForUpload = (event) => {
    setCurrentImagesForUpload(event.currentTarget.files);
    setSelectedImageFileNames(getFileNames(event.currentTarget.files));
  };

  const prepareCurrentJsonsForUpload = (event) => {
    setCurrentJsonsForUpload(event.currentTarget.files);
    setSelectedJSONFileNames(getFileNames(event.currentTarget.files));
  };

  const getFileNames = (files): string => {
    const sb = new StringBuilder();
    for (const file of files) {
      sb.append(file.name).append("; ");
    }
    return sb.toString();
  };

  const submitClick = () => {
    if (currentImagesForUpload == null || !currentJsonsForUpload == null) {
      // eslint-disable-next-line no-console
      console.log("No files to upload for images or jsons, aborting.");
    }

    for (let index = 0; index < currentImagesForUpload.length; index++) {
      /**
       * Send POST Request with one image data to server
       */
      const imagesFormData = new FormData();
      // eslint-disable-next-line no-console
      console.log(imagesFormData);
      imagesFormData.append("scan", currentImagesForUpload[index]);
      imagesFormData.append("json", currentJsonsForUpload[index]);
      axios
        .post("https://spot-the-lesion.herokuapp.com/post/", imagesFormData, axiosConfig)
        .then((response) => {
          // eslint-disable-next-line no-console
          console.log(response);
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error.response.data);
        });
    }
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
          <Typography className={classes.text}>Image upload panel</Typography>
          <div className={classes.submit}>
            <div className={classes.uploadSection}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                className={classes.uploadButton}
                startIcon={<CloudUploadIcon />}
                component="label"
              >
                Upload Image
                <input
                  accept="image/*"
                  type="file"
                  hidden
                  multiple
                  onChange={(event) => prepareCurrentImagesForUpload(event)}
                />
              </Button>
              <TextField className={classes.uploadButton} value={selectedImageFileNames} />
            </div>
            <div className={classes.uploadSection}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                className={classes.uploadButton}
                startIcon={<CloudUploadIcon />}
                component="label"
              >
                Upload JSON
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={(event) => prepareCurrentJsonsForUpload(event)}
                />
              </Button>
              <TextField className={classes.uploadButton} value={selectedJSONFileNames} />
            </div>
            <Button
              variant="contained"
              color="primary"
              size="large"
              className={classes.submitButton}
              component="span"
              onClick={submitClick}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileUpload;
