import React, { useEffect, useRef } from 'react';
import { SNAKE_TICKS, FOOD_TICKS, DEFAULT_TRACK } from '../constants';

const useTicks = ({ moveForward, spawnFood, getSnakeCells, getAllSnakeIds, isGamePaused }) => {
	const isGamePausedRef = useRef(isGamePaused);
	const timersRef = useRef([]);
	const trackRef = useRef(
		Object.keys(SNAKE_TICKS).reduce((tracks, tick) => {
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

	const addSnakeToTrack = ({ tick: trackId, snakeId, lastsFor }) => {
		removeSnakeFromTracks(snakeId);
		Object.assign(trackRef.current[trackId], { [snakeId]: snakeId });
	};

	const resetSnakeTrack = (snakeId) => {
		// Removes the snake from a particular track
		// and places it in the default track.
	};

	const removeSnakeFromTracks = (snakeId) => {
		// Removes the snake from all the tracks, used when a particular the snake dies.
		for (const values of Object.values(trackRef.current)) {
			if (snakeId in values) {
				delete values[snakeId];
				return;
			}
		}
		throw new Error(`The snake with id ${snakeId} is not part of any track!`);
	};

	const onTick = (tick) => {
		const snakes = Object.keys(trackRef.current[tick]);
		if (snakes.length > 0) {
			moveForward(snakes);
		}
	};

	useEffect(() => {
		isGamePausedRef.current = isGamePaused;
	}, [isGamePaused]);

	useEffect(() => {
		for (const { DURATION: duration } of Object.values(FOOD_TICKS)) {
			const timer = setInterval(() => {
				if (!isGamePausedRef.current) {
					spawnFood(getSnakeCells);
				}
			}, duration);

			timersRef.current.push(timer);
		}

		for (const [key, value] of Object.entries(SNAKE_TICKS)) {
			const { DURATION: duration } = value;
			const timer = setInterval(() => {
				if (!isGamePausedRef.current) {
					onTick(key);
				}
			}, duration);

			timersRef.current.push(timer);
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
