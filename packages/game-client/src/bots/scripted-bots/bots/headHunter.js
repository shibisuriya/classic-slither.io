import { DIRECTIONS } from '../../../constants';
import { astar } from '../algorithms/astar';

const findDirection = (pointA, pointB) => {
	const x = pointB.x - pointA.x;
	const y = pointB.y - pointA.y;

	if (x === 1 && y === 0) {
		return DIRECTIONS.RIGHT;
	} else if (x === -1 && y === 0) {
		return DIRECTIONS.LEFT;
	} else if (y === 1 && x === 0) {
		return DIRECTIONS.DOWN;
	} else if (y === -1 && x === 0) {
		return DIRECTIONS.UP;
	} else {
		throw new Error("Can't figure out the direction to move to... ");
	}
};
const headHunter = ({ move, updateAnnotations, gameData }) => {
	// const start = { x: 1, y: 1 };
	// const end = { x: 10, y: 10 };
	// const obstacles = [
	// 	{ x: 3, y: 2 },
	// 	{ x: 3, y: 3 },
	// 	{ x: 3, y: 4 },
	// ];
	const two = gameData.snakes[2]; //  bot
	const botHead = two.getHead();
	const four = gameData.snakes[4];
	const targetHead = four.getHead();
	const annotations = astar(botHead, targetHead, two.getBody().concat(four.getBody()));
	updateAnnotations([]);

	const [_, cellToMoveTo] = annotations;
	const moveDir = findDirection(two.getHead(), cellToMoveTo);
	move(moveDir);
	console.log('Cell to move to -> ', cellToMoveTo, '  Bot head -> ', two.getHead());
	console.log('Shibi headhunterbot', Date.now(), '  ', gameData);
	const randomNumber = Math.floor(Math.random() * 4) + 1;
	// switch (randomNumber) {
	// 	case 1:
	// 		move(DIRECTIONS.LEFT);
	// 		break;
	// 	case 2:
	// 		move(DIRECTIONS.RIGHT);
	// 		break;
	// 	case 3:
	// 		move(DIRECTIONS.DOWN);
	// 		break;
	// 	case 4:
	// 		move(DIRECTIONS.UP);
	// 		break;
	// 	default:
	// 		throw new Error('Unknow random number generated...');
	// }
};

export { headHunter };
