import { NUMBER_OF_COLUMNS, NUMBER_OF_ROWS, DIRECTIONS, FOOD_TYPES } from './constants';
import { generateRandomNumber } from './utils';

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

const whichFoodToSpawn = () => {
	const percentage = Object.values(FOOD_TYPES).reduce((total, { chance }) => {
		total += chance;
		return total;
	}, 0);
	if (percentage != 100) {
		throw new Error('The sum of all chances should be 100.');
	}
	const randomNumber = generateRandomNumber(100) + 1; // Since it will generate a random number between 0 to 99, 100 is not included, I added 1.
	let cumulativeChance = 0;
	for (const key in FOOD_TYPES) {
		cumulativeChance += FOOD_TYPES[key].chance;
		if (randomNumber < cumulativeChance) {
			return FOOD_TYPES[key];
		}
	}
	// TODO: There is something wrong with this function, returning undefined sometimes.
	return FOOD_TYPES.FROG;
};

export { getOppositeDirection, generateValue, generateKey, isCellValid, whichFoodToSpawn };
