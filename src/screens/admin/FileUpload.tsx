import React, { useState } from "react";
import { Button, Card, TextField, Typography } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { CloudUpload } from "@material-ui/icons";
import axios from "axios";
import clsx from "clsx";
import { useSnackbar } from "notistack";
import { NavigationAppBar } from "../../components";
import { handleAxiosError } from "../../utils/axiosUtils";
import { compareFiles, getFileNames, removeExtension } from "../../utils/fileUtils";
import colors from "../../res/colors";
import constants from "../../res/constants";

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    card: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      boxSizing: "border-box",
      padding: 24,
      [theme.breakpoints.down("xs")]: {
        width: "80%",
        height: "95%",
      },
      [theme.breakpoints.up("sm")]: {
        width: "60%",
        height: "80%",
      },
    },
    text: {
      padding: 8,
      [theme.breakpoints.only("xs")]: {
        fontSize: "1.25rem",
      },
      [theme.breakpoints.only("sm")]: {
        fontSize: "1.5rem",
      },
      [theme.breakpoints.up("md")]: {
        fontSize: "2rem",
      },
    },
    uploadList: {
      width: "100%",
      margin: 24,
    },
    uploadItem: {
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center",
      [theme.breakpoints.down("xs")]: {
        flexDirection: "column",
      },
      [theme.breakpoints.up("sm")]: {
        flexDirection: "row",
      },
    },
    uploadButton: {
      margin: 16,
    },
    uploadTextField: {
      margin: 16,
    },
    successText: {
      color: colors.fileUploadSuccess,
    },
    errorText: {
      color: colors.fileUploadError,
    },
    submitButton: {
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
  })
);

const axiosConfig = { headers: { "content-type": "multipart/form-data" } };

const wrongPasswordResponse = "Upload has not been completed, the server password was not correct!";

const FileUpload: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedJsons, setSelectedJsons] = useState<File[]>([]);

  const [imageHelperText, setImageHelperText] = useState("");
  const [jsonHelperText, setJsonHelperText] = useState("");

  const [uploadSuccessful, setUploadSuccessful] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const classes = useStyles();

  const resetState = () => {
    setImageHelperText("");
    setJsonHelperText("");
    setUploadSuccessful(false);
  };

  const onUploadImageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) {
      return;
    }

    const files = [...event.target.files].sort(compareFiles);

    setSelectedImages(files);
    resetState();
  };

  const onUploadJsonInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) {
      return;
    }

    const files = [...event.target.files].sort(compareFiles);

    setSelectedJsons(files);
    resetState();
  };

  /**
   * Check the selected files, setting the helper texts if invalid
   *
   * @param images Selected image files
   * @param jsons  Selected json files
   *
   * @return True if valid, false otherwise
   */
  const checkSelectedFiles = (images: File[], jsons: File[]) => {
    if (images.length === 0 || jsons.length === 0) {
      if (images.length === 0) {
        setImageHelperText("Please select a file.");
      }

      if (jsons.length === 0) {
        setJsonHelperText("Please select a file.");
      }

      return false;
    }

    if (images.length !== jsons.length) {
      if (images.length < jsons.length) {
        setImageHelperText("Too few images for the selected jsons.");
      }

      if (jsons.length < images.length) {
        setJsonHelperText("Too few jsons for the selected images.");
      }

      return false;
    }

    for (let i = 0; i < images.length; i++) {
      const imageName = removeExtension(images[i].name);
      const jsonName = removeExtension(jsons[i].name);

      if (imageName !== jsonName) {
        setImageHelperText("Images and jsons names don't match.");
        setJsonHelperText("Images and jsons names don't match.");

        return false;
      }
    }

    return true;
  };

  /**
   * Function for sending POST Request to the server,
   * after at least 1 image and at least 1 JSONs were selected
   */
  const onSubmitClick = () => {
    if (!checkSelectedFiles(selectedImages, selectedJsons)) {
      return;
    }

    enqueueSnackbar("Uploading files to the server...", constants.uploadFilesSnackbarOptions);

    for (let i = 0; i < selectedImages.length; i++) {
      /* Send one POST Request per each image and json pair to the server */
      const serverKey = process.env.REACT_APP_SERVER_KEY || "N/A";

      const formData = new FormData();
      formData.append("pass", serverKey);
      formData.append("scan", selectedImages[i]);
      formData.append("json", selectedJsons[i]);

      axios
        .post("https://spot-the-lesion.herokuapp.com/post/", formData, axiosConfig)
        .then((response) => {
          const successful = response.status === 200 && response.data !== wrongPasswordResponse;

          if (successful) {
            setImageHelperText("Upload successful!");
            setJsonHelperText("Upload successful!");

            setUploadSuccessful(true);
          } else {
            setImageHelperText(response.data);
            setJsonHelperText(response.data);
          }

          /* Enqueue snackbar with the Server Response */
          const responseSnackbarOptions = successful
            ? constants.successSnackbarOptions
            : constants.errorSnackbarOptions;

          enqueueSnackbar(response.data, responseSnackbarOptions);
        })
        .catch((error) => {
          if (axios.isAxiosError(error)) {
            handleAxiosError(error);

            if (error.response) {
              setImageHelperText(error.response.data);
              setJsonHelperText(error.response.data);

              /* Enqueue snackbar with the Server Error */
              enqueueSnackbar(error.response.data, constants.errorSnackbarOptions);
            }
          }
        });
    }
  };

  return (
    <>
      <NavigationAppBar showBack />

      <div className={classes.container}>
        <Card className={classes.card}>
          <Typography className={classes.text}>Image upload panel</Typography>

          <div className={classes.uploadList}>
            <div className={classes.uploadItem}>
              <input
                id="upload-image-input"
                accept="image/*"
                type="file"
                multiple
                hidden
                onChange={onUploadImageInputChange}
              />

              <label htmlFor="upload-image-input" className={classes.uploadButton}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<CloudUpload />}
                  component="span"
                >
                  Upload Image
                </Button>
              </label>

              <TextField
                className={classes.uploadTextField}
                placeholder="No file selected"
                value={getFileNames(selectedImages)}
                helperText={imageHelperText}
                FormHelperTextProps={{
                  className: clsx({
                    [classes.successText]: uploadSuccessful,
                    [classes.errorText]: !uploadSuccessful,
                  }),
                }}
                InputProps={{ readOnly: true }}
              />
            </div>

            <div className={classes.uploadItem}>
              <input
                id="upload-json-input"
                accept=".json"
                type="file"
                multiple
                hidden
                onChange={onUploadJsonInputChange}
              />

              <label htmlFor="upload-json-input" className={classes.uploadButton}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<CloudUpload />}
                  component="span"
                >
                  Upload JSON
                </Button>
              </label>

              <TextField
                className={classes.uploadTextField}
                placeholder="No file selected"
                value={getFileNames(selectedJsons)}
                helperText={jsonHelperText}
                FormHelperTextProps={{
                  className: clsx({
                    [classes.successText]: uploadSuccessful,
                    [classes.errorText]: !uploadSuccessful,
                  }),
                }}
                InputProps={{ readOnly: true }}
              />
            </div>
          </div>

          <Button
            className={classes.submitButton}
            variant="contained"
            color="primary"
            size="large"
            onClick={onSubmitClick}
          >
            Submit
          </Button>
        </Card>
      </div>
    </>
  );
};

export default FileUpload;
