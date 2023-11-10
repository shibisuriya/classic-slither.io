import React, { Fragment, useState } from 'react';
import { Radio, Row, Col, Space } from 'antd';
import styles from './directionselector.module.css';

function DirectionSelector({ id, headColor, bodyColor, direction, updateSnakeDirection }) {
	return (
		<div className={styles.container}>
			<div className={styles['colors-container']}>
				<div className={styles.head} style={{ backgroundColor: headColor }}></div>
				<div className={styles.body} style={{ backgroundColor: bodyColor }}></div>
			</div>
			<div>
				<Radio.Group
					onChange={(e) => {
						updateSnakeDirection(id, e.target.value);
					}}
					value={direction}
				>
					<Row justify="center" align="middle">
						<Col span={6}>
							<div className={styles['radio-button']}>
								<Radio.Button value={'left'}>W</Radio.Button>
							</div>
						</Col>
						<Col span={6}>
							<div className={styles['radio-button']}>
								<Radio.Button value={'up'}>N</Radio.Button>
							</div>

							<div className={styles['radio-button']}>
								<Radio.Button value={'down'}>S</Radio.Button>
							</div>
						</Col>
						<Col span={6}>
							<div className={styles['radio-button']}>
								<Radio.Button value={'right'}>E</Radio.Button>
							</div>
						</Col>
					</Row>
				</Radio.Group>
			</div>
		</div>
	);
}

export default DirectionSelector;
