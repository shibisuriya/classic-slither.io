import { NUMBER_OF_COLUMNS, NUMBER_OF_ROWS } from "./constants";
export const generateKey = (i, j) => {
  if (i > NUMBER_OF_ROWS || j > NUMBER_OF_COLUMNS) {
    throw new Error(`Invalid cordinate, (${i}, ${j})!`);
  }
  return `${i}-${j}`;
};
