import { findKeyByValue, areValuesUnique } from './utils';

// in px (pixels)
const GRID_WIDTH = 30 * 50;
const GRID_HEIGHT = 30 * 30;
const CELL_DIMENSION = 30;

if (GRID_HEIGHT % CELL_DIMENSION !== 0) {
	throw new Error('GRID_HEIGHT is not divislbe by CELL_DIMENSION');
}

if (GRID_WIDTH % CELL_DIMENSION !== 0) {
	throw new Error('GRID_WIDTH is not divislbe by CELL_DIMENSION');
}

const NUMBER_OF_ROWS = GRID_HEIGHT / CELL_DIMENSION;
const NUMBER_OF_COLUMNS = GRID_WIDTH / CELL_DIMENSION;

const DIRECTIONS = {
	UP: 'up',
	DOWN: 'down',
	LEFT: 'left',
	RIGHT: 'right',
};

const DEFAULT_DIRECTION = DIRECTIONS.RIGHT;

const SNAKE_TICKS = {
	ONE: { TYPE: 'ONE', DURATION: 1 * 1000 },
	HALF: { TYPE: 'HALF', DURATION: 0.5 * 1000 },
	QUARTER: { TYPE: 'QUARTER', DURATION: 0.25 * 1000 },
	ONE_TENTH: {
		TYPE: 'ONE_TENTH',
		DURATION: 1000 * 0.1,
	},
};

const FOOD_TICKS = {
	ONE_TENTH: {
		TYPE: 'ONE_TENTH',
		DURATION: 1000 * 0.1,
	},
};

// Two setInterval shouldn't have the same duration, so check
// if they are unique.
areValuesUnique(SNAKE_TICKS);

const DEFAULT_TRACK = SNAKE_TICKS.ONE_TENTH.TYPE;

const FOOD_TYPES = {
	PROTEIN: { TYPE: 'PROTEIN', chance: 95, growth: 1 },
	WALLRIDER_PORTION: { TYPE: 'WALLRIDER_PORTION', chance: 2, growth: 0 },
	REDBULL: { TYPE: 'REDBULL', chance: 3, growth: 0, speed: SNAKE_TICKS.ONE.TYPE },
	FILLET: { TYPE: 'FILLET', chance: 0, growth: 2 },
};

const defaultDirections = {
	1: DIRECTIONS.DOWN,
	2: DIRECTIONS.RIGHT,
	3: DIRECTIONS.RIGHT,
	4: DIRECTIONS.RIGHT,
};

export {
	defaultDirections,
	GRID_HEIGHT,
	GRID_WIDTH,
	CELL_DIMENSION,
	NUMBER_OF_COLUMNS,
	NUMBER_OF_ROWS,
	DIRECTIONS,
	DEFAULT_DIRECTION,
	FOOD_TYPES,
	DEFAULT_TRACK,
	SNAKE_TICKS,
	FOOD_TICKS,
};
