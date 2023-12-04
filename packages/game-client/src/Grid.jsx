import React from 'react';
import styles from './grid.module.css';
import { CELL_DIMENSION, GRID_HEIGHT, GRID_WIDTH, FOOD_TYPES } from './constants';
import animation from './animations.module.css';

function Cell({ x, y, color, showCellId, animationClass = '' }) {
	return (
		<div
			className={`${styles.cell} ${animation[animationClass]}`}
			style={{
				top: `${x * CELL_DIMENSION}px`,
				left: `${y * CELL_DIMENSION}px`,
				height: `${CELL_DIMENSION}px`,
				width: `${CELL_DIMENSION}px`,
				backgroundColor: color,
			}}
		>
			{showCellId && `${x}-${y}`}
		</div>
	);
}

function Grid({ cells, showCellId }) {
	return (
		<div className={styles.grid} style={{ width: `${GRID_WIDTH}px`, height: `${GRID_HEIGHT}px` }}>
			{cells.map((cell, index) => {
				const { x, y, color } = cell;
				return <Cell x={x} y={y} key={index} color={color} showCellId={showCellId} />;
			})}
		</div>
	);
}

export default Grid;
