import React, { useState, useEffect, useRef } from 'react';
import { generateKey, getOppositeDirection } from './utils';
import { DIRECTIONS } from './constants';
import Grid from './Grid';

const SPEED = 1 * 100;

function App() {
	const currentDirection = useRef(DIRECTIONS.RIGHT);
	const [snake, setSnake] = useState({
		// snake is based on the ordered hashmap data structure.
		hash: {
			'0-0': { x: 0, y: 0 },
			'0-1': { x: 0, y: 1 },
			'0-2': { x: 0, y: 2 },
			'0-3': { x: 0, y: 3 },
		},
		list: ['0-3', '0-2', '0-1', '0-0'],
	});

	function moveForward() {
		console.log(snake.list[0], ' ', Date.now());
		setSnake((prevSnake) => {
			const updatedHash = { ...prevSnake.hash };
			const updatedList = [...prevSnake.list];

			// Remove tail.
			const tailKey = updatedList.pop(); // mutates.
			delete updatedHash[tailKey];

			// Create new head using prev head.
			const [headKey] = updatedList;
			const head = updatedHash[headKey];

			if (currentDirection.current == DIRECTIONS.RIGHT) {
				const newHead = { x: head.x, y: head.y + 1 };
				const newHeadKey = generateKey(newHead.x, newHead.y);
				updatedHash[newHeadKey] = newHead;
				updatedList.unshift(newHeadKey);
			} else if (currentDirection.current == DIRECTIONS.UP) {
				const newHead = { x: head.x - 1, y: head.y };
				const newHeadKey = generateKey(newHead.x, newHead.y);
				updatedHash[newHeadKey] = newHead;
				updatedList.unshift(newHeadKey);
			} else if (currentDirection.current == DIRECTIONS.DOWN) {
				const newHead = { x: head.x + 1, y: head.y };
				const newHeadKey = generateKey(newHead.x, newHead.y);
				updatedHash[newHeadKey] = newHead;
				updatedList.unshift(newHeadKey);
			} else if (currentDirection.current == DIRECTIONS.LEFT) {
				const newHead = { x: head.x, y: head.y - 1 };
				const newHeadKey = generateKey(newHead.x, newHead.y);
				updatedHash[newHeadKey] = newHead;
				updatedList.unshift(newHeadKey);
			}

			return { hash: updatedHash, list: updatedList };
		});
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
