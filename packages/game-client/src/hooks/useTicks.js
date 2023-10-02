import React, { useEffect, useRef } from 'react';
import { TICKS, TICK_TYPES } from '../constants';

const useTicks = ({ moveForward, snakes, food, spawnFood, getSnakeCells }) => {
	const timersRef = useRef([]);
	const snakesRef = useRef(snakes);
	const foodRef = useRef(food);

	useEffect(() => {
		snakesRef.current = snakes;
		foodRef.current = food;
	}, [snakes, food]);

	useEffect(() => {
		for (const [type, ticks] of Object.entries(TICKS)) {
			let timer;
			for (const tick of Object.values(ticks)) {
				if (type == TICK_TYPES.SNAKES) {
					timer = setInterval(() => {
						moveForward();
					}, tick);
				} else if (type == TICK_TYPES.FOOD) {
					timer = setInterval(() => {
						spawnFood(getSnakeCells);
					}, tick);
				}
				timersRef.current.push(timer);
			}
		}

		return () => {
			for (const timer of timersRef.current) {
				clearInterval(timer);
			}
		};
	}, []);
};

export { useTicks };