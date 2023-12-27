import React, { useEffect, forwardRef, useState, useRef, useImperativeHandle, useCallback } from 'react';
import Grid from './Grid.jsx';
import { grid } from './Grid.js';

const Game = forwardRef((props, ref) => {
	const { showCellId, gameState, updateSnakeList } = props;

	const [cells, setCells] = useState(grid.getAllCells());

	const updateCells = (cells) => {
		setCells(cells);
	};

	useEffect(() => {
		// This callback is used to update data from the
		// the object to the ui.
		grid.updateCells = updateCells;
		grid.updateSnakeList = updateSnakeList;
		if (gameState) {
			grid.startGame();
		}

		if (props.updateSnakeList) {
			grid.moveSnakes([]); // Doing this updates the list of snakes on the screen (checkboxes) for us to debug.
		}
	}, []);

	useImperativeHandle(ref, () => {
		return {
			nextMove: (selectedSnakes) => grid.moveSnakes(selectedSnakes),
			prevMove: () => {},
			pauseGame: () => grid.pauseGame(),
			resumeGame: () => grid.resumeGame(),
		};
	});

	return <Grid cells={cells} showCellId={showCellId} />;
});

export default Game;
