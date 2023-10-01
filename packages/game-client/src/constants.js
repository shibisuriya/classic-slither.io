// in px (pixels)
const GRID_WIDTH = 30 * 30;
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
	PROTEIN: 'protein',
};

const TICKS = {
	1: 1 * 1000,
	0.5: 0.5 * 1000,
	0.25: 0.25 * 1000,
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
	TICKS,
};
