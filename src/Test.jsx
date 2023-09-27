import React, { useState, useEffect } from "react";

const DIRECTION = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
};

function Test() {
  const up = () => {
    setCurrentDirection((prev) => DIRECTION.UP);
  };

  const down = () => {
    setCurrentDirection((prev) => DIRECTION.DOWN);
  };

  const right = () => {
    setCurrentDirection((prev) => DIRECTION.RIGHT);
  };

  const left = () => {
    setCurrentDirection((prev) => DIRECTION.LEFT);
  };

  const [currentDirection, setCurrentDirection] = useState(DIRECTION.RIGHT);

  useEffect(() => {
    document.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();
      if (["w", "arrowup"].includes(key)) {
        up();
      } else if (["s", "arrowdown"].includes(key)) {
        down();
      } else if (["a", "arrowleft"].includes(key)) {
        left();
      } else if (["d", "arrowright"].includes(key)) {
        right();
      }
    });

    return () => {
      clearInterval(timer);
    };
  }, []);
  return <div>{currentDirection}</div>;
}

export default Test;
