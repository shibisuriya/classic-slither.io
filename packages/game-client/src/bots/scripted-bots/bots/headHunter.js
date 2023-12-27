import { astar } from '../algorithms/astar';
import { findDirectionUsingNeckAndHead } from '../../../helpers';

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
	// updateAnnotations(annotations);

	const [_, cellToMoveTo] = annotations;
	const moveDir = findDirectionUsingNeckAndHead(two.getHead(), cellToMoveTo);
	move(moveDir);
	console.log('Cell to move to -> ', cellToMoveTo, '  Bot head -> ', two.getHead());
	console.log('Shibi headhunterbot', Date.now(), '  ', gameData);
};

export { headHunter };
