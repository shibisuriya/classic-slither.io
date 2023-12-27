import { areValuesUnique } from './utils';

// in px (pixels)
const GRID_WIDTH = 30 * 25;
const GRID_HEIGHT = 30 * 25;
const CELL_DIMENSION = 30;

const GAME_STATES = {
	PAUSED: 'paused',
	RESUMED: 'resumed',
};

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
	TWO_TENTH: { TYPE: 'TWO_TENTH', DURATION: 0.2 * 1000 },
	ONE_TENTH: {
		TYPE: 'ONE_TENTH',
		DURATION: 1000 * 0.1,
	},
};

const FOOD_TICKS = {
	ONE_TENTH: {
		TYPE: 'HALF',
		DURATION: 1000 * 0.5,
	},
};

// Two setInterval shouldn't have the same duration, so check
// if they are unique.
areValuesUnique(SNAKE_TICKS);

const DEFAULT_TRACK = SNAKE_TICKS.QUARTER.TYPE;

const FOOD_EFFECTS = {
	GROW: 'grow',
	SPEED: 'speed',
};

const grow = (units) => {
	return {
		[FOOD_EFFECTS.GROW]: { units },
	};
};

const speed = (tick = SNAKE_TICKS.ONE_TENTH.TYPE, lastsFor = 30) => {
	return { [FOOD_EFFECTS.SPEED]: { tick, lastsFor } };
};

const FOOD_TYPES = {
	FROG: {
		TYPE: 'FROG',
		chance: 95,
		effects: { ...grow(1) },
		color: 'green',
		animationClass: 'frog',
	},
	RED_BULL: {
		TYPE: 'RED_BULL',
		chance: 5,
		effects: { ...speed(SNAKE_TICKS.ONE_TENTH.TYPE, 30) }, // Lasts for 30 ticks.
		color: 'cyan',
		animationClass: 'red-bull',
	},
	FILLET: {
		TYPE: 'FILLET',
		chance: 0,
		effects: { ...grow(3) },
		color: 'red',
		animationClass: 'fillet',
	},
};

const defaultDirections = {
	1: DIRECTIONS.RIGHT,
	2: DIRECTIONS.LEFT,
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
	FOOD_EFFECTS,
	FOOD_TICKS,
	GAME_STATES,
};
