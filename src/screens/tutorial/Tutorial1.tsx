import React from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { makeStyles } from "@material-ui/styles";

const slide1Images = [
  "",
  "https://drive.google.com/file/d/109Icr7RZnYFO5WjkjeXWsy3bD1S3iE7x/preview",
  "https://drive.google.com/file/d/109Icr7RZnYFO5WjkjeXWsy3bD1S3iE7x/preview",
  "https://drive.google.com/file/d/1zUiZsLTjVAyPTrmppFVojLedWsZsRUjK/preview",
  "https://drive.google.com/file/d/1Z6mNsPSHeDxUeOfF1qgAhGHlsaM-X00_/preview",
  "https://drive.google.com/file/d/1j04ZbODp1vkfTjCHddkWlZjoI4rZsNsn/preview",
  "https://drive.google.com/file/d/126hJMQ-Q34rrEgsnzAQaGwTCsMAG6yAE/preview",
];

const slide2Images = [
  "",
  "",
  "",
  "",
  "https://drive.google.com/file/d/1brdT9MTCpdG9Pn-i5GQFZe7quld4gIBw/preview",
  "https://drive.google.com/file/d/15FtUQagj-e6sQsX22bFjrLkosfHCPCMm/preview",
  "",
];

const slideText = [
  "Welcome to Spot-the-Lesion!",
  "You’ll receive a sample of a CT scan like this one below, and you’’ll have to find the lesion present in it.",
  " You have 10 seconds to click on the region of the scan where you think the lesion is located.",
  "After 5 seconds, a hint will appear - the red circle indicates the part of the image which you should look at.",
  "If your click was correct, then you’ll see a green cross (x) on the spot you selected, otherwise a red cross (x) will appear.",
  "You’ll also see the AI’s prediction on the lesion, marked with a red rectangle if the AI was wrong, or a green rectangle if the AI was correct.",
  "Finally, you will see the correct aswer marked with a yellow rectangle, which will match with your and AI’s responses if you and the AI are correct",
];

const slideNo = [0, 1, 2, 3, 4, 5, 6];

const properties = {
  duration: 1000000,
  transitionDuration: 500,
  indicators: true,
  arrows: true,
  height: "90vh",
  infinite: false,
};

const myStyle = makeStyles({
  iframe: {
    width: "30vw",
    maxHeight: "50vh",
    height: "100%",
    margin: "2vw",
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
    fontSize: "2vw",
    textAlign: "center",
    height: "10vh",
  },
  white: {
    margin: "3vh",
    backgroundColor: "white",
    height: "80vh",
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
});

const Slideshow = () => {
  const style = myStyle();
  return (
    <Slide {...properties}>
      {slideNo.map((number) => (
        <div className={`${style.white} each-slide ${style.center}`} key={number}>
          <div className={`${style.center} ${style.smallDiv}`}>
            <p className={`${style.center} ${style.paragraph}`}>{slideText[number]}</p>
          </div>
          {slide1Images[number] === "" && slide2Images[number] === "" ? (
            ""
          ) : (
            <div>
              {slide1Images[number] === "" ? (
                ""
              ) : (
                <iframe className={style.iframe} src={slide1Images[number]} />
              )}
              {slide2Images[number] === "" ? (
                ""
              ) : (
                <iframe className={style.iframe} src={slide2Images[number]} />
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
