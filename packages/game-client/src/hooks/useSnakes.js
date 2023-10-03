import React, { useRef, useState } from 'react';
import { generateKey } from '../helpers';
import cloneDeep from 'lodash/cloneDeep';
import { DIRECTIONS, NUMBER_OF_ROWS, NUMBER_OF_COLUMNS, defaultDirections, FOOD_TYPES } from '../constants';

const useSnakes = ({
	initialSnakesState,
	getDirection,
	getFood,
	removeFood,
	setDirection,
	isFood,
	setFood,
	getTracks,
}) => {
	const [snakes, setSnakes] = useState(initialSnakesState);
	const snakesRef = useRef(snakes);

	const getAllSnakeIds = () => {
		const allSnakeIds = Object.keys(snakesRef.current).reduce((hash, snake) => {
			hash[snake] = {};
			return hash;
		}, {});
		return allSnakeIds;
	};

	const getSnakeCells = () => {
		// return cells that are occupied by snakes.
		return cloneDeep(
			Object.values(snakesRef.current).reduce((hash, snake) => {
				for (const key in snake.hash) {
					if (key in hash) {
						throw new Error('The snakes data is corrupt... ');
					}
				}
				Object.assign(hash, snake.hash);
				return hash;
			}, {}),
		);
	};

	const updateSnake = (snakeId, snakeData) => {
		snakesRef.current = {
			...snakesRef.current,
			[snakeId]: { ...snakesRef.current[snakeId], ...snakeData },
		};
		setSnakes({ ...snakesRef.current });
	};

	const getSnakes = () => {
		return cloneDeep(snakesRef.current);
	};

	const removeSnake = (snakeId) => {
		const removedSnake = cloneDeep(snakesRef.current[snakeId]);
		delete snakesRef.current[snakeId];
		setSnakes({ ...snakesRef.current });
		return removedSnake;
	};

	const convertSnakeToFood = (snakeId) => {
		const removedSnake = removeSnake(snakeId);
		Object.values(removedSnake.hash).forEach((cells, index) => {
			if (index % 2 === 0) {
				const { x, y } = cells;
				setFood(x, y, FOOD_TYPES.FILLET.TYPE);
			}
		});
	};

	const resetSnake = (snakeId) => {
		setDirection(snakeId, defaultDirections[snakeId]); // Set to the default initial direction.
		snakesRef.current = { ...snakesRef.current, [snakeId]: initialSnakesState[snakeId] };
		setSnakes({ ...snakesRef.current });
		for (const snakeCell of Object.values(snakesRef.current[snakeId].hash)) {
			const { x, y } = snakeCell;
			if (isFood(x, y)) {
				removeFood(x, y);
			}
		}
	};

	const moveForward = (snakeId) => {
		if (snakeId in snakesRef.current) {
			const updatedHash = { ...snakesRef.current[snakeId].hash };
			const updatedList = [...snakesRef.current[snakeId].list];

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
			if (newHeadKey in getFood()) {
				// TODO: refactor...
				const removedFood = removeFood(newHead.x, newHead.y);
				const { speed } = FOOD_TYPES[removedFood.type];
				if (speed) {
					const { addSnakeToTrack, removeSnakeFromTracks, resetSnakeTrack } = getTracks();
					addSnakeToTrack(speed, snakeId);
				}
				switch (removedFood.type) {
					case FOOD_TYPES.PROTEIN.TYPE:
						updateSnake(snakeId, { hash: updatedHash, list: updatedList });
						break;

					case FOOD_TYPES.FILLET.TYPE:
						updateSnake(snakeId, { hash: updatedHash, list: updatedList });
						break;

					case FOOD_TYPES.WALLRIDER_PORTION.TYPE:
						updateSnake(snakeId, { hash: updatedHash, list: updatedList });
						break;

					case FOOD_TYPES.REDBULL.TYPE:
						updateSnake(snakeId, { hash: updatedHash, list: updatedList });
						break;
				}
			} else if (newHeadKey in snakesRef.current[snakeId].hash) {
				// Snake collided with itself.
				convertSnakeToFood(snakeId);
			} else if (
				newHead.x < NUMBER_OF_ROWS &&
				newHead.x >= 0 &&
				newHead.y >= 0 &&
				newHead.y < NUMBER_OF_COLUMNS
			) {
				// Snake moved.
				const tailKey = updatedList.pop(); // mutates.
				delete updatedHash[tailKey];
				updateSnake(snakeId, { hash: updatedHash, list: updatedList });
			} else {
				// Snake collided with the wall...
				convertSnakeToFood(snakeId);
			}
		}
		// else {
		// 	throw new Error('The id mentioned is not in the hash!');
		// }
	};

	return { snakes, moveForward, removeSnake, resetSnake, getSnakes, getSnakeCells, getAllSnakeIds };
};

export { useSnakes };
