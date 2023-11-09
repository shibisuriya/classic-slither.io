import { NUMBER_OF_COLUMNS, NUMBER_OF_ROWS } from './constants';
import { generateKey, generateValue, isCellValid } from './helpers';

const generateGridMap = () => {
	const hash = {};
	for (let i = 0; i < NUMBER_OF_ROWS; i++) {
		for (let j = 0; j < NUMBER_OF_COLUMNS; j++) {
			hash[generateKey(i, j)] = generateValue(i, j);
		}
	}
	return hash;
};

const GRID_MAP = generateGridMap();

const initialSnakesState = {
	1: {
		headColor: '#264653',
		bodyColor: '#e9c46a',
		hash: {
			'0-0': { x: 0, y: 0 },
			'0-1': { x: 0, y: 1 },
			'0-2': { x: 0, y: 2 },
			'0-3': { x: 0, y: 3 },
			'0-4': { x: 0, y: 4 },
			'0-5': { x: 0, y: 5 },
			'0-6': { x: 0, y: 6 },
		},
		list: ['0-6', '0-5', '0-4', '0-3', '0-2', '0-1', '0-0'],
	},
	2: {
		headColor: 'blue',
		bodyColor: 'purple',
		hash: {
			'0-11': { x: 0, y: 11 },
			'0-12': { x: 0, y: 12 },
		},
		list: ['0-11', '0-12'],
	},
	3: {
		headColor: 'yellow',
		bodyColor: 'red',
		hash: {
			'10-0': { x: 10, y: 0 },
			'10-1': { x: 10, y: 1 },
			'10-2': { x: 10, y: 2 },
			'10-3': { x: 10, y: 3 },
			'10-4': { x: 10, y: 4 },
			'10-5': { x: 10, y: 5 },
		},
		list: ['10-5', '10-4', '10-3', '10-2', '10-1', '10-0'],
	},
	4: {
		headColor: 'green',
		bodyColor: 'blue',
		hash: {
			'12-0': { x: 12, y: 0 },
			'12-1': { x: 12, y: 1 },
			'12-2': { x: 12, y: 2 },
			'12-3': { x: 12, y: 3 },
			'12-4': { x: 12, y: 4 },
			'12-5': { x: 12, y: 5 },
			'12-6': { x: 12, y: 6 },
		},
		list: ['12-6', '12-5', '12-4', '12-3', '12-2', '12-1', '12-0'],
	},
};

// TODO: Move this logic into a unit test later.

Object.values(initialSnakesState).forEach((snake) => {
	const { hash, list } = snake;
	for (const cell of list) {
		if (!(cell in hash)) {
			throw new Error('Snake initial data is corrupt! list and hash are not in sync.');
		}
		const { x, y } = hash[cell];
		if (!isCellValid(x, y)) {
			throw new Error(`A cell is outside of the grid! x - ${x}, y - ${y}`);
		}
	}
});

const initialFoodState = {};

export { GRID_MAP, initialSnakesState, initialFoodState };
