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

const FOOD_TYPES = {
	PROTEIN: { name: 'protein', chance: 95, growth: 1 },
	WALLRIDER_PORTION: { name: 'wallrider-portion', chance: 2, growth: 0 },
	REDBULL: { name: 'redbull', chance: 3, growth: 0 },
	FILLET: { name: 'fillet', chance: 0, growth: 2 },
};

const TICK_TYPES = {
	SNAKES: 'snakes',
	FOOD: 'food',
};

const TICKS = {
	[TICK_TYPES.FOOD]: {
		0.1: 1000 * 0.1,
	},
	[TICK_TYPES.SNAKES]: {
		// 1: 1 * 1000,
		// 0.5: 0.5 * 1000,
		// 0.25: 0.25 * 1000,
		0.1: 1000 * 0.1,
	},
};

const SPEED = 1 * 100;

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
	TICKS,
	TICK_TYPES,
	SPEED,
};
