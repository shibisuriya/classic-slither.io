import React, { Fragment, useState } from 'react';
import Game from './Game';
import { Button } from 'antd';
import { Divider, Space, Checkbox, Switch } from 'antd';
import { stringToBoolean } from './utils';

function App() {
	const [recordInLocalStorage, setRecordInLocalStorage] = useState(
		stringToBoolean(localStorage.getItem('recordInLocalStorage')) ?? false,
	);

	const [isGamePaused, setIsGamePaused] = useState(stringToBoolean(localStorage.getItem('isGamePaused') ?? true));
	const [showCellId, setShowCellId] = useState(stringToBoolean(localStorage.getItem('showCellId')) ?? false);
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

			<Divider dashed />
			<Game showCellId={showCellId} isGamePaused={isGamePaused} />
		</Fragment>
	);
}

export default App;
