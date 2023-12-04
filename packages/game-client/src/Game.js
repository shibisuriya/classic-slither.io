import Snake from './Snake';
import { DIRECTIONS } from './constants';

class Game {
	constructor() {
		setInterval(() => {
			this.snake.move();
			this.updateCells(Object.values(this.snake.hash));
		}, 1 * 1000);

		const abortController = new AbortController();
		document.addEventListener(
			'keydown',
			(event) => {
				const key = event.key.toLowerCase();
				if (['w', 'arrowup'].includes(key)) {
					this.snake.changeDirection(DIRECTIONS.UP);
				} else if (['s', 'arrowdown'].includes(key)) {
					this.snake.changeDirection(DIRECTIONS.DOWN);
				} else if (['a', 'arrowleft'].includes(key)) {
					this.snake.changeDirection(DIRECTIONS.LEFT);
				} else if (['d', 'arrowright'].includes(key)) {
					this.snake.changeDirection(DIRECTIONS.RIGHT);
				}
			},
			{ signal: abortController.signal },
		);

		this.snake = new Snake({
			headColor: '#264653',
			bodyColor: '#e9c46a',
			cells: [
				{ x: 0, y: 6 }, // Head
				{ x: 0, y: 5 },
				{ x: 0, y: 4 },
				{ x: 0, y: 3 },
				{ x: 0, y: 2 },
				{ x: 0, y: 1 },
				{ x: 0, y: 0 }, // Tail
			],
			direction: DIRECTIONS.DOWN,
		});
	}
}

export default Game;
