import { NUMBER_OF_COLUMNS, NUMBER_OF_ROWS, DIRECTIONS, SNAKE_TICKS } from './constants';
import { generateKey, generateValue, isCellValid } from './helpers';
import { BOTS } from './bots';

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
		headColor: 'red',
		bodyColor: 'yellow',
		cells: [
			{ x: 0, y: 6 }, // Head
			{ x: 0, y: 5 },
			{ x: 0, y: 4 },
			{ x: 0, y: 3 },
			{ x: 0, y: 2 },
			{ x: 0, y: 1 },
			{ x: 0, y: 0 }, // Tail
		],
		isBot: true,
		direction: DIRECTIONS.DOWN,
		defaultTick: SNAKE_TICKS.ONE.TYPE,

		isBot: true,
		botName: BOTS.HEAD_HUNTER.key,
	},
	2: {
		headColor: 'blue',
		bodyColor: 'orange',
		cells: [
			{ x: 3, y: 6 }, // Head
			{ x: 3, y: 5 },
			{ x: 3, y: 4 },
			{ x: 3, y: 3 },
			{ x: 3, y: 2 },
			{ x: 3, y: 1 },
			{ x: 3, y: 0 }, // Tail
		],
		isBot: true,
		botName: BOTS.HEAD_HUNTER.key,
		direction: DIRECTIONS.DOWN,
		defaultTick: SNAKE_TICKS.QUARTER.TYPE,
	},
	3: {
		headColor: 'purple',
		bodyColor: 'gold',
		cells: [
			{ x: 5, y: 6 }, // Head
			{ x: 5, y: 5 },
			{ x: 5, y: 4 },
			{ x: 5, y: 3 },
			{ x: 5, y: 2 },
			{ x: 5, y: 1 },
			{ x: 5, y: 0 }, // Tail
		],
		direction: DIRECTIONS.DOWN,
		defaultTick: SNAKE_TICKS.HALF.TYPE,

		isBot: true,
		botName: BOTS.HEAD_HUNTER.key,
	},
	player: {
		headColor: 'red',
		bodyColor: 'black',
		cells: [
			{ x: 7, y: 6 }, // Head
			{ x: 7, y: 5 },
			{ x: 7, y: 4 },
			{ x: 7, y: 3 },
			{ x: 7, y: 2 },
			{ x: 7, y: 1 },
			{ x: 7, y: 0 }, // Tail
		],
		direction: DIRECTIONS.DOWN,
		defaultTick: SNAKE_TICKS.QUARTER.TYPE,
	},
};

const initialFoodState = {};

export { GRID_MAP, initialSnakesState, initialFoodState };
