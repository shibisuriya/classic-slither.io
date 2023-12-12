import React, { Fragment, useState, useRef, useEffect } from 'react';
import Game from './Game';
import { Divider, Space, Checkbox, Flex, Select, Button } from 'antd';
import { stringToBoolean } from './utils';
import { allSnakesSelectOption } from './constants';
import DirectionSelector from './components/DirectionSelector';
import styles from './app.module.css';
import { Switch } from 'antd';

function App() {
	const [recordInLocalStorage, setRecordInLocalStorage] = useState(
		stringToBoolean(localStorage.getItem('recordInLocalStorage')) ?? false,
	);

	const [gameState, setGameState] = useState(stringToBoolean(localStorage.getItem('gameState') ?? true));
	const [showCellId, setShowCellId] = useState(stringToBoolean(localStorage.getItem('showCellId')) ?? false);
	const gameRef = useRef();

	const [snakeIdList, setSnakeIdList] = useState([allSnakesSelectOption]);
	const [selectedSnake, setSelectedSnake] = useState(allSnakesSelectOption.id);
	const [directions, setDirections] = useState({});

	function updateSnakeIdList(snakes) {
		if (snakes.length > 0) {
			if (!snakes.find(({ id }) => id === selectedSnake) && selectedSnake !== allSnakesSelectOption.id) {
				const [{ id }] = snakes;
				setSelectedSnake(id);
			}
			setSnakeIdList([allSnakesSelectOption].concat(snakes));
		} else {
			setSelectedSnake(null);
			setSnakeIdList([]);
		}
	}

	function updateDirectionList(directions) {
		setDirections(directions);
	}

	function updateSnakeDirection(snakeId, direction) {
		setSelectedSnake(snakeId);
		gameRef.current.setDirection(snakeId, direction);
	}

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
			<Space>
				Game running? <Switch checked={gameState} onChange={changeGameState} />;
				<Checkbox
					checked={recordInLocalStorage}
					onChange={(e) => {
						const val = Boolean(e.target.checked);
						localStorage.setItem('recordInLocalStorage', val);
						setRecordInLocalStorage(val);
					}}
				>
					Record game in localStorage?
				</Checkbox>
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
				<Button type="primary" onClick={() => gameRef.current.spawnFood()}>
					Spawn random food in random cell
				</Button>
				<Select
					style={{ width: 60 }}
					value={selectedSnake}
					disabled={snakeIdList.length === 0}
					onChange={(val) => {
						setSelectedSnake(val);
					}}
					options={snakeIdList.map(({ id }) => {
						return { value: id, label: id };
					})}
				/>
			</Space>
			<Flex>
				<Space>
					<Button type="primary" onClick={() => gameRef.current.prevMove(selectedSnake)}>
						{'<'}
					</Button>
					<Button type="primary" onClick={() => gameRef.current.nextMove(selectedSnake)}>
						{'>'}
					</Button>
				</Space>
			</Flex>
			<Divider dashed />
			<Game
				ref={gameRef}
				showCellId={showCellId}
				gameState={gameState}
				updateSnakeIdList={updateSnakeIdList}
				updateDirectionList={updateDirectionList}
			/>
			<Flex justify="space-evenly" className={styles['direction-selector']}>
				{snakeIdList
					.filter((item) => item.id !== allSnakesSelectOption.id)
					.map((snake, index) => {
						const { id, headColor, bodyColor } = snake;
						return (
							<DirectionSelector
								key={index}
								id={id}
								headColor={headColor}
								bodyColor={bodyColor}
								direction={directions[id]}
								updateSnakeDirection={updateSnakeDirection}
							/>
						);
					})}
			</Flex>
		</Fragment>
	);
}

export default App;
