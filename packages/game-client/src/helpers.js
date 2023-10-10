import { NUMBER_OF_COLUMNS, NUMBER_OF_ROWS, DIRECTIONS } from './constants';

const isCellValid = (i, j) => {
	return i < NUMBER_OF_ROWS && j < NUMBER_OF_COLUMNS && i >= 0 && j >= 0;
};

const generateKey = (i, j, skipValidation = false) => {
	if (!skipValidation) {
		if (!isCellValid(i, j)) {
			throw new Error(`Invalid coordinates! ${i} ${j}`);
		}
	}
	return `${i}-${j}`;
};

const generateValue = (x, y) => {
	if (!isCellValid(x, y)) {
		throw new Error(`Invalid coordinates! ${i} ${j}`);
	}
	return { x, y };
};

const getOppositeDirection = (direction) => {
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

export { getOppositeDirection, generateValue, generateKey, isCellValid };
