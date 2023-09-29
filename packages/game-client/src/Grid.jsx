import React from 'react';
import styles from './grid.module.css';
import { CELL_DIMENSION, NUMBER_OF_COLUMNS, NUMBER_OF_ROWS, GRID_HEIGHT, GRID_WIDTH } from './constants';
import { generateKey } from './utils';

const grid = [];
for (let i = 0; i < NUMBER_OF_ROWS; i++) {
	const row = [];
	for (let j = 0; j < NUMBER_OF_COLUMNS; j++) {
		row.push([i, j]);
	}
	grid.push(row);
}

function Cell({ x, y, body, head, color }) {
	// const cellColor = () => {
	// 	if (body) {
	// 		return { backgroundColor: 'red' };
	// 	} else if (head) {
	// 		return { backgroundColor: 'black' };
	// 	} else {
	// 		return { backgroundColor: 'white' };
	// 	}
	// };
	const cellColor = () => {
		return { backgroundColor: color };
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

function Grid({ snakes }) {
	function isSnakeCell(key) {
		for (const snake of Object.keys(snakes)) {
			if (snakes[snake].hash[key]) {
				return snakes[snake].headColor;
			}
		}
		return 'white';
	}

	const makeCell = (cell) => {
		const [x, y] = cell;
		const key = generateKey(x, y);
		return <Cell x={x} y={y} key={key} head={true} color={isSnakeCell(key)} />;
	};

	return (
		<div className={styles.grid} style={{ width: `${GRID_WIDTH}px`, height: `${GRID_HEIGHT}px` }}>
			{grid.map((rows) => rows.map((col) => makeCell(col)))}
		</div>
	);
}

export default Grid;
