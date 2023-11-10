import React, { Fragment, useState } from 'react';
import { Radio, Row, Col, Space } from 'antd';
import styles from './directionselector.module.css';

function DirectionSelector({ headColor, bodyColor, direction, updateDirection }) {
	const [currentDirection, setCurrentDirection] = useState('north');
	return (
		<div className={styles.container}>
			<div className={styles['colors-container']}>
				<div className={styles.head} style={{ backgroundColor: headColor }}></div>
				<div className={styles.body} style={{ backgroundColor: bodyColor }}></div>
			</div>
			<div>
				<Radio.Group
					onChange={(e) => {
						setCurrentDirection(e.target.value);
					}}
					value={currentDirection}
				>
					<Row justify="center" align="middle">
						<Col span={6}>
							<div className={styles['radio-button']}>
								<Radio.Button value={'west'}>W</Radio.Button>
							</div>
						</Col>
						<Col span={6}>
							<div className={styles['radio-button']}>
								<Radio.Button value={'north'}>N</Radio.Button>
							</div>

							<div className={styles['radio-button']}>
								<Radio.Button value={'south'}>S</Radio.Button>
							</div>
						</Col>
						<Col span={6}>
							<div className={styles['radio-button']}>
								<Radio.Button value={'east'}>E</Radio.Button>
							</div>
						</Col>
					</Row>
				</Radio.Group>
			</div>
		</div>
	);
}

export default DirectionSelector;
