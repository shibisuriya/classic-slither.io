import React, { useState } from 'react';
import { generateKey } from '../utils';
import { DIRECTIONS, NUMBER_OF_ROWS, NUMBER_OF_COLUMNS, defaultDirections } from '../constants';

const useSnakes = ({ initialSnakesState, getDirection, food, removeFood, setDirection }) => {
	const [snakes, setSnakes] = useState(initialSnakesState);

	const removeSnake = (snakeId, prevSnakes) => {
		const snakes = { ...prevSnakes };
		delete snakes[snakeId];
		return snakes;
	};

	const resetSnake = (snakeId, snakes) => {
		setDirection(snakeId, defaultDirections[snakeId]); // Set to the default initial direction.
		return { ...snakes, [snakeId]: initialSnakesState[snakeId] };
	};

	const updateSnake = ({ snakes, food }) => {
		const snakeId = 1;
		setSnakes((prevSnakes) => {
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
					return {
						...prevSnakes,
						[snakeId]: { ...snakes[snakeId], hash: updatedHash, list: updatedList },
					};
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
					return {
						...prevSnakes,
						[snakeId]: { ...snakes[snakeId], hash: updatedHash, list: updatedList },
					};
				} else {
					// Snake collided with the wall...
					return resetSnake(snakeId, prevSnakes);
				}
			} else {
				throw new Error('The id mentioned is not in the hash!');
			}
		});
	};

	return { snakes, updateSnake, removeSnake, resetSnake };
};

export { useSnakes };
