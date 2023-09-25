import React from "react";
import styles from "./grid.module.css";
import { CELL_DIMENSION, NUMBER_OF_COLUMNS, NUMBER_OF_ROWS } from "./constants";
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

function Grid({ snake }) {
  return (
    <div className={styles.grid}>
      {grid.map((rows) => {
        return rows.map((col) => {
          const [x, y] = col;
          const key = generateKey(x, y);
          if (snake.getHead().key == key) {
            return <Cell x={x} y={y} key={`${x}-${y}`} head={true} />;
          } else if (snake.hash[generateKey(x, y)]) {
            return <Cell x={x} y={y} key={`${x}-${y}`} body={true} />;
          } else {
            return <Cell x={x} y={y} key={`${x}-${y}`} />;
          }
        });
      })}
    </div>
  );
}

export default Grid;
