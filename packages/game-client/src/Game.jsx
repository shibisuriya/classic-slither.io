import React, { useEffect, forwardRef, useState, useRef, useImperativeHandle, useCallback } from 'react';
import Grid from './Grid.jsx';
import { grid } from './Grid.js';

const Game = forwardRef((props, ref) => {
	const { showCellId, gameState } = props;

	const [cells, setCells] = useState(grid.getAllCells());

	const updateCells = (cells) => {
		setCells(cells);
	};

	useEffect(() => {
		// This callback is used to update data from the
		// the object to the ui.
		grid.updateCells = updateCells;
		if (gameState) {
			grid.startGame();
		}
	}, []);

	useImperativeHandle(ref, () => {
		return {
			pauseGame: () => grid.pauseGame(),
			resumeGame: () => grid.resumeGame(),
		};
	});

	return <Grid cells={cells} showCellId={showCellId} />;
});

export default Game;
