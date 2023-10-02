import { NUMBER_OF_COLUMNS, NUMBER_OF_ROWS, DIRECTIONS } from './constants';

export const isCellValid = (i, j) => {
	return !(i > NUMBER_OF_ROWS || j > NUMBER_OF_COLUMNS);
};

export const generateKey = (i, j) => {
	if (!isCellValid(i, j)) {
		throw new Error(`Invalid coordinates! ${i} ${j}`);
	}
	return `${i}-${j}`;
};

export const generateValue = (x, y) => {
	if (!isCellValid(x, y)) {
		throw new Error(`Invalid coordinates! ${i} ${j}`);
	}
	return { x, y };
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

export const generateRandomNumber = (max, min = 0) => {
	const randomDecimal = Math.random();
	const randomInRange = randomDecimal * (max - min) + min;
	return Math.floor(randomInRange);
};