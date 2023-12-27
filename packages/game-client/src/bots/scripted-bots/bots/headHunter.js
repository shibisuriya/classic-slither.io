import { DIRECTIONS } from '../../../constants';

const headHunter = (changeDirection) => {
	// const start = { x: 1, y: 1 };
	// const end = { x: 10, y: 10 };
	// const obstacles = [
	// 	{ x: 3, y: 2 },
	// 	{ x: 3, y: 3 },
	// 	{ x: 3, y: 4 },
	// ];
	console.log('Shibi headhunterbot', Date.now());
	const randomNumber = Math.floor(Math.random() * 4) + 1;
	switch (randomNumber) {
		case 1:
			changeDirection(DIRECTIONS.LEFT);
			break;
		case 2:
			changeDirection(DIRECTIONS.RIGHT);
			break;
		case 3:
			changeDirection(DIRECTIONS.DOWN);
			break;
		case 4:
			changeDirection(DIRECTIONS.UP);
			break;
		default:
			throw new Error('Unknow random number generated...');
	}
};

export { headHunter };
