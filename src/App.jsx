import React, { useState, useEffect, useRef } from 'react';
import useOrderedHash from './hooks/useOrderedHash';
import { generateKey } from './utils';
import Grid from './Grid';

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
			const [head] = updatedList;
			const tailKey = updatedList.pop(); // mutates.
			delete updatedHash[tailKey];
			const { x, y } = updatedHash[head];

			if (currentDirection == DIRECTION.UP) {
				const newHead = { x: x - 1, y };
				updatedHash[generateKey(newHead.x, newHead.y)] = newHead;
				updatedList.unshift(newHead);
				return { hash: updatedHash, list: updatedList };
			} else if (currentDirection == DIRECTION.DOWN) {
				const newHead = { x: x - 1, y };
				return { hash: updatedHash, list: updatedList };
			} else if (currentDirection == DIRECTION.LEFT) {
				const newHead = { x: x - 1, y };
				return { hash: updatedHash, list: updatedList };
			} else if (currentDirection == DIRECTION.RIGHT) {
				const newHead = { x: x, y: y + 1 };
				const newHeadKey = generateKey(newHead.x, newHead.y);
				updatedHash[newHeadKey] = newHead;
				updatedList.unshift(newHeadKey);
				return { hash: updatedHash, list: updatedList };
			}
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
		const timer = setInterval(moveForward, 1 * 1000);

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
