import React, { Fragment, useState, useRef, useEffect } from 'react';
import Game from './Game';
import { Divider, Space, Checkbox, Flex, Select, Button } from 'antd';
import { stringToBoolean } from './utils';
import { allSnakesSelectOption } from './constants';

function App() {
	const [recordInLocalStorage, setRecordInLocalStorage] = useState(
		stringToBoolean(localStorage.getItem('recordInLocalStorage')) ?? false,
	);

	const [isGamePaused, setIsGamePaused] = useState(stringToBoolean(localStorage.getItem('isGamePaused') ?? true));
	const [showCellId, setShowCellId] = useState(stringToBoolean(localStorage.getItem('showCellId')) ?? false);
	const gameRef = useRef();

	const [snakeIdList, setSnakeIdList] = useState([allSnakesSelectOption]);
	const [selectedSnake, setSelectedSnake] = useState(allSnakesSelectOption);

	function updateSnakeIdList(ids) {
		if (ids.length > 0) {
			if (!ids.includes(selectedSnake) && selectedSnake !== allSnakesSelectOption) {
				const [firstId] = ids;
				setSelectedSnake(firstId);
			}

			setSnakeIdList([allSnakesSelectOption].concat(ids));
		} else {
			setSelectedSnake(null);
			setSnakeIdList([]);
		}
	}

	return (
		<Fragment>
			<Space>
				<Checkbox
					checked={isGamePaused}
					onChange={(e) => {
						const val = e.target.checked;
						localStorage.setItem('isGamePaused', val);
						setIsGamePaused(val);
					}}
				>
					Is Game paused?
				</Checkbox>
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
					Spawn food
				</Button>

				<Select
					style={{ width: 60 }}
					value={selectedSnake}
					disabled={snakeIdList.length === 0}
					onChange={(val) => {
						setSelectedSnake(val);
					}}
					options={snakeIdList.map((id) => {
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
				isGamePaused={isGamePaused}
				updateSnakeIdList={updateSnakeIdList}
			/>
		</Fragment>
	);
}

export default App;
