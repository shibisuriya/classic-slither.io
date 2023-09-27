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
  const [currentDirection, setCurrentDirection] = useState(DIRECTION.DOWN);

  function moveForward() {
    setSnake((prev) => {
      const { x, y } = prev;
      if (currentDirection == DIRECTION.UP) {
        return { ...prev, x: x - 1 };
      } else if (currentDirection == DIRECTION.DOWN) {
        return { ...prev, x: x + 1 };
      } else if (currentDirection == DIRECTION.LEFT) {
        return { ...prev, y: y - 1 };
      } else if (currentDirection == DIRECTION.RIGHT) {
        return { ...prev, y: y + 1 };
      }
    });
  }

  function getOppDirection(dir) {
    if (dir == DIRECTION.UP) {
      return DIRECTION.DOWN;
    } else if (dir == DIRECTION.DOWN) {
      return DIRECTION.UP;
    } else if (dir == DIRECTION.RIGHT) {
      return DIRECTION.LEFT;
    } else {
      return DIRECTION.RIGHT;
    }
  }

  const up = () => {
      setCurrentDirection(prevDirection => {
        if (getOppDirection(prevDirection) == DIRECTION.UP) {
          return prevDirection
        } else {
          return DIRECTION.UP
          }
      }
        );
  };

  const down = () => {
    if ( getOppDirection() != currentDirection)
      setCurrentDirection(prevDirection => {
        if (getOppDirection(prevDirection) == DIRECTION.DOWN) {
          return prevDirection
        } else {
          return DIRECTION.DOWN
          }
      }
        );
  };

  const right = () => {
    if( getOppDirection() != currentDirection)
      setCurrentDirection(prevDirection => {
        if (getOppDirection(prevDirection) == DIRECTION.RIGHT) {
          return prevDirection
        } else {
          return DIRECTION.RIGHT
          }
      }
        );
  };

  const left = () => {
    if( getOppDirection() != currentDirection)
      setCurrentDirection(prevDirection => {
        if (getOppDirection(prevDirection) == DIRECTION.LEFT) {
          return prevDirection
        } else {
          return DIRECTION.LEFT
          }
      }
        );
  };

  useEffect(() => {
    const timer = setInterval(moveForward.bind(this), 1 * 300);

    document.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();
      if (["w", "arrowup"].includes(key) ) {
        up();
      } else if (["s", "arrowdown"].includes(key) ) {
        down();
      } else if (["a", "arrowleft"].includes(key) ) {
        left();
      } else if (["d", "arrowright"].includes(key) ) {
        right();
      }
    });

    return () => {
      moveForward()
      clearInterval(timer);
    };
  }, [currentDirection]);

  const [snake, setSnake] = useState({ x: 0, y: 0 });

  // console.log(snake);

  return (
    <div>
      <Grid snake={snake} />
    </div>
  );
}

export default App;
