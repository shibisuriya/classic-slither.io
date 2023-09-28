import React, { useState, useEffect, useRef } from 'react';
import { generateKey, getOppositeDirection } from './utils';
import { DIRECTIONS, NUMBER_OF_COLUMNS, NUMBER_OF_ROWS, DEFAULT_DIRECTION } from './constants';
import Grid from './Grid';

const SPEED = 1 * 100;

function App() {
	const currentDirection = useRef(DIRECTIONS.RIGHT);

	const initialState = {
		hash: {
			'0-0': { x: 0, y: 0 },
			'0-1': { x: 0, y: 1 },
			'0-2': { x: 0, y: 2 },
			'0-3': { x: 0, y: 3 },
		},
		list: ['0-3', '0-2', '0-1', '0-0'],
	};
	const [snake, setSnake] = useState(initialState);

	const resetSnake = () => {
		currentDirection.current = DEFAULT_DIRECTION;
		setSnake(initialState);
	};

	function moveForward() {
		const updatedHash = { ...snake.hash };
		const updatedList = [...snake.list];

		// Remove tail.
		const tailKey = updatedList.pop(); // mutates.
		delete updatedHash[tailKey];

		// Create new head using prev head.
		const [headKey] = updatedList;
		const head = updatedHash[headKey];

		let newHead;
		if (currentDirection.current == DIRECTIONS.RIGHT) {
			newHead = { x: head.x, y: head.y + 1 };
			const newHeadKey = generateKey(newHead.x, newHead.y);
			updatedHash[newHeadKey] = newHead;
			updatedList.unshift(newHeadKey);
		} else if (currentDirection.current == DIRECTIONS.UP) {
			newHead = { x: head.x - 1, y: head.y };
			const newHeadKey = generateKey(newHead.x, newHead.y);
			updatedHash[newHeadKey] = newHead;
			updatedList.unshift(newHeadKey);
		} else if (currentDirection.current == DIRECTIONS.DOWN) {
			newHead = { x: head.x + 1, y: head.y };
			const newHeadKey = generateKey(newHead.x, newHead.y);
			updatedHash[newHeadKey] = newHead;
			updatedList.unshift(newHeadKey);
		} else if (currentDirection.current == DIRECTIONS.LEFT) {
			newHead = { x: head.x, y: head.y - 1 };
			const newHeadKey = generateKey(newHead.x, newHead.y);
			updatedHash[newHeadKey] = newHead;
			updatedList.unshift(newHeadKey);
		}
		if (newHead.x < NUMBER_OF_ROWS && newHead.x >= 0 && newHead.y >= 0 && newHead.y < NUMBER_OF_COLUMNS) {
			setSnake({ hash: updatedHash, list: updatedList });
		} else {
			resetSnake();
		}
	}

	const moveUp = () => {
		if (currentDirection.current == DIRECTIONS.UP) {
			// moving up only.
			return;
		} else if (getOppositeDirection(currentDirection.current) !== DIRECTIONS.UP) {
			currentDirection.current = DIRECTIONS.UP;
		}
	};

	const moveDown = () => {
		if (currentDirection.current == DIRECTIONS.DOWN) {
			return;
		} else if (getOppositeDirection(currentDirection.current) !== DIRECTIONS.DOWN) {
			currentDirection.current = DIRECTIONS.DOWN;
		}
	};

	const moveRight = () => {
		if (currentDirection.current == DIRECTIONS.RIGHT) {
			return;
		} else if (getOppositeDirection(currentDirection.current) !== DIRECTIONS.RIGHT) {
			currentDirection.current = DIRECTIONS.RIGHT;
		}
	};

	const moveLeft = () => {
		if (currentDirection.current == DIRECTIONS.LEFT) {
			return;
		} else if (getOppositeDirection(currentDirection.current) !== DIRECTIONS.LEFT) {
			currentDirection.current = DIRECTIONS.LEFT;
		}
	};

	useEffect(() => {
		const timer = setInterval(moveForward, SPEED);

		document.addEventListener('keydown', (event) => {
			const key = event.key.toLowerCase();
			if (['w', 'arrowup'].includes(key)) {
				moveUp();
			} else if (['s', 'arrowdown'].includes(key)) {
				moveDown();
			} else if (['a', 'arrowleft'].includes(key)) {
				moveLeft();
			} else if (['d', 'arrowright'].includes(key)) {
				moveRight();
			}
		});

		return () => {
			clearInterval(timer);
		};
	}, [snake]);

	return (
		<div>
			<Grid snake={snake} />
		</div>
	);
}

export default App;
