import isEqual from 'lodash/isEqual';

const generateRandomNumber = (max, min = 0) => {
	const randomDecimal = Math.random();
	const randomInRange = randomDecimal * (max - min) + min;
	return Math.floor(randomInRange);
};

const areValuesUnique = (obj) => {
	const values = Object.values(obj);
	const uniqueValues = new Set(values);
	if (values.length !== uniqueValues.size) {
		throw new Error('Values are not unique!');
	}
};

const findKeyByValue = (object, value) => {
	for (const key in object) {
		if (isEqual(object[key], value)) {
			return key;
		}
	}
	throw new Error("The key you supplied doesn't exist in the hash.");
};

export { generateRandomNumber, findKeyByValue, areValuesUnique };
