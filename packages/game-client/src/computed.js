import { NUMBER_OF_COLUMNS, NUMBER_OF_ROWS } from './constants';
import { generateKey, generateValue } from './utils';

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
export { GRID_MAP };
