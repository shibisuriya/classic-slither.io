import Snake from './Snake';
import { DIRECTIONS, SNAKE_TICKS, FOOD_TICKS, FOOD_TYPES } from './constants';
import { initialSnakesState, GRID_MAP, initialFoodState } from './computed';
import { generateRandomNumber } from './utils';
import { generateKey, whichFoodToSpawn } from './helpers';
import { SNAKE_COLLIDED_WITH_WALL, SNAKE_SUCIDE } from './errors';

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

	removeSnakeFromTrack({ trackId, snakeId }) {
		if (trackId) {
			delete this.tracks[trackId][snakeId];
		} else {
			// Find track id, since it was not supplied.
			for (const track of Object.values(this.tracks)) {
				if (snakeId in track) {
					delete track[snakeId];
					return;
				}
			}
			throw new Error('The snake you requested to remove does not belong to any track!');
		}
	}

	initializeSnakes() {
		this.snakes = {};
		for (const [snakeId, initialSnakeState] of Object.entries(initialSnakesState)) {
			const snake = new Snake(initialSnakeState);
			snake.die = () => this.removeSnakeFromGrid(snakeId);
			this.snakes[snakeId] = snake;
			const trackId = snake.defaultTick;
			this.addSnakeToTrack(trackId, snakeId);
		}
	}

	initializeFood() {
		this.food = initialFoodState;
	}

	removeSnakeFromGrid(snakeId) {
		delete this.snakes[snakeId];
		this.removeSnakeFromTrack({ snakeId });
	}

	attachTickers() {
		this.timers = [];

		for (const tick of Object.values(SNAKE_TICKS)) {
			const { DURATION: duration } = tick;
			const timer = setInterval(() => {
				const updatedPositions = {};
				Object.entries(this.tracks[tick.TYPE]).forEach(([snakeId, snake]) => {
					try {
						updatedPositions[snakeId] = snake.move(); // Contains newHead and hash.;
					} catch (err) {
						if (err === SNAKE_COLLIDED_WITH_WALL || err === SNAKE_SUCIDE) {
							snake.die();
						} else {
							// We encounted some other problem, so throw upward towards
							// the error bounddary.
							throw err;
						}
						// A snake object is aware of,
						// 1) The map's boundaries.
						// 2) Itself, it knows when it has bite itself.
						// A snake object is not aware of other snakes.
						// Imagine each snake having it's own grid and
						// moving in its own grid without the knowledge about
						// food and other snakes. The `grid` (this) object is
						// what let's individual snakes communicate
						// with other snakes and food.
						// This behavior is intentional, to make the gameplay fair / correct
						// we have to perform parallel computation not serial computation.
						// That is we have to make each snake move 1 step forward and
						// check if the move is valid or not, or what happened in that particular move.
						// For that reason, advanced computation such as,
						// 1) Intake of food.
						// 2) Snake collision with other snake.
						// 3) Head to head snake collision.
						// are done below.
					}
				});

				// for (const snake of newPositions) {
				// 	const [head] = snake.data.keys;
				// 	const { x, y } = snake.data.hash[head];
				// 	if (!isCellValid(x, y)) {
				// 		this.removeSnakeFromTrack(snake.id);
				// 	}
				// }

				this.updateCells(this.getAllCells());
			}, duration);
			this.timers.push(timer);
		}

		// for (const { DURATION: duration } of Object.values(FOOD_TICKS)) {
		// 	const timer = setInterval(() => {
		// 		this.spawnFood();
		// 		this.updateCells(this.getAllCells());
		// 	}, duration);
		// 	this.timers.push(timer);
		// }
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
