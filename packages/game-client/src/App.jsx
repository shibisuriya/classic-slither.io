import React, { useState, useEffect } from 'react';
import { generateRandomNumber } from './utils';
import { DIRECTIONS, defaultDirections } from './constants';
import { initialSnakesState, initialFoodState } from './computed';
import { useDirection, useFood, useTicks, useSnakes, useInput, useSocket } from './hooks';
import Grid from './Grid';
import styles from './app.module.css';

// function App() {
// 	const [mounted, setMounted] = useState(true);
// 	return (
// 		<div>
// 			<div>
// 				<button onClick={() => setMounted((prev) => !prev)}>Mount / Unmount</button>
// 			</div>
// 			<div>{mounted && <Game />}</div>
// 		</div>
// 	);
// }

function App() {
	const [snakeId, setSnakeId] = useState(1);

	// Keep the direction of the snakes inside useRef since we don't
	// want to force rerender of the component when the user changes
	// the direction.
	const { getDirection, onLeft, onRight, onUp, onDown, setDirection } = useDirection(defaultDirections, 1);

	useInput({ snakes, onUp, onDown, onLeft, onRight, snakeId });

	const { food, getFood, removeFood, spawnFood, isFood } = useFood({ initialFoodState });

	const getSnakeCells = () => allSnakeCells();

	// Don't keep direction of the snakes inside of useState()...
	const {
		snakes,
		updateSnake,
		removeSnake,
		resetSnake,
		getSnakeCells: allSnakeCells,
	} = useSnakes({
		initialSnakesState,
		getDirection,
		getFood,
		removeFood,
		setDirection,
		isFood,
	});

	useTicks({ updateSnake, snakes, food, spawnFood, getSnakeCells });

	return (
		<div className={styles.game}>
			{/* <select value={snakeId} onChange={(e) => setSnakeId(e.target.value)}>
				{Object.keys(snakes).map((snakeId, index) => (
					<option value={snakeId} key={index}>
						{snakeId}
					</option>
				))}
			</select> */}
			<Grid snakes={snakes} food={food} />
		</div>
	);
}

export default App;
