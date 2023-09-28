import React, { useState, useEffect, useRef } from 'react';
import { generateKey } from './utils';
import Grid from './Grid';

const SPEED = 1 * 100;

const DIRECTION = {
	UP: 'up',
	DOWN: 'down',
	LEFT: 'left',
	RIGHT: 'right',
};

function App() {
	const [currentDirection, setCurrentDirection] = useState(DIRECTION.RIGHT);

	function moveForward() {
		setSnake((prevSnake) => {
			const updatedHash = { ...prevSnake.hash };
			const updatedList = [...prevSnake.list];

			// Remove tail.
			const tailKey = updatedList.pop(); // mutates.
			delete updatedHash[tailKey];

			// Create new head using prev head.
			const [headKey] = updatedList;
			const head = updatedHash[headKey];

			if (currentDirection == DIRECTION.RIGHT) {
				const newHead = { x: head.x, y: head.y + 1 };
				const newHeadKey = generateKey(newHead.x, newHead.y);
				updatedHash[newHeadKey] = newHead;
				updatedList.unshift(newHeadKey);
			} else if (currentDirection == DIRECTION.UP) {
				const newHead = { x: head.x - 1, y: head.y };
				const newHeadKey = generateKey(newHead.x, newHead.y);
				updatedHash[newHeadKey] = newHead;
				updatedList.unshift(newHeadKey);
			} else if (currentDirection == DIRECTION.DOWN) {
				const newHead = { x: head.x + 1, y: head.y };
				const newHeadKey = generateKey(newHead.x, newHead.y);
				updatedHash[newHeadKey] = newHead;
				updatedList.unshift(newHeadKey);
			} else if (currentDirection == DIRECTION.LEFT) {
				const newHead = { x: head.x, y: head.y - 1 };
				const newHeadKey = generateKey(newHead.x, newHead.y);
				updatedHash[newHeadKey] = newHead;
				updatedList.unshift(newHeadKey);
			}

			return { hash: updatedHash, list: updatedList };
		});
	}

	const up = () => {
		setCurrentDirection(DIRECTION.UP);
	};

	const down = () => {
		setCurrentDirection(DIRECTION.DOWN);
	};

	const right = () => {
		setCurrentDirection(DIRECTION.RIGHT);
	};

	const left = () => {
		setCurrentDirection(DIRECTION.LEFT);
	};

	useEffect(() => {
		const timer = setInterval(moveForward, SPEED);

		document.addEventListener('keydown', (event) => {
			const key = event.key.toLowerCase();
			if (['w', 'arrowup'].includes(key)) {
				up();
			} else if (['s', 'arrowdown'].includes(key)) {
				down();
			} else if (['a', 'arrowleft'].includes(key)) {
				left();
			} else if (['d', 'arrowright'].includes(key)) {
				right();
			}
		});

		return () => {
			clearInterval(timer);
		};
	}, [currentDirection, snake]);

	// snake is based on the ordered hashmap data structure.
	const [snake, setSnake] = useState({
		hash: {
			'0-0': { x: 0, y: 0 },
			'0-1': { x: 0, y: 1 },
			'0-2': { x: 0, y: 2 },
			'0-3': { x: 0, y: 3 },
		},
		list: ['0-3', '0-2', '0-1', '0-0'],
	});

	return (
		<div>
			<Grid snake={snake} />
		</div>
	);
}

export default App;
