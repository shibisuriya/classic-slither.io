import React from 'react';
import Grid from './Grid';

const cells = [
	{
		color: 'red',
		x: 1,
		y: 2,
	},
	{
		color: 'blue',
		x: 1,
		y: 5,
	},
];

function App1() {
	return <Grid cells={cells} />;
}

export default App1;
