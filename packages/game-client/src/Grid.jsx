import React from 'react';
import styles from './grid.module.css';
import { CELL_DIMENSION, GRID_HEIGHT, GRID_WIDTH, FOOD_TYPES } from './constants';
import animation from './animations.module.css';

function Grid({ view, annotations, showCellId, isGameOver }) {
	return (
		<div className={styles.grid} style={{ width: `${GRID_WIDTH}px`, height: `${GRID_HEIGHT}px` }}>
			{/* // I have separate <div />(s) for annotations and game, because these can overlap with each other. */}

			{isGameOver && <div className={styles['game-over-banner']}>Game Over</div>}

			{view.map((cell) => {
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

			{annotations.map((cell) => {
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
