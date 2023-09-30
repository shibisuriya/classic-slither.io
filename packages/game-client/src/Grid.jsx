import React from 'react';
import styles from './grid.module.css';
import { CELL_DIMENSION, GRID_HEIGHT, GRID_WIDTH } from './constants';
import { FOOD_TYPES } from './constants';

function Cell({ x, y, color }) {
	return (
		<div
			className={styles.cell}
			style={{
				top: `${x * CELL_DIMENSION}px`,
				left: `${y * CELL_DIMENSION}px`,
				height: `${CELL_DIMENSION}px`,
				width: `${CELL_DIMENSION}px`,
				backgroundColor: color,
			}}
		></div>
	);
}

function Food({ x, y, type = FOOD_TYPES.PROTEIN }) {
	return (
		<div
			className={`${styles.cell} ${styles.protein} ${styles.food}`}
			style={{
				top: `${x * CELL_DIMENSION}px`,
				left: `${y * CELL_DIMENSION}px`,
				height: `${CELL_DIMENSION}px`,
				width: `${CELL_DIMENSION}px`,
			}}
		></div>
	);
}

function Grid({ snakes, food }) {
	return (
		<div className={styles.grid} style={{ width: `${GRID_WIDTH}px`, height: `${GRID_HEIGHT}px` }}>
			{Object.values(snakes).map((snake) => {
				const { hash, headColor, bodyColor } = snake;
				const [headKey] = snake.list;
				return Object.entries(hash).map(([key, value]) => {
					const { x, y } = value;
					if (key == headKey) {
						return <Cell x={x} y={y} key={key} color={headColor} />;
					} else {
						return <Cell x={x} y={y} key={key} color={bodyColor} />;
					}
				});
			})}
			{Object.entries(food).map(([key, value]) => {
				const { x, y } = value;
				return <Food x={x} y={y} key={key} />;
			})}
		</div>
	);
}

export default Grid;
