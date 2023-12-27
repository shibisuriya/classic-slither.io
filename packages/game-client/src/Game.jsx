import React, { useEffect, forwardRef, useState, useRef, useImperativeHandle, useCallback } from 'react';
import Grid from './Grid.jsx';
import { grid } from './Grid.js';

const Game = forwardRef((props, ref) => {
	const { showCellId, gameState, updateSnakeList } = props;

	const [view, setView] = useState(grid.getViewData());
	const [annotations, setAnnotations] = useState(grid.getAnnotationData());

	const viewUpdater = (cells) => {
		setView(cells);
	};

	const annotationsUpdater = (cells) => {
		setAnnotations(cells);
	};

	useEffect(() => {
		// This callback is used to update data from the
		// the object to the ui.
		grid.viewUpdater = viewUpdater;
		grid.annotationsUpdater = annotationsUpdater;

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

	return <Grid view={view} annotations={annotations} showCellId={showCellId} />;
});

export default Game;
