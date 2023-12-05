import Snake from './Snake';
import { DIRECTIONS, SNAKE_TICKS, FOOD_TICKS, FOOD_TYPES } from './constants';
import { initialSnakesState, GRID_MAP, initialFoodState } from './computed';
import { generateRandomNumber } from './utils';
import { generateKey, whichFoodToSpawn } from './helpers';

class Grid {
	constructor() {
		this.attachKeyboard();
		this.createTracks();
		this.initializeSnakes();
		this.initializeFood();
		this.attachTickers();
	}

	createTracks() {
		this.tracks = {};
		for (const tick of Object.values(SNAKE_TICKS)) {
			this.tracks[tick.TYPE] = {};
		}
	}

	getAllCells() {
		return Object.values(this.snakes)
			.reduce((cells, snake) => {
				snake.keys.forEach((key, index) => {
					const cell = snake.hash[key];
					const { x, y } = cell;
					if (index == 0) {
						cells.push({ x, y, color: snake.headColor });
					} else {
						cells.push({ x, y, color: snake.bodyColor });
					}
				});
				return cells;
			}, [])
			.concat(
				Object.values(this.food).reduce((cells, food) => {
					const { x, y, type } = food;
					const { color, animationClass } = FOOD_TYPES[type];
					cells.push({ x: x, y: y, color, animationClass });
					return cells;
				}, []),
			);
	}

	attachKeyboard() {
		this.keyboardAbortController = new AbortController();

		document.addEventListener(
			'keydown',
			(event) => {
				const key = event.key.toLowerCase();
				if (['w', 'arrowup'].includes(key)) {
					Object.values(this.snakes).forEach((snake) => {
						snake.changeDirection(DIRECTIONS.UP);
					});
				} else if (['s', 'arrowdown'].includes(key)) {
					Object.values(this.snakes).forEach((snake) => {
						snake.changeDirection(DIRECTIONS.DOWN);
					});
				} else if (['a', 'arrowleft'].includes(key)) {
					Object.values(this.snakes).forEach((snake) => {
						snake.changeDirection(DIRECTIONS.LEFT);
					});
				} else if (['d', 'arrowright'].includes(key)) {
					Object.values(this.snakes).forEach((snake) => {
						snake.changeDirection(DIRECTIONS.RIGHT);
					});
				}
			},
			{ signal: this.keyboardAbortController.signal },
		);
	}

	detachKeyboard() {
		this.keyboardAbortController.abort();
	}

	addSnakeToTrack(trackId, snakeId) {
		if (trackId in this.tracks) {
			Object.assign(this.tracks[trackId], { [snakeId]: this.snakes[snakeId] });
		} else {
			throw new Error(`Invalid track ${trackId} supplied.`);
		}
	}

	removeSnakeFromTrack(trackId, snakeId) {
		delete this.tracks[trackId][snakeId];
	}

	initializeSnakes() {
		this.snakes = {};
		for (const [snakeId, initialSnakeState] of Object.entries(initialSnakesState)) {
			const snake = new Snake(initialSnakeState);
			this.snakes[snakeId] = snake;
			const trackId = snake.defaultTick;
			this.addSnakeToTrack(trackId, snakeId);
		}
	}

	initializeFood() {
		this.food = initialFoodState;
	}

	attachTickers() {
		this.timers = [];

		for (const tick of Object.values(SNAKE_TICKS)) {
			const { DURATION: duration } = tick;
			const timer = setInterval(() => {
				Object.values(this.tracks[tick.TYPE]).forEach((snake) => {
					snake.move();
					this.updateCells(this.getAllCells());
				});
			}, duration);
			this.timers.push(timer);
		}

		for (const { DURATION: duration } of Object.values(FOOD_TICKS)) {
			const timer = setInterval(() => {
				this.spawnFood();
				this.updateCells(this.getAllCells());
			}, duration);
			this.timers.push(timer);
		}
	}

	addFoodToGrid(x, y, foodType) {
		this.food[generateKey(x, y)] = { type: foodType, x, y };
	}

	removeFoodFromGrid(x, y) {
		const key = generateKey(x, y);
		if (key in this.food) {
			const removedFood = this.food[generateKey(x, y)];
			delete this.food[generateKey(x, y)];
			return removedFood;
		} else {
			throw new Error(`Unable to remove food, since there is no food at ${x}-${y}.`);
		}
	}

	spawnFood() {
		const cellsOccupiedBySnakes = Object.values(this.snakes).reduce((cells, snake) => {
			// Make sure there is integrity in snake's data before invoking this
			// method since it throws an error if two snakes occupy a single cell...
			const { hash } = snake;
			// for (const [key, value] of Object.entries(hash)) {
			// 	if (!(key in cells)) {
			// 		Object.assign(cells, { [key]: value });
			// 	} else {
			// 		throw new Error('Two snakes are occupying a single cell!');
			// 	}
			// }
			return Object.assign(cells, hash);
		}, {});

		const emptyCells = {};

		for (const [key, value] of Object.entries(GRID_MAP)) {
			if (!(key in cellsOccupiedBySnakes) && !(key in this.food)) {
				Object.assign(emptyCells, { [key]: value });
			}
		}

		const keys = Object.keys(emptyCells);
		if (keys.length > 0) {
			const randomEmptyCell = emptyCells[keys[generateRandomNumber(keys.length)]];
			const { x, y } = randomEmptyCell;

			this.addFoodToGrid(x, y, whichFoodToSpawn().TYPE);
		} else {
			console.warn('Map full!');
		}
	}

	detachTickers() {
		this.timers.forEach((timer) => {
			clearInterval(timer);
		});
	}

	onDestroy() {
		this.detachKeyboard();
		this.detachTickers();
	}
}

const grid = new Grid();

export { grid };
