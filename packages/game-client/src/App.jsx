import React, { Fragment, useState, useRef } from 'react';
import Game from './Game';
import { Button } from 'antd';
import { Divider, Space, Checkbox, Grid, Flex } from 'antd';
import { stringToBoolean } from './utils';

function App() {
	const [recordInLocalStorage, setRecordInLocalStorage] = useState(
		stringToBoolean(localStorage.getItem('recordInLocalStorage')) ?? false,
	);

	const [isGamePaused, setIsGamePaused] = useState(stringToBoolean(localStorage.getItem('isGamePaused') ?? true));
	const [showCellId, setShowCellId] = useState(stringToBoolean(localStorage.getItem('showCellId')) ?? false);
	const gameRef = useRef();
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
			</Space>
			<Flex>
				<Space>
					<Button type="primary" onClick={() => gameRef.current.prevMove()}>
						{'<'}
					</Button>
					<Button type="primary" onClick={() => gameRef.current.nextMove()}>
						{'>'}
					</Button>
				</Space>
			</Flex>

			<Divider dashed />
			<Game ref={gameRef} showCellId={showCellId} isGamePaused={isGamePaused} />
		</Fragment>
	);
}

export default App;
