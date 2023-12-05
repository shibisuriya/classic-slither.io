import React, { useEffect, useState } from 'react';
import Grid from './Grid.jsx';
import { grid } from './Grid.js';

const useGame = () => {
	const [cells, setCells] = useState([]);

	const updateCells = (cells) => {
		setCells(cells);
	};

	useEffect(() => {
		grid.updateCells = updateCells;
	}, []);

	return { cells };
};

function App() {
	const { cells } = useGame();
	return <Grid cells={cells} />;
}

export default App;
