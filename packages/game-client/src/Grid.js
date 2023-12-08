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
			// Supply some utils to each snake.
			snake.grid = {
				isFoodCell: this.isFoodCell.bind(this),
				removeFoodFromGrid: this.removeFoodFromGrid.bind(this),
				getCellsOccupiedBySnakes: this.getCellsOccupiedBySnakes.bind(this),
			};
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
				const movedSnakesHash = {};
				const fedSnakesHash = {};

				Object.entries(this.tracks[tick.TYPE]).forEach(([snakeId, snake]) => {
					try {
						snake.move(); // At this point in time the grid data will be inconsistent.
						const headAndHash = snake.getHeadAndHash();
						movedSnakesHash[snakeId] = headAndHash;

						// Just note down wheather a snake has consume a food in this tick.
						const { head } = headAndHash;
						if (this.isFoodCell(head.x, head.y)) {
							const food = this.removeFoodFromGrid(head.x, head.y);
							fedSnakesHash[snakeId] = { snake, food };
						}
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

				const idleSnakesHash = Object.entries(this.snakes).reduce((hash, [snakeId, snake]) => {
					if (!(snakeId in movedSnakesHash)) {
						hash[snakeId] = snake.getHeadAndHash();
					}
					return hash;
				}, {});

				const idleSnakes = Object.entries(idleSnakesHash);
				const movedSnakes = Object.entries(movedSnakesHash);

				const snakesToRemove = {};

				// Handle
				// 1) Two snake colliding head to head.
				// 2) A snake colliding into another snake.
				for (let i = 0; i < movedSnakes.length; i++) {
					const [snakeOneId, { headKey: snakeOneHeadKey, hash: snakeOneHash }] = movedSnakes[i];
					for (let j = i + 1; j < movedSnakes.length; j++) {
						const [snakeTwoId, { headKey: snakeTwoHeadKey, hash: snakeTwoHash }] = movedSnakes[j];
						if (snakeOneHeadKey === snakeTwoHeadKey) {
							snakesToRemove[snakeOneId] = this.snakes[snakeOneId];
							snakesToRemove[snakeTwoId] = this.snakes[snakeTwoId];
						} else if (snakeOneHeadKey in snakeTwoHash) {
							snakesToRemove[snakeOneId] = this.snakes[snakeOneId];
						} else if (snakeTwoHeadKey in snakeOneHash) {
							snakesToRemove[snakeTwoId] = this.snakes[snakeTwoId];
						}
					}

					// Handle collision of a snake that has moved
					// in this particular tick with a snake that
					// doesn't operate in this tick.

					for (let k = 0; k < idleSnakes.length; k++) {
						const [snakeTwoId, { headKey: snakeTwoHeadKey, hash: snakeTwoHash }] = idleSnakes[k];
						if (snakeOneHeadKey === snakeTwoHeadKey) {
							snakesToRemove[snakeOneId] = this.snakes[snakeOneId];
							snakesToRemove[snakeTwoId] = this.snakes[snakeTwoId];
						} else if (snakeOneHeadKey in snakeTwoHash) {
							snakesToRemove[snakeOneId] = this.snakes[snakeOneId];
						}
						// No need to to check snakeTwo's head colliding on snakeOne's body
						// since snakeTwo is idle in this tick.
					}
				}

				Object.values(snakesToRemove).forEach((snake) => snake.die());

				// To handle consumption of food.

				Object.values(fedSnakesHash).forEach(({ snake, food }) => {
					snake.consume(food);
				});

				// Grid data becomes consistent here, so update the UI.
				this.updateCells(this.getAllCells());
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
		if (this.isFoodCell(x, y)) {
			const key = generateKey(x, y);
			const removedFood = this.food[key];
			delete this.food[key];
			return removedFood;
		} else {
			throw new Error(`Unable to remove food, since there is no food at ${x}-${y}.`);
		}
	}

	isFoodCell(x, y) {
		const key = generateKey(x, y);
		return key in this.food;
	}

	getCellsOccupiedBySnakes() {
		return Object.values(this.snakes).reduce((cells, snake) => {
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
	}

	spawnFood() {
		const cellsOccupiedBySnakes = this.getCellsOccupiedBySnakes();

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
