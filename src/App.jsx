import React, { useState, useEffect, useRef } from "react";
import useOrderedHash from "./hooks/useOrderedHash";
import Grid from "./Grid";

const DIRECTION = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
};

function App() {
  const moveForward = () => {
    snake.moveForward();
  };

  useEffect(() => {
    const timer = setInterval(moveForward, 1 * 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const snake = useOrderedHash([
    [0, 4],
    [0, 3],
    [0, 2],
    [0, 1],
    [0, 0],
  ]);
  console.log(snake);

  // useEffect(() => {
  //   const timer = setInterval(move, 1 * 1000);
  //   // Listen for key presses.
  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

  return (
    <div>
      <Grid snake={snake} />
    </div>
  );
}

export default App;
