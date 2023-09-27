import React, { useEffect } from "react";
import styles from "./grid.module.css";
import {
  CELL_DIMENSION,
  NUMBER_OF_COLUMNS,
  NUMBER_OF_ROWS,
  GRID_HEIGHT,
  GRID_WIDTH,
} from "./constants";
import { generateKey } from "./utils";

const grid = [];
for (let i = 0; i < NUMBER_OF_ROWS; i++) {
  const row = [];
  for (let j = 0; j < NUMBER_OF_COLUMNS; j++) {
    row.push([i, j]);
  }
  grid.push(row);
}

function Cell({ x, y, body, head }) {
  const cellColor = () => {
    if (body) {
      return { backgroundColor: "red" };
    } else if (head) {
      return { backgroundColor: "black" };
    } else {
      return { backgroundColor: "white" };
    }
  };
  return (
    <div
      className={styles.cell}
      style={{
        top: `${x * CELL_DIMENSION}px`,
        left: `${y * CELL_DIMENSION}px`,
        height: `${CELL_DIMENSION}px`,
        width: `${CELL_DIMENSION}px`,
        ...cellColor(),
      }}
    ></div>
  );
}


// useEffect(() => {
  
// },[])

function Grid({ snake }) {
  const makeCell = (cell) => {
    const [x, y] = cell;
    if (x == snake.x && y == snake.y) {
      return <Cell x={x} y={y} key={`${x}-${y}`} head={true} />;
    } else {
      return <Cell x={x} y={y} key={`${x}-${y}`} />;
    }
  };

  return (
    <div
      className={styles.grid}
      style={{ width: `${GRID_WIDTH}px`, height: `${GRID_HEIGHT}px` }}
    >
      {grid.map((rows) => rows.map((col) => makeCell(col)))}
    </div>
  );
}

export default Grid;
