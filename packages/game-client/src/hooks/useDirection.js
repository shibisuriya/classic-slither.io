import React, { useRef } from 'react';
import { DIRECTIONS } from '../constants';

const useDirection = (initialState) => {
	const directions = useRef(initialState);

	const setDirection = (snakeId, direction) => {
		directions.current[snakeId] = direction;
	};

	const getDirection = (snakeId) => {
		return directions.current[snakeId];
	};

	const setUp = (snakeId) => {
		setDirection(snakeId, DIRECTIONS.UP);
	};

	const setDown = (snakeId) => {
		setDirection(snakeId, DIRECTIONS.DOWN);
	};

	const setRight = (snakeId) => {
		setDirection(snakeId, DIRECTIONS.RIGHT);
	};

	const setLeft = (snakeId) => {
		setDirection(snakeId, DIRECTIONS.LEFT);
	};

	return {
		directions: directions.current,
		setDown,
		setUp,
		setLeft,
		setRight,
		getDirection,
		setDirection,
	};
};

export { useDirection };
