import React from 'react';
import styles from './grid.module.css';
import { CELL_DIMENSION, GRID_HEIGHT, GRID_WIDTH, FOOD_TYPES } from './constants';
import animation from './animations.module.css';

function Cell({ x, y, color, showCellId, animationClass }) {
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

function Grid({ snakes, food, showCellId }) {
	return (
		<div className={styles.grid} style={{ width: `${GRID_WIDTH}px`, height: `${GRID_HEIGHT}px` }}>
			{Object.values(snakes).map((snake) => {
				const { hash, headColor, bodyColor } = snake;
				const [headKey] = snake.list;
				return Object.entries(hash).map(([key, value]) => {
					const { x, y } = value;
					return (
						<Cell
							x={x}
							y={y}
							key={key}
							color={key == headKey ? headColor : bodyColor}
							showCellId={showCellId}
							type="snake"
						/>
					);
				});
			})}
			{Object.entries(food).map(([key, value]) => {
				const { x, y, type: foodType } = value;
				const { color, animationClass } = FOOD_TYPES[foodType];
				return (
					<Cell x={x} y={y} key={key} color={color} showCellId={showCellId} animationClass={animationClass} />
				);
			})}
		</div>
	);
}

export default Grid;
