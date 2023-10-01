import React, { useEffect } from 'react';
import { TICKS } from '../constants';

const useTicks = () => {
	useEffect(() => {
		const timers = [];
		for (const [key, value] of Object.entries(TICKS)) {
			const timer = setInterval(() => {
				console.log(key, ' -> ', Date.now());
			}, value);
			timers.push(timer);
		}

		return () => {
			timers.forEach((timer) => clearInterval(timer));
		};
	}, []);
};

export { useTicks };
