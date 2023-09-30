import { useState } from 'react';
import { generateKey, generateValue } from '../utils';

const useFood = (initialState = {}) => {
	const [map, setMap] = useState(initialState);

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

	return { food: map, setFood, removeFood, isFood };
};

export { useFood };
