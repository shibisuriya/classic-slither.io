import React from 'react';
import styles from './grid.module.css';
import { CELL_DIMENSION, GRID_HEIGHT, GRID_WIDTH, FOOD_TYPES } from './constants';
import animation from './animations.module.css';

function Grid({ cells, showCellId }) {
	return (
		<div className={styles.grid} style={{ width: `${GRID_WIDTH}px`, height: `${GRID_HEIGHT}px` }}>
			{cells.map((cell) => {
				const { x, y, color, animationClass } = cell;
				return (
					<div
						key={`${x}-${y}`}
						className={`${styles.cell} ${animation[animationClass]}`}
						style={{
							left: `${x * CELL_DIMENSION}px`,
							top: `${y * CELL_DIMENSION}px`,
							height: `${CELL_DIMENSION}px`,
							width: `${CELL_DIMENSION}px`,
							backgroundColor: color,
						}}
					>
						{showCellId && `${x}-${y}`}
					</div>
				);
			})}
		</div>
	);
}

export default Grid;
