import { NUMBER_OF_COLUMNS, NUMBER_OF_ROWS, DIRECTIONS, FOOD_TYPES } from './constants';
import { generateRandomNumber } from './utils';

const isCellValid = (i, j) => {
	return i < NUMBER_OF_ROWS && j < NUMBER_OF_COLUMNS && i >= 0 && j >= 0;
};

const findDirectionUsingNeckAndHead = (head, neck) => {
	// This function lets us find out the direction of a snake if we don't know the direction of
	// of the snake using the position of its neck and head.
	if (isCellValid(head.x, head.y) && isCellValid(neck.x, neck.y)) {
		const x = neck.x - head.x;
		const y = neck.y - head.y;

		if (x === 1 && y === 0) {
			return DIRECTIONS.RIGHT;
		} else if (x === -1 && y === 0) {
			return DIRECTIONS.LEFT;
		} else if (y === 1 && x === 0) {
			return DIRECTIONS.DOWN;
		} else if (y === -1 && x === 0) {
			return DIRECTIONS.UP;
		} else {
			throw new Error(
				`The neck and head coordinates supplied is not even the coordinates of neck and head! head - ${head}, neck - ${neck}.`,
			);
		}
	} else {
		throw new Error(`Invalid neck or head supplied, head - ${head}, neck - ${neck}.`);
	}
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

const excludeSelf = ({ myId, snakes }) => {
	// This heloers lets us remove ourselves from the game data so that it is convenient to perform operaations on the data...
	return Object.entries(snakes).reduce((snakes, [snakeId, snake]) => {
		if (snakeId !== myId) {
			snakes[snakeId] = snake;
		}
		return snakes;
	}, {});
};

export {
	findDirectionUsingNeckAndHead,
	getOppositeDirection,
	generateValue,
	generateKey,
	isCellValid,
	whichFoodToSpawn,
	excludeSelf,
};
