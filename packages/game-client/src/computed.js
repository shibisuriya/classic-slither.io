import { NUMBER_OF_COLUMNS, NUMBER_OF_ROWS, DIRECTIONS } from './constants';
import { generateKey, generateValue } from './utils';

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
	// 2: {
	// 	headColor: 'blue',
	// 	bodyColor: 'yellow',
	// 	hash: {
	// 		'5-0': { x: 5, y: 0 },
	// 		'5-1': { x: 5, y: 1 },
	// 		'5-2': { x: 5, y: 2 },
	// 		'5-3': { x: 5, y: 3 },
	// 		'5-4': { x: 5, y: 4 },
	// 		'5-5': { x: 5, y: 5 },
	// 		'5-6': { x: 5, y: 6 },
	// 		'5-7': { x: 5, y: 7 },
	// 	},
	// 	list: ['5-7', '5-6', '5-5', '5-4', '5-3', '5-2', '5-1', '5-0'],
	// },
	// 3: {
	// 	headColor: 'yellow',
	// 	bodyColor: 'red',
	// 	hash: {
	// 		'10-0': { x: 10, y: 0 },
	// 		'10-1': { x: 10, y: 1 },
	// 		'10-2': { x: 10, y: 2 },
	// 		'10-3': { x: 10, y: 3 },
	// 		'10-4': { x: 10, y: 4 },
	// 		'10-5': { x: 10, y: 5 },
	// 	},
	// 	list: ['10-5', '10-4', '10-3', '10-2', '10-1', '10-0'],
	// },
	// 4: {
	// 	headColor: 'green',
	// 	bodyColor: 'blue',
	// 	hash: {
	// 		'12-0': { x: 12, y: 0 },
	// 		'12-1': { x: 12, y: 1 },
	// 		'12-2': { x: 12, y: 2 },
	// 		'12-3': { x: 12, y: 3 },
	// 		'12-4': { x: 12, y: 4 },
	// 		'12-5': { x: 12, y: 5 },
	// 		'12-6': { x: 12, y: 6 },
	// 	},
	// 	list: ['12-6', '12-5', '12-4', '12-3', '12-2', '12-1', '12-0'],
	// },
};

const initialFoodState = {};

export { GRID_MAP, initialSnakesState, initialFoodState };
