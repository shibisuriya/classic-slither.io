import { NUMBER_OF_COLUMNS, NUMBER_OF_ROWS, DIRECTIONS } from './constants';

export const generateKey = (i, j) => {
	if (i >= NUMBER_OF_ROWS || j >= NUMBER_OF_COLUMNS) {
		throw new Error(`Invalid coordinates! ${i} ${j}`);
	}
	return `${i}-${j}`;
};

export const getOppositeDirection = (direction) => {
	switch (direction) {
		case DIRECTIONS.DOWN:
			return DIRECTIONS.UP;
		case DIRECTIONS.UP:
			return DIRECTIONS.DOWN;
		case DIRECTIONS.LEFT:
			return DIRECTIONS.RIGHT;
		case DIRECTIONS.RIGHT:
			return DIRECTIONS.LEFT;
		default:
			throw new Error(`Invalid direction, ${direction}.`);
	}
};
