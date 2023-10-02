import React, { useState, useEffect } from 'react';
import { generateKey, generateValue, generateRandomNumber, getSnakeCellsAsHash } from '../utils';
import { GRID_MAP } from '../computed';

const useFood = ({ initialFoodState = {} }) => {
	const [map, setMap] = useState(initialFoodState);

	const spawnFood = ({ snakes }) => {
		const snakeCells = getSnakeCellsAsHash(snakes);
		const emptyCells = {};

		for (const [key, value] of Object.entries(GRID_MAP)) {
			if (!(key in snakeCells) && !(key in map)) {
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

	const setFood = (x, y) => {
		setMap((prevMap) => {
			const key = generateKey(x, y);
			if (key in prevMap) {
				throw new Error('The cell you supplied is already a food.');
			}
			return { ...prevMap, [key]: generateValue(x, y) };
		});
	};

	const removeFood = (x, y) => {
		setMap((prevMap) => {
			const key = generateKey(x, y);
			if (!(key in prevMap)) {
				throw new Error('The cell you supplied is not a food.');
			}
			const food = { ...prevMap };
			delete food[key];
			return food;
		});
	};

	const isFood = (x, y) => {
		const key = generateKey(x, y);
		return key in map;
	};

	return { food: map, setFood, removeFood, isFood, spawnFood };
};

export { useFood };
