import React, { useState, useEffect, useRef } from 'react';
import { generateRandomNumber } from '../utils';
import { generateKey, generateValue } from '../helpers';
import { GRID_MAP } from '../computed';
import cloneDeep from 'lodash/cloneDeep';
import { FOOD_TYPES } from '../constants';

const whichFoodToSpawn = () => {
	const percentage = Object.values(FOOD_TYPES).reduce((total, { chance }) => {
		total += chance;
		return total;
	}, 0);
	if (percentage != 100) {
		throw new Error('The sum of all chances should be 100.');
	}
	const randomNumber = generateRandomNumber(100) + 1; // Since it will generate a random number between 0 to 99, 100 is not included, I added 1.
	let cumulativeChance = 0;
	for (const key in FOOD_TYPES) {
		cumulativeChance += FOOD_TYPES[key].chance;
		if (randomNumber < cumulativeChance) {
			return FOOD_TYPES[key];
		}
	}
	// TODO: There is something wrong with this function, returning undefined sometimes.
	return FOOD_TYPES.FROG;
};

const useFood = ({ initialFoodState = {}, getSnakeCells }) => {
	const [map, setMap] = useState(initialFoodState);
	const mapRef = useRef(map);

	const getFood = () => {
		return cloneDeep(mapRef.current); // Prevents users from modifiying the data.
	};

	const spawnFood = () => {
		const snakeCells = getSnakeCells();
		const emptyCells = {};

		for (const [key, value] of Object.entries(GRID_MAP)) {
			if (!(key in snakeCells) && !(key in mapRef.current)) {
				Object.assign(emptyCells, { [key]: value });
			}
		}
		const keys = Object.keys(emptyCells);
		if (keys.length > 0) {
			const randomEmptyCell = emptyCells[keys[generateRandomNumber(keys.length)]];
			const { x, y } = randomEmptyCell;
			setFood(x, y, whichFoodToSpawn().TYPE);
		} else {
			console.warn('Map full!');
		}
	};

	const setFood = (x, y, type) => {
		if (!type) {
			throw new Error('Please mention the food type that needs to be added to the map!');
		}
		const key = generateKey(x, y);
		if (key in mapRef.current) {
			throw new Error('The cell you supplied is already a food.');
		} else {
			Object.assign(mapRef.current, { [key]: { ...generateValue(x, y), type } });
		}
		setMap({ ...mapRef.current });
	};

	const removeFood = (x, y) => {
		const key = generateKey(x, y);
		if (!(key in mapRef.current)) {
			throw new Error('The cell you supplied is not a food.');
		} else {
			const removedFood = cloneDeep(mapRef.current[key]);
			delete mapRef.current[key];
			setMap({ ...mapRef.current });
			return removedFood;
		}
	};

	const isFood = (x, y) => {
		const key = generateKey(x, y);
		return key in mapRef.current;
	};

	return { food: map, setFood, removeFood, isFood, spawnFood, getFood };
};

export { useFood };
