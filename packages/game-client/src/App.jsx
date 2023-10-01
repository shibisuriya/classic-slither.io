import React, { useState, useEffect } from 'react';
import { generateKey, getOppositeDirection, generateRandomNumber } from './utils';
import { NUMBER_OF_COLUMNS, NUMBER_OF_ROWS, DIRECTIONS, defaultDirections } from './constants';
import { GRID_MAP, initialSnakesState } from './computed';
import { useDirection, useFood, useTicks } from './hooks';
import Grid from './Grid';
import styles from './app.module.css';

const SPEED = 1 * 100;
const FOOD_SPAWN_INTERVAL = 1 * 1000;

function App() {
	// const socket = useRef();
	useTicks();
	useEffect(() => {
		// For now I am going to be using a simple websocket server for
		// developer & testing purposes.
		// const { hostname, port } = window.location;
		// const WS_PORT = 8085;
		// socket.current = new WebSocket(`ws://${hostname}:${WS_PORT}`);
		// socket.current.addEventListener('open', (event) => {
		// 	console.log('WebSocket connection opened:', event);
		// });
		// socket.current.addEventListener('message', (event) => {
		// 	const message = event.data;
		// 	console.log('message -> ', message);
		// });
		// socket.current.addEventListener('close', (event) => {
		// 	console.log('WebSocket connection closed:', event);
		// });
		// socket.current.addEventListener('error', (event) => {
		// 	console.error('WebSocket error:', event);
		// });
		// return () => {
		// 	// Disconnect...
		// 	if (socket.current) {
		// 		socket.current.close();
		// 	}
		// };
	}, []);

	const [snakeId, setSnakeId] = useState(1);
	const { food, setFood, removeFood } = useFood();
	// const playerId = useRef(2);

	// Keep the direction of the snakes inside useRef since we don't
	// want to force rerender of the component when the user changes
	// the direction.

	const { getDirection, setDown, setLeft, setRight, setUp, setDirection } = useDirection(defaultDirections);

	// Don't keep direction of the snakes insides of useState()...
	const [snakes, setSnakes] = useState(initialSnakesState);

	const getSnakeCells = () => {
		// return cells that are occupied by snakes.
		return Object.values(snakes).reduce((hash, snake) => {
			// TODO: check if the data is consistent here.
			Object.assign(hash, snake.hash);
			return hash;
		}, {});
	};

	const removeSnake = (snakeId, prevSnakes) => {
		const snakes = { ...prevSnakes };
		delete snakes[snakeId];
		return snakes;
	};

	const spawnFood = () => {
		const snakeCells = getSnakeCells();
		const emptyCells = {};

		for (const [key, value] of Object.entries(GRID_MAP)) {
			if (!(key in snakeCells) && !(key in food)) {
				Object.assign(emptyCells, { [key]: value });
			}
		}
		const keys = Object.keys(emptyCells);
		if (keys.length > 0) {
			const randomEmptyCell = emptyCells[keys[generateRandomNumber(keys.length)]];
			const { x, y } = randomEmptyCell;
			setFood(x, y);
		}
	};

	useEffect(() => {
		const timer = setInterval(spawnFood, FOOD_SPAWN_INTERVAL);
		return () => {
			clearInterval(timer);
		};
	}, [food]);

	const moveSnakeForward = (snakeId) => {
		setSnakes((prevSnakes) => {
			const resetSnake = (snakeId) => {
				debugger;
				setDirection(snakeId, defaultDirections[snakeId]); // Set to the default initial direction.
				return { ...snakes, [snakeId]: initialSnakesState[snakeId] };
			};

			if (snakeId in prevSnakes) {
				const updatedHash = { ...prevSnakes[snakeId].hash };
				const updatedList = [...prevSnakes[snakeId].list];

				// Create new head using prev head.
				const [headKey] = updatedList;
				const head = updatedHash[headKey];

				const direction = getDirection(snakeId);

				let newHead;
				let newHeadKey;
				if (direction == DIRECTIONS.RIGHT) {
					newHead = { x: head.x, y: head.y + 1 };
					newHeadKey = generateKey(newHead.x, newHead.y);
					updatedHash[newHeadKey] = newHead;
					updatedList.unshift(newHeadKey);
				} else if (direction == DIRECTIONS.UP) {
					newHead = { x: head.x - 1, y: head.y };
					newHeadKey = generateKey(newHead.x, newHead.y);
					updatedHash[newHeadKey] = newHead;
					updatedList.unshift(newHeadKey);
				} else if (direction == DIRECTIONS.DOWN) {
					newHead = { x: head.x + 1, y: head.y };
					newHeadKey = generateKey(newHead.x, newHead.y);
					updatedHash[newHeadKey] = newHead;
					updatedList.unshift(newHeadKey);
				} else if (direction == DIRECTIONS.LEFT) {
					newHead = { x: head.x, y: head.y - 1 };
					newHeadKey = generateKey(newHead.x, newHead.y);
					updatedHash[newHeadKey] = newHead;
					updatedList.unshift(newHeadKey);
				}

				// Remove tail.
				if (newHeadKey in food) {
					removeFood(newHead.x, newHead.y);
					return { ...prevSnakes, [snakeId]: { ...snakes[snakeId], hash: updatedHash, list: updatedList } };
				} else if (newHeadKey in prevSnakes[snakeId].hash) {
					// Snake collided with itself.
					return resetSnake(snakeId, prevSnakes);
				} else if (
					newHead.x < NUMBER_OF_ROWS &&
					newHead.x >= 0 &&
					newHead.y >= 0 &&
					newHead.y < NUMBER_OF_COLUMNS
				) {
					// Snake moved.
					const tailKey = updatedList.pop(); // mutates.
					delete updatedHash[tailKey];
					return { ...prevSnakes, [snakeId]: { ...snakes[snakeId], hash: updatedHash, list: updatedList } };
				} else {
					// Snake collided with the wall...
					return resetSnake(snakeId, prevSnakes);
				}
			} else {
				throw new Error('The id mentioned is not in the hash!');
			}
		});
	};

	const up = (snakeId) => {
		const direction = getDirection(snakeId);
		if (direction == DIRECTIONS.UP) {
			// moving up only.
			return;
		} else if (getOppositeDirection(direction) !== DIRECTIONS.UP) {
			setUp(snakeId);
		}
	};

	const down = (snakeId) => {
		const direction = getDirection(snakeId);
		if (direction == DIRECTIONS.DOWN) {
			return;
		} else if (getOppositeDirection(direction) !== DIRECTIONS.DOWN) {
			setDown(snakeId);
		}
	};

	const right = (snakeId) => {
		const direction = getDirection(snakeId);
		if (direction == DIRECTIONS.RIGHT) {
			return;
		} else if (getOppositeDirection(direction) !== DIRECTIONS.RIGHT) {
			setRight(snakeId);
		}
	};

	const left = () => {
		const direction = getDirection(snakeId);
		if (direction == DIRECTIONS.LEFT) {
			return;
		} else if (getOppositeDirection(direction) !== DIRECTIONS.LEFT) {
			setLeft(snakeId);
		}
	};

	useEffect(() => {
		const timer = setInterval(() => {
			Object.keys(snakes).forEach((snakeId) => {
				moveSnakeForward(snakeId);
			});
		}, SPEED);
		const abortController = new AbortController();

		// Can only change the direction, won't make the snake move in
		// a particular direction.
		document.addEventListener(
			'keydown',
			(event) => {
				const key = event.key.toLowerCase();
				if (['w', 'arrowup'].includes(key)) {
					up(snakeId);
				} else if (['s', 'arrowdown'].includes(key)) {
					down(snakeId);
				} else if (['a', 'arrowleft'].includes(key)) {
					left(snakeId);
				} else if (['d', 'arrowright'].includes(key)) {
					right(snakeId);
				}
			},
			{ signal: abortController.signal },
		);

		return () => {
			abortController.abort();
			clearInterval(timer);
		};
	}, [snakes]);

	return (
		<div className={styles.game}>
			<select value={snakeId} onChange={(e) => setSnakeId(e.target.value)}>
				{Object.keys(snakes).map((snakeId, index) => (
					<option value={snakeId} key={index}>
						{snakeId}
					</option>
				))}
			</select>
			<Grid snakes={snakes} food={food} />
		</div>
	);
}

export default App;
