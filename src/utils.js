import { NUMBER_OF_COLUMNS, NUMBER_OF_ROWS } from './constants';

export const generateKey = (i, j, columns, rows) => {
	// TODO: tighten this code.
	// if (i > columns || j > rows) {
	// 	throw exceptions.invalidCoordinates(i, j);
	// }
	return `${i}-${j}`;
};
