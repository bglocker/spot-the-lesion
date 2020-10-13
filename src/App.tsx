import React, { useState } from "react";
import Home from "./screens/home/Home";
import Game from "./screens/game/Game";
import Tutorial1 from "./screens/tutorial/Tutorial1";
import About from "./screens/about/About";
import Credits from "./screens/credits/Credits";

const App: React.FC = () => {
  const [route, setRoute] = useState<Route>("home");

  let currentScreen: React.ReactNode;
  switch (route) {
    default: // fall-through
    case "home":
      currentScreen = <Home setRoute={setRoute} />;
      break;
    case "game":
      currentScreen = <Game setRoute={setRoute} />;
      break;
    case "tutorial1":
      currentScreen = <Tutorial1 setRoute={setRoute} />;
      break;
    case "about":
      currentScreen = <About setRoute={setRoute} />;
      break;
    case "credits":
      currentScreen = <Credits setRoute={setRoute} />;
      break;
  }

  return <div>{currentScreen}</div>;
};

export default App;
