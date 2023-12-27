import React, { Fragment, useState, useRef, useEffect } from 'react';
import Game from './Game';
import { Divider, Space, Checkbox, Flex, Select, Button } from 'antd';
import { stringToBoolean } from './utils';
import { Switch } from 'antd';

function App() {
	const [gameState, setGameState] = useState(stringToBoolean(localStorage.getItem('gameState') ?? true));
	const [showCellId, setShowCellId] = useState(stringToBoolean(localStorage.getItem('showCellId')) ?? false);
	const gameRef = useRef();

	const [aliveSnakes, setAliveSnakes] = useState([]);

	const [selectedSnakes, setSelectedSnakes] = useState({});

	useEffect(() => {
		setSelectedSnakes((prev) => {
			const newSelectedSnakes = {};
			for (const snakeId of Object.keys(aliveSnakes)) {
				if (snakeId in prev) {
					newSelectedSnakes[snakeId] = selectedSnakes[snakeId];
				}
			}
			return newSelectedSnakes;
		});
	}, [aliveSnakes]);

	const changeGameState = (value) => {
		if (value) {
			gameRef.current.resumeGame();
		} else {
			gameRef.current.pauseGame();
		}
		localStorage.setItem('gameState', value);
		setGameState(value);
	};

	return (
		<Fragment>
			{Object.keys(aliveSnakes).map((snakeId) => {
				return (
					<div key={snakeId}>
						<Checkbox
							checked={selectedSnakes[snakeId]}
							onChange={(e) => {
								const isChecked = e.target.checked;
								setSelectedSnakes((prev) => {
									return {
										...prev,
										[snakeId]: isChecked,
									};
								});
							}}
						>
							{snakeId}
						</Checkbox>
					</div>
				);
			})}
			<Space>
				Game running? <Switch checked={gameState} onChange={changeGameState} />;
				<Checkbox
					checked={showCellId}
					onChange={(e) => {
						const val = Boolean(e.target.checked);
						localStorage.setItem('showCellId', val);
						setShowCellId(val);
					}}
				>
					Show cell ID?
				</Checkbox>
			</Space>
			<Flex>
				<Space>
					<Button
						type="primary"
						onClick={() => {
							const snakesToMove = Object.entries(selectedSnakes).reduce((snakes, [key, value]) => {
								if (value) {
									// value would be true or false (boolean).
									snakes.push(key);
								}
								return snakes;
							}, []);
							gameRef.current.nextMove(snakesToMove);
						}}
					>
						Next move
					</Button>
				</Space>
			</Flex>
			<Divider dashed />
			<Game ref={gameRef} showCellId={showCellId} gameState={gameState} updateSnakeList={setAliveSnakes} />
		</Fragment>
	);
}

export default App;
