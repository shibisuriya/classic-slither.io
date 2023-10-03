import React, { useRef } from 'react';
import { DIRECTIONS } from '../constants';
import { getOppositeDirection } from '../helpers';

const useDirection = (initialState, snakeId) => {
	const directions = useRef({ ...initialState }); // useRef is changing the supplied object :(

	const onUp = () => {
		const direction = getDirection(snakeId);
		if (direction == DIRECTIONS.UP) {
			// moving up only.
			return;
		} else if (getOppositeDirection(direction) !== DIRECTIONS.UP) {
			setDirection(snakeId, DIRECTIONS.UP);
		}
	};

	const onDown = () => {
		const direction = getDirection(snakeId);
		if (direction == DIRECTIONS.DOWN) {
			return;
		} else if (getOppositeDirection(direction) !== DIRECTIONS.DOWN) {
			setDirection(snakeId, DIRECTIONS.DOWN);
		}
	};

	const onRight = () => {
		const direction = getDirection(snakeId);
		if (direction == DIRECTIONS.RIGHT) {
			return;
		} else if (getOppositeDirection(direction) !== DIRECTIONS.RIGHT) {
			setDirection(snakeId, DIRECTIONS.RIGHT);
		}
	};

	const onLeft = () => {
		const direction = getDirection(snakeId);
		if (direction == DIRECTIONS.LEFT) {
			return;
		} else if (getOppositeDirection(direction) !== DIRECTIONS.LEFT) {
			setDirection(snakeId, DIRECTIONS.LEFT);
		}
	};

	const setDirection = (snakeId, direction) => {
		directions.current[snakeId] = direction;
	};

	const getDirection = (snakeId) => {
		return directions.current[snakeId];
	};

	return {
		directions: directions.current,
		onUp,
		onDown,
		onLeft,
		onRight,
		getDirection,
		setDirection,
	};
};

export { useDirection };
