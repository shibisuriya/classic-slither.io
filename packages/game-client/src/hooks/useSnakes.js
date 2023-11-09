import React, { useRef, useState } from 'react';
import { generateKey, isCellValid } from '../helpers';
import cloneDeep from 'lodash/cloneDeep';
import { DIRECTIONS, FOOD_EFFECTS, defaultDirections, FOOD_TYPES } from '../constants';

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
	const [snakes, setSnakes] = useState(cloneDeep(initialSnakesState));
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
					} else {
						Object.assign(hash, { [key]: snake.hash[key] });
					}
				}
				return hash;
			}, {}),
		);
	};

	const getSnakes = () => {
		return cloneDeep(snakesRef.current);
	};

	const removeSnake = (snakeId) => {
		const { removeSnakeFromTracks } = getTracks();
		removeSnakeFromTracks(snakeId);

		const removedSnake = cloneDeep(snakesRef.current[snakeId]);
		delete snakesRef.current[snakeId];
		return removedSnake;
	};

	const convertSnakeToFood = (snakeId) => {
		const removedSnake = removeSnake(snakeId);
		Object.values(removedSnake.hash).forEach((cells, index) => {
			if (index % 2 === 0) {
				const { x, y } = cells;
				if (!(generateKey(x, y) in getSnakeCells())) {
					// Can't spawn a food piece if there is already a snake there.
					setFood(x, y, FOOD_TYPES.FILLET.TYPE);
				}
			}
		});
	};

	const resetSnake = (snakeId) => {
		setDirection(snakeId, defaultDirections[snakeId]); // Set to the default initial direction.
		snakesRef.current = { ...snakesRef.current, [snakeId]: cloneDeep(initialSnakesState[snakeId]) };
		setSnakes({ ...snakesRef.current });
		for (const snakeCell of Object.values(snakesRef.current[snakeId].hash)) {
			const { x, y } = snakeCell;
			if (isFood(x, y)) {
				removeFood(x, y);
			}
		}
	};

	const getSnakeWithoutTail = (snakeId) => {
		return snakesRef.current[snakeId].list.slice(0, -1).reduce((hash, key) => {
			hash[key] = snakesRef.current[snakeId].hash[key];
			return hash;
		}, {});
	};

	const moveForward = (snakes) => {
		for (const snakeId of snakes) {
			if (snakeId in snakesRef.current) {
				const list = snakesRef.current[snakeId].list;
				const hash = snakesRef.current[snakeId].hash;

				const [headKey] = list;
				const head = hash[headKey];
				const direction = getDirection(snakeId);

				let newHead;
				if (direction == DIRECTIONS.RIGHT) {
					newHead = { x: head.x, y: head.y + 1 };
				} else if (direction == DIRECTIONS.UP) {
					newHead = { x: head.x - 1, y: head.y };
				} else if (direction == DIRECTIONS.DOWN) {
					newHead = { x: head.x + 1, y: head.y };
				} else if (direction == DIRECTIONS.LEFT) {
					newHead = { x: head.x, y: head.y - 1 };
				} else {
					throw new Error('Invalid direction.');
				}

				const newHeadKey = generateKey(newHead.x, newHead.y, true); // Skip validation, since the snake could have hit a wall.

				if (!isCellValid(newHead.x, newHead.y) || newHeadKey in getSnakeWithoutTail(snakeId)) {
					// 1. The snake has collided with the wall.
					// 2. The snake has collided with itself, check after removing the snake's tail since for the next
					//    move to happen the tail would get removed.
					convertSnakeToFood(snakeId);
				} else {
					snakesRef.current[snakeId].list.unshift(newHeadKey);
					snakesRef.current[snakeId].hash[newHeadKey] = newHead;

					// Remove the tail to make it look like the snake has moved forward.
					const tailKey = snakesRef.current[snakeId].list.pop(); // mutates.
					delete snakesRef.current[snakeId].hash[tailKey];
				}
			} else {
				throw new Error('The id mentioned is not in the hash!');
			}
		}

		// I understand that there are multiple loops in this method, and this method can be optimized
		// futher,  but it is for the greater good, it will
		// allow us to isolate logic errors faster when we hook the client to a websocket / webrtc connection.

		const snakesToRemove = [];

		for (let i = 0; i < Object.keys(snakesRef.current).length - 1; i++) {
			for (let j = i + 1; j < Object.keys(snakesRef.current).length; j++) {
				const s1 = Object.keys(snakesRef.current)[i];
				const s2 = Object.keys(snakesRef.current)[j];

				const {
					hash: hash1,
					list: [h1],
				} = snakesRef.current[s1];

				const {
					hash: hash2,
					list: [h2],
				} = snakesRef.current[s2];

				let bothSnakesRemoved = false;
				if (h1 in hash2) {
					if (h1 == h2) {
						// Head to head collision remove both snakes.
						snakesToRemove.push(s1, s2);
						if (isFood(hash2[h1].x, hash2[h1].y)) {
							removeFood(hash2[h1].x, hash2[h1].y);
						}
						bothSnakesRemoved = true;
					} else {
						// remove snake 1
						snakesToRemove.push(s1);
					}
				}

				if (!bothSnakesRemoved) {
					if (h2 in hash1) {
						snakesToRemove.push(s2);
					}
				}
			}
		}

		for (const snakeToRemove of snakesToRemove) {
			convertSnakeToFood(snakeToRemove);
		}

		// We can use getSnakeCells() after this point... Since common cells are removed.
		// It won't throw error...

		for (const snakeId of Object.keys(snakesRef.current)) {
			const { list, hash } = snakesRef.current[snakeId];
			const [newHeadKey] = list;
			if (newHeadKey in getFood()) {
				const newHead = hash[newHeadKey];
				const removedFood = removeFood(newHead.x, newHead.y);
				const { effects } = FOOD_TYPES[removedFood.type];
				for (const [key, value] of Object.entries(effects)) {
					switch (key) {
						case FOOD_EFFECTS.SPEED:
							const { addSnakeToTrack } = getTracks();
							const { tick, lastsFor } = value;
							addSnakeToTrack({ tick, snakeId, lastsFor });
							break;
						case FOOD_EFFECTS.GROW:
							const { units } = value;
							for (let i = 0; i < units; i++) {
								// Add cells to the snake from the tail.
								const penultimateKey = list[list.length - 2];
								const tailKey = list[list.length - 1];
								const { x: x2, y: y2 } = hash[tailKey];
								const { x: x1, y: y1 } = hash[penultimateKey];
								let newTail;
								let newTailKey;
								if (x1 - x2 === 1 && y2 - y1 === 0) {
									// up
									newTail = { x: x2 - 1, y: y1 };
									newTailKey = generateKey(newTail.x, newTail.y, true); // Skip validation
								} else if (x1 - x2 === -1 && y2 - y1 === 0) {
									// down
									newTail = { x: x2 + 1, y: y1 };
									newTailKey = generateKey(newTail.x, newTail.y, true);
								} else if (y1 - y2 === 1 && x2 - x1 === 0) {
									// right
									newTail = { x: x1, y: y2 - 1 };
									newTailKey = generateKey(newTail.x, newTail.y, true);
								} else if (y1 - y2 === -1 && x2 - x1 === 0) {
									// left
									newTail = { x: x1, y: y2 + 1 };
									newTailKey = generateKey(newTail.x, newTail.y, true);
								} else {
									throw new Error("Snake's data is corrupt!, unable to find the direction.");
								}

								// Now that we know the new tail, decide wheather to add it to the snake or not.
								// Don't add tail if,
								// 1) Is part of the wall.
								// 2) Is part of self.
								// 3) Is part of an opponent.

								const addTail = () => {
									snakesRef.current[snakeId].list.push(newTailKey);
									snakesRef.current[snakeId].hash[newTailKey] = newTail;
								};

								if (newTailKey in getFood()) {
									// Remove the food if the added tail is occupied by the
									// food.
									removeFood(newTail.x, newTail.y);
									addTail();
								} else if (isCellValid(newTail.x, newTail.y) && !(newTail in getSnakeCells())) {
									addTail();
								} else {
									// The cell before the tail cell is already occupied by either,
									// the opponent, self or the wall... So break out of the loop, can't
									// add any cells further.
									break;
								}
							}
							break;
					}
				}
			}
		}

		setSnakes({ ...snakesRef.current });
	};

	return { snakes, moveForward, removeSnake, resetSnake, getSnakes, getSnakeCells, getAllSnakeIds };
};

export { useSnakes };
