import React from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { makeStyles } from "@material-ui/styles";

const slide1Images = [
  "",
  "https://drive.google.com/uc?export=view&id=109Icr7RZnYFO5WjkjeXWsy3bD1S3iE7x",
  "https://drive.google.com/uc?export=view&id=109Icr7RZnYFO5WjkjeXWsy3bD1S3iE7x",
  "https://drive.google.com/uc?export=view&id=1zUiZsLTjVAyPTrmppFVojLedWsZsRUjK",
  "https://drive.google.com/uc?export=view&id=1Z6mNsPSHeDxUeOfF1qgAhGHlsaM-X00_",
  "https://drive.google.com/uc?export=view&id=1j04ZbODp1vkfTjCHddkWlZjoI4rZsNsn",
  "https://drive.google.com/uc?export=view&id=126hJMQ-Q34rrEgsnzAQaGwTCsMAG6yAE",
  "",
];

const slide2Images = [
  "",
  "",
  "",
  "",
  "https://drive.google.com/uc?export=view&id=1brdT9MTCpdG9Pn-i5GQFZe7quld4gIBw",
  "https://drive.google.com/uc?export=view&id=15FtUQagj-e6sQsX22bFjrLkosfHCPCMm",
  "",
  "",
];

const slideText = [
  "Welcome to Spot-the-Lesion!",
  "You’ll receive a sample of a CT scan like this one below, and you’’ll have to find the lesion present in it.",
  " You have 10 seconds to click on the region of the scan where you think the lesion is located.",
  "After 5 seconds, a hint will appear - the red circle indicates the part of the image which you should look at.",
  "If your click was correct, then you’ll see a green cross (x) on the spot you selected, otherwise a red cross (x) will appear.",
  "You’ll also see the AI’s prediction on the lesion, marked in red if the AI was wrong, or in green if the AI was correct.",
  "Finally, you will see the correct aswer marked in yellow.",
  "That's it! Now, can you spot more lesions than the AI?",
];

const slideNo = [0, 1, 2, 3, 4, 5, 6, 7];

const arrow = (degrees: number) => {
  return (
    <img
      style={{ transform: `rotate(${degrees}deg)`, width: "3vw", margin: "1vw" }}
      src="https://drive.google.com/uc?export=view&id=1bTG-dxY0hCeP6ZFujxPDZQY83vj1iqR9"
      alt="https://drive.google.com/file/d/1bTG-dxY0hCeP6ZFujxPDZQY83vj1iqR9/preview"
    />
  );
};

const nextArrow = () => {
  return arrow(0);
};

const prevArrow = () => {
  return arrow(180);
};

const properties = {
  duration: 1000000,
  transitionDuration: 500,
  indicators: true,
  arrows: true,
  height: "90vh",
  infinite: false,
  nextArrow: nextArrow(),
  prevArrow: prevArrow(),
};

const myStyle = makeStyles({
  iframe: {
    maxHeight: "60vh",
    maxWidth: "35vw",
    marginBottom: "3vh",
    marginLeft: "1vw",
    marginRight: "1vw",
    align: "center",
  },
  center: {
    height: "90vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  paragraph: {
    width: "80vw",
    fontSize: "calc((4vw + 4vh)/2)",
    textAlign: "center",
    height: "10vh",
  },
  white: {
    margin: "3vh",
    backgroundColor: "white",
    height: "80vh",
    borderRadius: 25,
    borderColor: "black",
    borderWidth: "5px",
    borderStyle: "solid",
  },
  smallDiv: {
    height: "5vh",
  },
  button: {
    background: "black",
    borderRadius: 50,
    color: "white",
    height: "5vh",
    width: "10vw",
    fontFamily: "segoe UI",
    fontWeight: "bold",
    position: "absolute",
    bottom: "1vh",
    left: "1vw",
  },
  centerImages: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

const Slideshow = () => {
  const style = myStyle();
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Slide {...properties}>
      {slideNo.map((number) => (
        <div className={`${style.white} each-slide ${style.center}`} key={number}>
          <div className={`${style.center} ${style.smallDiv}`}>
            <p className={`${style.center} ${style.paragraph}`}>{slideText[number]}</p>
          </div>
          {slide1Images[number] === "" && slide2Images[number] === "" ? (
            ""
          ) : (
            <div className={style.centerImages}>
              {slide1Images[number] === "" ? (
                ""
              ) : (
                // eslint-disable-next-line jsx-a11y/iframe-has-title
                <img
                  className={style.iframe}
                  src={slide1Images[number]}
                  alt="https://drive.google.com/file/d/1bTG-dxY0hCeP6ZFujxPDZQY83vj1iqR9/preview"
                />
              )}
              {slide2Images[number] === "" ? (
                ""
              ) : (
                // eslint-disable-next-line jsx-a11y/iframe-has-title
                <img
                  className={style.iframe}
                  src={slide2Images[number]}
                  alt="https://drive.google.com/file/d/1bTG-dxY0hCeP6ZFujxPDZQY83vj1iqR9/preview"
                />
              )}
            </div>
          )}
        </div>
      ))}
    </Slide>
  );
};

const Tutorial1: React.FC<Tutorial1Props> = ({ setRoute }: Tutorial1Props) => {
  return (
    <div>
      {Slideshow()}
      <button className={myStyle().button} type="button" onClick={() => setRoute("home")}>
        Back
      </button>
    </div>
  );
};

export default Tutorial1;
