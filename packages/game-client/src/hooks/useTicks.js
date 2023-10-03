import React, { useEffect, useRef } from 'react';
import { TICKS, TICK_TYPES, DEFAULT_TRACK } from '../constants';

const useTicks = ({ moveForward, spawnFood, getSnakeCells, getAllSnakeIds }) => {
	const timersRef = useRef([]);
	const trackRef = useRef(
		Object.keys(TICKS[TICK_TYPES.SNAKES]).reduce((tracks, tick) => {
			if (tick == DEFAULT_TRACK) {
				tracks[tick] = getAllSnakeIds();
			} else {
				tracks[tick] = {};
			}
			return tracks;
		}, {}),
	);

	// To manage the speed of the snakes we use the concept of a
	// railway track... There are n number of tracks, the rail on
	// each track has different speeds. So to increase or decrease a
	// snakes speed, we have push that particular snake to the
	// appropriate track.

	const addSnakeToTrack = (trackId, snakeId) => {
		// Remove the snake from the existing track.
		// Move the snake to the new track.
		// trackRef.current[];
	};

	const resetSnakeTrack = (snakeId) => {
		// Removes the snake from a particular track
		// and places it in the default track.
	};

	const removeSnakeFromTracks = (snakeId) => {
		// Removes the snake from all the tracks, used when a particular the snake dies.
	};

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

	return { addSnakeToTrack, removeSnakeFromTracks, resetSnakeTrack };
};

export { useTicks };
