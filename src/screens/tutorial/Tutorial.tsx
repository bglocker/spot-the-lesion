import React, { useEffect, useState } from "react";
import { Button, Slide, SlideProps } from "@material-ui/core";
import TutorialCard from "./card/TutorialCard";

// const slide1Images = [
//   "",
//   "https://drive.google.com/uc?export=view&id=109Icr7RZnYFO5WjkjeXWsy3bD1S3iE7x",
//   "https://drive.google.com/uc?export=view&id=109Icr7RZnYFO5WjkjeXWsy3bD1S3iE7x",
//   "https://drive.google.com/uc?export=view&id=1zUiZsLTjVAyPTrmppFVojLedWsZsRUjK",
//   "https://drive.google.com/uc?export=view&id=1Z6mNsPSHeDxUeOfF1qgAhGHlsaM-X00_",
//   "https://drive.google.com/uc?export=view&id=1j04ZbODp1vkfTjCHddkWlZjoI4rZsNsn",
//   "https://drive.google.com/uc?export=view&id=126hJMQ-Q34rrEgsnzAQaGwTCsMAG6yAE",
//   "",
// ];
//
// const slide2Images = [
//   "",
//   "",
//   "",
//   "",
//   "https://drive.google.com/uc?export=view&id=1brdT9MTCpdG9Pn-i5GQFZe7quld4gIBw",
//   "https://drive.google.com/uc?export=view&id=15FtUQagj-e6sQsX22bFjrLkosfHCPCMm",
//   "",
//   "",
// ];
//

//
// const slideNo = [0, 1, 2, 3, 4, 5, 6, 7];
//
// const myStyle = makeStyles({
//   iframe: {
//     maxHeight: "60vh",
//     maxWidth: "35vw",
//     marginBottom: "3vh",
//     marginLeft: "1vw",
//     marginRight: "1vw",
//     align: "center",
//   },
//   center: {
//     height: "90vh",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   paragraph: {
//     width: "80vw",
//     fontSize: "calc((4vw + 4vh)/2)",
//     textAlign: "center",
//     height: "10vh",
//   },
//   white: {
//     marginTop: "5vh",
//     backgroundColor: "white",
//     height: "80vh",
//     borderRadius: 25,
//     borderColor: "black",
//     borderWidth: "5px",
//     borderStyle: "solid",
//     marginLeft: "4.75vw",
//     marginRight: "4.75vw",
//   },
//   smallDiv: {
//     height: "5vh",
//   },
//   button: {
//     background: "#07575B",
//     borderRadius: 25,
//     borderColor: "black",
//     borderWidth: "calc((2vw + 2vh)/10)",
//     borderStyle: "solid",
//     color: "white",
//     height: "5vh",
//     width: "10vw",
//     fontSize: "calc((2vw + 2vh)/2)",
//     fontFamily: "segoe UI",
//     fontWeight: "bold",
//     // marginLeft: "4.5vw",
//     position: "fixed",
//   },
//   centeredButton: {
//     alignItems: "center",
//   },
//   moveButtonGroup: {
//     marginLeft: "20vw",
//   },
//   arrowLeftButton: {
//     position: "fixed",
//     left: "30%",
//     top: "93%",
//   },
//   arrowRightButton: {
//     position: "fixed",
//     right: "30%",
//     top: "93%",
//   },
//   centerImages: {
//     display: "flex",
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

const Tutorial: React.FC<TutorialProps> = ({ setBackButton }: TutorialProps) => {
  // const style = myStyle();
  //
  // const ArrowLeft = () => {
  //   return (
  //     <Button
  //       className={`${style.button}
  //                   ${style.arrowLeftButton}`}
  //     >
  //       {"<"}
  //     </Button>
  //   );
  // };
  // const ArrowRight = () => {
  //   return (
  //     <Button
  //       className={`${style.button}
  //                   ${style.arrowRightButton}`}
  //     >
  //       {">"}
  //     </Button>
  //   );
  // };
  //
  // const properties = {
  //   duration: 1000000,
  //   transitionDuration: 500,
  //   arrows: true,
  //   indicators: true,
  //   nextArrow: ArrowRight(),
  //   prevArrow: ArrowLeft(),
  // };
  //
  // const Slideshow = () => {
  //   return (
  //     // eslint-disable-next-line react/jsx-props-no-spreading
  //     <Slide {...properties}>
  //       {slideNo.map((number) => (
  //         <div className={`${style.white} each-slide ${style.center}`} key={number}>
  //           <div className={`${style.center} ${style.smallDiv}`}>
  //             <p className={`${style.center} ${style.paragraph}`}>{slideText[number]}</p>
  //           </div>
  //           {slide1Images[number] === "" && slide2Images[number] === "" ? (
  //             ""
  //           ) : (
  //             <div className={style.centerImages}>
  //               {slide1Images[number] === "" ? (
  //                 "" // eslint-disable-next-line jsx-a11y/iframe-has-title
  //               ) : (
  //                 <img
  //                   className={style.iframe}
  //                   src={slide1Images[number]}
  //                   alt="https://drive.google.com/file/d/1bTG-dxY0hCeP6ZFujxPDZQY83vj1iqR9/preview"
  //                 />
  //               )}
  //               {slide2Images[number] === "" ? (
  //                 "" // eslint-disable-next-line jsx-a11y/iframe-has-title
  //               ) : (
  //                 <img
  //                   className={style.iframe}
  //                   src={slide2Images[number]}
  //                   alt="https://drive.google.com/file/d/1bTG-dxY0hCeP6ZFujxPDZQY83vj1iqR9/preview"
  //                 />
  //               )}
  //             </div>
  //           )}
  //           <div>
  //             {number === 7 ? (
  //               <Button
  //                 className={`${style.button}
  //                             ${style.centeredButton}`}
  //                 onClick={() => setRoute("game")}
  //               >
  //                 Play
  //               </Button>
  //             ) : (
  //               ""
  //             )}
  //           </div>
  //         </div>
  //       ))}
  //     </Slide>
  //   );
  // };

  // The slide text
  const SLIDE_TEXT = [
    "Welcome to Spot-the-Lesion!",
    "You’ll receive a sample of a CT scan like this one below, and you’’ll have to find the lesion present in it.",
    " You have 10 seconds to click on the region of the scan where you think the lesion is located.",
    "After 5 seconds, a hint will appear - the red circle indicates the part of the image which you should look at.",
    "If your click was correct, then you’ll see a green cross (x) on the spot you selected, otherwise a red cross (x) will appear.",
    "You’ll also see the AI’s prediction on the lesion, marked in red if the AI was wrong, or in green if the AI was correct.",
    "Finally, you will see the correct aswer marked in yellow.",
    "That's it! Now, can you spot more lesions than the AI?",
  ];

  const [index, setIndex] = useState(0);
  const textContent = SLIDE_TEXT[index];
  const numSlides = SLIDE_TEXT.length;

  const [slideIn, setSlideIn] = useState(true);
  const [slideDirection, setSlideDirection] = useState<SlideProps["direction"]>("down");

  const onArrowClick = (direction: SlideProps["direction"]) => {
    const increment = direction === "left" ? -1 : 1;
    const newIndex = (index + increment + numSlides) % numSlides;

    const oppDirection = direction === "left" ? "right" : "left";
    setSlideDirection(direction);
    setSlideIn(false);

    setTimeout(() => {
      setIndex(newIndex);
      setSlideDirection(oppDirection);
      setSlideIn(true);
    }, 500);
  };

  useEffect(() => {
    const handleKeyDown = (e: { keyCode: number }) => {
      if (e.keyCode === 39) {
        onArrowClick("right");
      }
      if (e.keyCode === 37) {
        onArrowClick("left");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  setBackButton(true);

  return (
    <div>
      <Slide in={slideIn} direction={slideDirection}>
        <div>
          <TutorialCard textContent={textContent} />
        </div>
      </Slide>
      <Button onClick={() => onArrowClick("left")}>Left</Button>
      <Button onClick={() => onArrowClick("right")}>Right</Button>
    </div>
  );
};

export default Tutorial;
