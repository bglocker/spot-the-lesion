import React, { useState } from "react";
import { AppBar, Toolbar, Typography, useMediaQuery } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import TextField from "@material-ui/core/TextField";
import { useSnackbar } from "notistack";
import StringBuilder from "string-builder";
import colors from "../../../res/colors";
import constants from "../../../res/constants";

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
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
    },
    desktopBox: {
      height: "80%",
      padding: 24,
    },
    mobileBox: {
      height: "95%",
      padding: 16,
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
    },
    submit: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      margin: 24,
    },
    desktopUploadButton: {
      margin: theme.spacing(5),
    },
    mobileUploadButton: {
      marginTop: "5%",
      marginBottom: "5%",
      width: "80%",
      alignSelf: "center",
      alignItems: "center",
    },
    uploadSectionContainer: {
      marginBottom: "5%",
      marginTop: "35%",
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
      align: "center",
    },
    desktopUploadSection: {
      display: "flex",
      flexDirection: "row",
    },
    mobileUploadSection: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      marginTop: "25%",
    },
    submitButton: {
      marginTop: "10%",
      marginBottom: "35%",
      borderRadius: 20,
      [theme.breakpoints.only("xs")]: {
        width: "70%",
        fontSize: "1rem",
      },
      [theme.breakpoints.only("sm")]: {
        width: "75%",
        fontSize: "1rem",
      },
      [theme.breakpoints.up("md")]: {
        width: "40%",
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

  const [currentImagesForUpload, setCurrentImagesForUpload] = useState<File[]>([]);
  const [currentJsonsForUpload, setCurrentJsonsForUpload] = useState<File[]>([]);

  const [selectedImageFileNames, setSelectedImageFileNames] = useState("No file selected");
  const [selectedJSONFileNames, setSelectedJSONFileNames] = useState("No file selected");

  const [submitClicked, setSubmitClicked] = useState(false);

  const [matchingFileNames, setMatchingFileNames] = useState(false);

  const [serverResponse, setServerResponse] = useState<ServerResponseType>({
    status: 0,
    message: "",
  });

  const minScreenWidth = useMediaQuery("(min-width:600px)");
  // const minScreenHeight = useMediaQuery("(min-height:750px)");

  const { enqueueSnackbar } = useSnackbar();

  const axiosConfig = {
    headers: { "content-type": "multipart/form-data" },
  };

  /* Server Response messages */
  const WRONG_PASS = "Upload has not been completed, the server password was not correct!";

  /**
   * Function for re-initialising all sanity-checks hooks involved in Files submission
   */
  const prepareSanityChecks = () => {
    setSubmitClicked(false);
    setMatchingFileNames(false);
    setServerResponse({ status: 0, message: "" });
  };

  /**
   * Function for getting the images selected by the user
   * @param event - file selection event triggered
   */
  const prepareCurrentImagesForUpload = (event) => {
    setCurrentImagesForUpload(event.currentTarget.files);
    setSelectedImageFileNames(getFileNames(event.currentTarget.files));
    prepareSanityChecks();
  };

  /**
   * Function for getting the JSONs selected by the user
   * @param event - JSON selection event triggered
   */
  const prepareCurrentJsonsForUpload = (event) => {
    setCurrentJsonsForUpload(event.currentTarget.files);
    setSelectedJSONFileNames(getFileNames(event.currentTarget.files));
    prepareSanityChecks();
  };

  /**
   * Function for obtaining the file names selected by the user
   * @param files - List of files selected
   */
  const getFileNames = (files): string => {
    const sb = new StringBuilder();
    for (const file of files) {
      sb.append(file.name).append("; ");
    }
    return sb.toString();
  };

  /**
   * Function for checking the validity of the files selected by the user
   */
  const validInputFiles = (images: File[], jsons: File[]) => {
    if (images.length <= 0 || jsons.length <= 0 || images.length !== jsons.length) {
      return false;
    }
    for (let index = 0; index < images.length; index++) {
      if (images[index].name.split(".")[0] !== jsons[index].name.split(".")[0]) {
        return false;
      }
    }
    return true;
  };

  /**
   * Function for sending POST Request to the server,
   * after at least 1 image and at least 1 JSONs were selected
   */
  const submitClick = () => {
    setSubmitClicked(true);
    if (currentImagesForUpload == null || !currentJsonsForUpload == null) {
      // eslint-disable-next-line no-console
      console.log("No files to upload for images or jsons, aborting.");
    }
    /* Ensure that each Image has its corresponding JSON */
    const images = Array.from(currentImagesForUpload);
    const jsons = Array.from(currentJsonsForUpload);
    images.sort((img1, img2) => img1.name.localeCompare(img2.name));
    jsons.sort((json1, json2) => json1.name.localeCompare(json2.name));

    if (validInputFiles(images, jsons)) {
      setMatchingFileNames(true);
      enqueueSnackbar("Uploading files to the server...", constants.uploadFilesSnackbarOptions);
      for (let index = 0; index < currentImagesForUpload.length; index++) {
        /* Send POST Request with one image data to server */
        const imagesFormData = new FormData();
        const serverKey = process.env.REACT_APP_SERVER_KEY || "N/A";
        imagesFormData.append("pass", serverKey);
        imagesFormData.append("scan", images[index]);
        imagesFormData.append("json", jsons[index]);

        axios
          .post("https://spot-the-lesion.herokuapp.com/post/", imagesFormData, axiosConfig)
          .then((response) => {
            /* Retrieve the server response */
            setServerResponse({
              status: response.status,
              message: response.data,
            });

            /* Enqueue snackbar with the Server Response */
            const responseSnackbarOptions =
              response.status === 200 && response.data !== WRONG_PASS
                ? constants.successSnackbarOptions
                : constants.errorSnackbarOptions;
            enqueueSnackbar(response.data, responseSnackbarOptions);
          })
          .catch((error) => {
            /* Retrieve Server Error */
            setServerResponse({
              status: error.response.status,
              message: error.response.data,
            });

            /* Enqueue snackbar with the Server Error */
            enqueueSnackbar(error.response.data, constants.errorSnackbarOptions);
          });
      }
    }
  };

  /**
   * Function for displaying the upload status, based on the server's response
   * @param response - the server's response to the upload request
   * @param invalidUpload - boolean flag for testing whether the upload try is invalid
   *                      - e.g.: number of Images !== number of JSONs,
   *                              no Images selected, no JSONs selected
   * @param invalidFileNames - boolean flag for checking whether each image has its corresponding JSON
   */
  const getUploadStatus = (
    response: ServerResponseType,
    invalidUpload: boolean,
    invalidFileNames: boolean
  ): string => {
    if (invalidUpload && submitClicked) {
      return "Please Select a file.";
    }
    if (invalidFileNames && submitClicked) {
      return "Selected Images and JSONs don't match.";
    }
    if (submitClicked) {
      return response.message;
    }
    return "";
  };

  const serverResponseOK = serverResponse.status === 200 && serverResponse.message !== WRONG_PASS;

  return (
    <>
      <AppBar position="absolute">
        <Toolbar variant="dense">
          <Typography>Spot the Lesion</Typography>
        </Toolbar>
      </AppBar>

      <div
        className={[classes.box, minScreenWidth ? classes.desktopBox : classes.mobileBox].join(" ")}
      >
        <div className={classes.uploadSectionContainer}>
          <Typography className={classes.text}>Image upload panel</Typography>
          <div className={classes.submit}>
            <div
              className={
                minScreenWidth ? classes.desktopUploadSection : classes.mobileUploadSection
              }
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                className={
                  minScreenWidth ? classes.desktopUploadButton : classes.mobileUploadButton
                }
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
              <TextField
                className={
                  minScreenWidth ? classes.desktopUploadButton : classes.mobileUploadButton
                }
                value={selectedImageFileNames}
                helperText={getUploadStatus(
                  serverResponse,
                  currentImagesForUpload.length === 0 ||
                    currentImagesForUpload.length < currentJsonsForUpload.length,
                  !matchingFileNames &&
                    currentImagesForUpload.length === currentJsonsForUpload.length
                )}
                FormHelperTextProps={{
                  className: serverResponseOK ? classes.successMessage : classes.errorMessage,
                }}
              />
            </div>
            <div
              className={
                minScreenWidth ? classes.desktopUploadSection : classes.mobileUploadSection
              }
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                className={
                  minScreenWidth ? classes.desktopUploadButton : classes.mobileUploadButton
                }
                startIcon={<CloudUploadIcon />}
                component="label"
              >
                Upload JSON
                <input
                  type="file"
                  accept=".json"
                  hidden
                  multiple
                  onChange={(event) => prepareCurrentJsonsForUpload(event)}
                />
              </Button>
              <TextField
                className={
                  minScreenWidth ? classes.desktopUploadButton : classes.mobileUploadButton
                }
                value={selectedJSONFileNames}
                helperText={getUploadStatus(
                  serverResponse,
                  currentJsonsForUpload.length === 0 ||
                    currentJsonsForUpload.length < currentImagesForUpload.length,
                  !matchingFileNames &&
                    currentImagesForUpload.length === currentJsonsForUpload.length
                )}
                FormHelperTextProps={{
                  className: serverResponseOK ? classes.successMessage : classes.errorMessage,
                }}
              />
            </div>
          </div>
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
    </>
  );
};

export default FileUpload;
