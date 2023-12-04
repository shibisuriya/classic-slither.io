import React, { useEffect, useState } from 'react';
import Grid from './Grid';
import Game from './Game.js';

const useGame = () => {
	const [cells, setCells] = useState([]);

	const updateCells = (cells) => {
		setCells(cells);
	};

	useEffect(() => {
		const game = new Game();
		game.updateCells = updateCells;
	}, []);

	return { cells };
};

function App() {
	const { cells } = useGame();
	return <Grid cells={cells} />;
}

export default App;
