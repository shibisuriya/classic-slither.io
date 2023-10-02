import React, { useEffect } from 'react';

const useInput = ({ snakes, onUp, onDown, onLeft, onRight }) => {
	useEffect(() => {
		const abortController = new AbortController();
		document.addEventListener(
			'keydown',
			(event) => {
				const key = event.key.toLowerCase();
				if (['w', 'arrowup'].includes(key)) {
					onUp();
				} else if (['s', 'arrowdown'].includes(key)) {
					onDown();
				} else if (['a', 'arrowleft'].includes(key)) {
					onLeft();
				} else if (['d', 'arrowright'].includes(key)) {
					onRight();
				}
			},
			{ signal: abortController.signal },
		);

		return () => {
			abortController.abort();
		};
	}, [snakes]);
};

export { useInput };
