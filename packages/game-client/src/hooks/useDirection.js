import React, { useEffect, useRef, useState } from 'react';
import { DIRECTIONS } from '../constants';
import { getOppositeDirection } from '../helpers';
import { cloneDeep } from 'lodash';

const useDirection = (initialState, snakeId) => {
	const directionsRef = useRef(cloneDeep({ ...initialState })); // useRef is changing the supplied object :(
	const [directions, setDirections] = useState(directionsRef.current);

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
		directionsRef.current[snakeId] = direction;
		setDirections({ ...directionsRef.current });
	};

	const getDirection = (snakeId) => {
		return directionsRef.current[snakeId];
	};

	return {
		directions,
		onUp,
		onDown,
		onLeft,
		onRight,
		getDirection,
		setDirection,
	};
};

export { useDirection };
