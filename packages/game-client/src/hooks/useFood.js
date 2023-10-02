import React, { useState, useEffect, useRef } from 'react';
import { generateKey, generateValue, generateRandomNumber, getSnakeCellsAsHash } from '../utils';
import { GRID_MAP } from '../computed';
import cloneDeep from 'lodash/cloneDeep';

const useFood = ({ initialFoodState = {}, getSnakes }) => {
	const [map, setMap] = useState(initialFoodState);
	const mapRef = useRef(map);

	const getFood = () => {
		return cloneDeep(mapRef.current); // Prevents users from modifiying the data.
	};

	const spawnFood = (getSnakeCells) => {
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
			setFood(x, y);
		} else {
			console.warn('Map full!');
		}
	};

	const setFood = (x, y) => {
		const key = generateKey(x, y);
		if (key in mapRef.current) {
			throw new Error('The cell you supplied is already a food.');
		} else {
			Object.assign(mapRef.current, { [key]: generateValue(x, y) });
		}
		setMap(mapRef.current);
	};

	const removeFood = (x, y) => {
		const key = generateKey(x, y);
		if (!(key in mapRef.current)) {
			throw new Error('The cell you supplied is not a food.');
		} else {
			delete mapRef.current[key];
			setMap(mapRef.current);
		}
	};

	const isFood = (x, y) => {
		const key = generateKey(x, y);
		return key in mapRef.current;
	};

	return { food: map, setFood, removeFood, isFood, spawnFood, getFood };
};

export { useFood };
