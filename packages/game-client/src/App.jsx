import React, { useState, useEffect, useRef } from 'react';
import { generateKey, getOppositeDirection, generateRandomNumber } from './utils';
import { DIRECTIONS, NUMBER_OF_COLUMNS, NUMBER_OF_ROWS } from './constants';
import { GRID_MAP } from './computed';
import { useFood } from './hooks';
import Grid from './Grid';

const SPEED = 1 * 100;
const FOOD_SPAWN_INTERVAL = 1 * 10;

function App() {
	// const socket = useRef();
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
	const { food, setFood, removeFood, isFood } = useFood();
	// const playerId = useRef(2);

	// Keep the direction of the snakes inside useRef since we don't
	// want to force rerender of the component when the user changes
	// the direction.
	const defaultDirections = {
		1: DIRECTIONS.DOWN,
		2: DIRECTIONS.RIGHT,
		3: DIRECTIONS.RIGHT,
		4: DIRECTIONS.RIGHT,
	};

	const directions = useRef(defaultDirections);

	// Don't keep direction of the snakes insides of useState()...
	const initialState = {
		1: {
			headColor: 'red',
			bodyColor: 'green',
			hash: {
				'0-0': { x: 0, y: 0 },
				'0-1': { x: 0, y: 1 },
				'0-2': { x: 0, y: 2 },
				'0-3': { x: 0, y: 3 },
				'0-4': { x: 0, y: 4 },
				'0-5': { x: 0, y: 5 },
				'0-6': { x: 0, y: 6 },
			},
			list: ['0-6', '0-5', '0-4', '0-3', '0-2', '0-1', '0-0'],
		},
		2: {
			headColor: 'blue',
			bodyColor: 'yellow',
			hash: {
				'5-0': { x: 5, y: 0 },
				'5-1': { x: 5, y: 1 },
				'5-2': { x: 5, y: 2 },
				'5-3': { x: 5, y: 3 },
				'5-4': { x: 5, y: 4 },
				'5-5': { x: 5, y: 5 },
				'5-6': { x: 5, y: 6 },
				'5-7': { x: 5, y: 7 },
			},
			list: ['5-7', '5-6', '5-5', '5-4', '5-3', '5-2', '5-1', '5-0'],
		},
		3: {
			headColor: 'yellow',
			bodyColor: 'red',
			hash: {
				'10-0': { x: 10, y: 0 },
				'10-1': { x: 10, y: 1 },
				'10-2': { x: 10, y: 2 },
				'10-3': { x: 10, y: 3 },
				'10-4': { x: 10, y: 4 },
				'10-5': { x: 10, y: 5 },
			},
			list: ['10-5', '10-4', '10-3', '10-2', '10-1', '10-0'],
		},
		4: {
			headColor: 'green',
			bodyColor: 'blue',
			hash: {
				'12-0': { x: 12, y: 0 },
				'12-1': { x: 12, y: 1 },
				'12-2': { x: 12, y: 2 },
				'12-3': { x: 12, y: 3 },
				'12-4': { x: 12, y: 4 },
				'12-5': { x: 12, y: 5 },
				'12-6': { x: 12, y: 6 },
			},
			list: ['12-6', '12-5', '12-4', '12-3', '12-2', '12-1', '12-0'],
		},
	};
	const [snakes, setSnakes] = useState(initialState);

	const getSnakeCells = () => {
		// return cells that are occupied by snakes.
		return Object.values(snakes).reduce((hash, snake) => {
			// TODO: check if the data is consistent here.
			Object.assign(hash, snake.hash);
			return hash;
		}, {});
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

	const getDirection = (snakeId) => {
		return directions.current[snakeId];
	};

	const moveSnakeForward = (snakeId) => {
		setSnakes((prevSnakes) => {
			const resetSnake = (snakeId) => {
				setDirection(snakeId, defaultDirections[snakeId]); // Set to the default initial direction.
				return { ...snakes, [snakeId]: initialState[snakeId] };
			};

			if (snakeId in prevSnakes) {
				const updatedHash = { ...prevSnakes[snakeId].hash };
				const updatedList = [...prevSnakes[snakeId].list];

				// Remove tail.
				const tailKey = updatedList.pop(); // mutates.
				delete updatedHash[tailKey];

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
				if (newHeadKey in prevSnakes[snakeId].hash) {
					// Snake collided with itself.
					return resetSnake(snakeId);
				} else if (
					newHead.x < NUMBER_OF_ROWS &&
					newHead.x >= 0 &&
					newHead.y >= 0 &&
					newHead.y < NUMBER_OF_COLUMNS
				) {
					// Snake moved.
					return { ...prevSnakes, [snakeId]: { ...snakes[snakeId], hash: updatedHash, list: updatedList } };
				} else {
					// Snake collided with the wall...
					return resetSnake(snakeId);
				}
			} else {
				throw new Error('The id mentioned is not in the hash!');
			}
		});
	};

	const setDirection = (snakeId, direction) => {
		directions.current[snakeId] = direction;
	};

	const up = (snakeId) => {
		const direction = getDirection(snakeId);
		if (direction == DIRECTIONS.UP) {
			// moving up only.
			return;
		} else if (getOppositeDirection(direction) !== DIRECTIONS.UP) {
			setDirection(snakeId, DIRECTIONS.UP);
		}
	};

	const down = (snakeId) => {
		const direction = getDirection(snakeId);
		if (direction == DIRECTIONS.DOWN) {
			return;
		} else if (getOppositeDirection(direction) !== DIRECTIONS.DOWN) {
			setDirection(snakeId, DIRECTIONS.DOWN);
		}
	};

	const right = (snakeId) => {
		const direction = getDirection(snakeId);
		if (direction == DIRECTIONS.RIGHT) {
			return;
		} else if (getOppositeDirection(direction) !== DIRECTIONS.RIGHT) {
			setDirection(snakeId, DIRECTIONS.RIGHT);
		}
	};

	const left = () => {
		const direction = getDirection(snakeId);
		if (direction == DIRECTIONS.LEFT) {
			return;
		} else if (getOppositeDirection(direction) !== DIRECTIONS.LEFT) {
			setDirection(snakeId, DIRECTIONS.LEFT);
		}
	};

	useEffect(() => {
		const timer = setInterval(() => {
			moveSnakeForward(snakeId);
			moveSnakeForward(snakeId + 1);
			moveSnakeForward(snakeId + 2);
			moveSnakeForward(snakeId + 3);
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
		<div>
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
