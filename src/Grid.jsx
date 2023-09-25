import React from "react";
import styles from "./grid.module.css";

// in px (pixels)
const GRID_WIDTH = 1500;
const GRID_HEIGHT = 500;
const CELL_DIMENSION = 30;

const NUMBER_OF_ROWS = GRID_HEIGHT / CELL_DIMENSION;
const NUMBER_OF_COLUMNS = GRID_WIDTH / CELL_DIMENSION;

const grid = [];
for (let i = 0; i < NUMBER_OF_ROWS; i++) {
  const row = [];
  for (let j = 0; j < NUMBER_OF_COLUMNS; j++) {
    row.push([i, j]);
  }
  grid.push(row);
}

function Cell({ x, y }) {
  return (
    <div
      className={styles.cell}
      style={{
        top: `${x * CELL_DIMENSION}px`,
        left: `${y * CELL_DIMENSION}px`,
        height: `${CELL_DIMENSION}px`,
        width: `${CELL_DIMENSION}px`,
      }}
    ></div>
  );
}

function Grid({ snakes }) {
  return (
    <div className={styles.grid}>
      {grid.map((rows) => {
        return rows.map((col) => {
          const [x, y] = col;
          return <Cell x={x} y={y} key={`${x}-${y}`} />;
        });
      })}
    </div>
  );
}

export default Grid;
