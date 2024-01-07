import { astar } from '../algorithms/astar';
import { findDirectionUsingNeckAndHead, excludeSelf } from '../../../helpers';

const headHunter = ({ move, updateAnnotations, gameData, self }) => {
	// This bot is sucidal, it tries chases down the player and tries to have a head to head collison and
	// killing the player...
	// Not that the variable `gameData` will contain data of all the snakes including the current snake (self)...

	const opponents = excludeSelf({ myId: self.snakeId, snakes: gameData.snakes });
	const player = opponents['player']; // The user who plays the game will have the snakeId 'player'...

	const getObstacles = () => {
		const cells = self.getBody().concat(player.getBody());
		for (const [snakeId, snake] of Object.entries(opponents)) {
			if (snakeId !== self.snakeId && snakeId !== 'player') {
				cells.push(...snake.getCells());
			}
		}
		return cells;
	};

	// The object of the bots is to kill the player...
	const path = astar(self.getHead(), player.getHead(), getObstacles());
	// updateAnnotations(annotations);

	const [_, cellToMoveTo] = path;

	if (path.length > 0) {
		const direction = findDirectionUsingNeckAndHead(self.getHead(), cellToMoveTo);
		move(direction);
	}
};

export { headHunter };
