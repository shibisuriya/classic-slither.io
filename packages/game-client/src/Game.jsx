import React, { Fragment, useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { allSnakesSelectOption, defaultDirections } from './constants';
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
	const { showCellId, isGamePaused, updateSnakeIdList, updateDirectionList } = props;
	const [snakeId, setSnakeId] = useState(1);

	// Keep the direction of the snakes inside useRef since we don't
	// want to force rerender of the component when the user changes
	// the direction.
	const { getDirection, onLeft, onRight, onUp, onDown, setDirection, directions } = useDirection(
		defaultDirections,
		1,
	);

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

	useEffect(() => {
		updateSnakeIdList(
			Object.entries(snakes).map(([key, value]) => {
				const { bodyColor, headColor } = value;
				return { id: key, bodyColor, headColor };
			}),
		);
	}, [snakes]);

	useEffect(() => {
		updateDirectionList(directions);
	}, [directions]);

	const { addSnakeToTrack, removeSnakeFromTracks, resetSnakeTrack } = useTicks({
		moveForward,
		spawnFood,
		getAllSnakeIds,
		isGamePaused,
	});

	function nextMove(snakeId = allSnakesSelectOption.id) {
		if (snakeId) {
			moveForward(snakeId === allSnakesSelectOption.id ? Object.keys(snakes) : [snakeId]); // Move all the snakes available one step forward.
		}
	}

	function prevMove() {
		console.log('Prev move!');
	}

	useImperativeHandle(
		ref,
		() => {
			return {
				nextMove,
				prevMove,
				spawnFood,
				setDirection,
			};
		},
		[],
	);

	return (
		<Fragment>
			<div className={styles.game}>
				<Grid snakes={snakes} food={food} showCellId={showCellId} />
			</div>
		</Fragment>
	);
});

export default Game;
