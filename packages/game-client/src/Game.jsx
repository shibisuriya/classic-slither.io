import React, { Fragment, useState, useImperativeHandle, forwardRef } from 'react';
import { defaultDirections } from './constants';
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

const Game = forwardRef((props, ref) => {
	const { showCellId, isGamePaused } = props;
	const [snakeId, setSnakeId] = useState(1);

	useImperativeHandle(
		ref,
		() => {
			return {
				nextMove,
				prevMove,
			};
		},
		[],
	);

	// Keep the direction of the snakes inside useRef since we don't
	// want to force rerender of the component when the user changes
	// the direction.
	const { getDirection, onLeft, onRight, onUp, onDown, setDirection } = useDirection(defaultDirections, 1);

	useInput({ snakes, onUp, onDown, onLeft, onRight, snakeId });

	const getSnakeCells = () => allSnakeCells();

	const { food, getFood, removeFood, spawnFood, isFood, setFood } = useFood({ initialFoodState, getSnakeCells });

	const getTracks = () => {
		return { addSnakeToTrack, removeSnakeFromTracks, resetSnakeTrack };
	};

	// Don't keep direction of the snakes inside of useState()...
	const {
		snakes,
		moveForward,
		getSnakeCells: allSnakeCells,
		getAllSnakeIds,
	} = useSnakes({
		initialSnakesState,
		getDirection,
		getFood,
		removeFood,
		setDirection,
		isFood,
		setFood,
		getTracks,
	});

	const { addSnakeToTrack, removeSnakeFromTracks, resetSnakeTrack } = useTicks({
		moveForward,
		spawnFood,
		getAllSnakeIds,
		isGamePaused,
	});

	function nextMove() {
		moveForward(Object.keys(snakes)); // Move all the snakes available one step forward.
	}

	function prevMove() {
		console.log('Prev move!');
	}

	return (
		<div className={styles.game}>
			{/* <select value={snakeId} onChange={(e) => setSnakeId(e.target.value)}>
				{Object.keys(snakes).map((snakeId, index) => (
					<option value={snakeId} key={index}>
						{snakeId}
					</option>
				))}
			</select> */}
			<Grid snakes={snakes} food={food} showCellId={showCellId} />
		</div>
	);
});

export default Game;
