import { generateKey, getOppositeDirection, isCellValid } from './helpers';

import { DIRECTIONS, FOOD_EFFECTS, FOOD_TYPES } from './constants';
import { SNAKE_COLLIDED_WITH_WALL, SNAKE_SUCIDE } from './errors';
import cloneDeep from 'lodash/cloneDeep';
import { BOTS } from './bots';

class Snake {
	constructor(snakeId, snake) {
		// Organise the cells data into a hashMap so that it is easier to
		// perform computation on this data.
		this.snakeId = snakeId;
		this.bodyColor = snake.bodyColor;
		this.headColor = snake.headColor;
		this.defaultTick = snake.defaultTick;
		this.keys = snake.cells.reduce((keys, cell) => {
			const { x, y } = cell;
			keys.push(generateKey(x, y));
			return keys;
		}, []);

		this.hash = snake.cells.reduce((hash, cell) => {
			const { x, y } = cell;
			hash[generateKey(x, y)] = cell;
			return hash;
		}, {});

		this.direction = snake.direction;
		this.buffs = {};

		if (snake.isBot) {
			this.loadBot(snake.botName);
		}
	}

	loadBot(botName) {
		this.isBot = true;
		this.botName = botName;
		this.annotations = [];
		this.bot = BOTS[botName].bot;
	}

	addBuff(type, buff) {
		switch (type) {
			case FOOD_EFFECTS.SPEED:
				this.changeSpeed(buff.tick);
				break;
			default:
				throw new Error(`Unknown buff ${type}...`);
		}

		this.buffs[type] = cloneDeep(buff);
	}

	removeBuff(type) {
		switch (type) {
			case FOOD_EFFECTS.SPEED:
				this.changeSpeed(this.defaultTick);
				break;
			default:
				throw new Error(`Unknown buff ${type} asked to removed!`);
		}

		delete this.buffs[type];
	}

	consume({ type: foodType }) {
		const food = FOOD_TYPES[foodType];

		for (const [type, effect] of Object.entries(food.effects)) {
			switch (type) {
				case FOOD_EFFECTS.GROW:
					this.growFromBehind(effect.units);
					break;
				case FOOD_EFFECTS.SPEED:
					this.addBuff(type, effect);
					break;
				default:
					throw new Error('Unknown food type consumed by the food.');
			}
		}
	}

	growFromBehind(units = 1) {
		for (let i = 1; i <= units; i++) {
			// Add a cell to the tail.
			// Determine in which direction to grow first :(

			const tail = this.getTail();
			const penultimateCell = this.getPenultimateCell();

			const { x: x2, y: y2 } = tail;
			const { x: x1, y: y1 } = penultimateCell;

			let newTail;
			let newTailKey;

			if (x1 - x2 === 1 && y2 - y1 === 0) {
				// up
				newTail = { x: x2 - 1, y: y1 };
				newTailKey = generateKey(newTail.x, newTail.y, true); // Skip validation
			} else if (x1 - x2 === -1 && y2 - y1 === 0) {
				// down
				newTail = { x: x2 + 1, y: y1 };
				newTailKey = generateKey(newTail.x, newTail.y, true);
			} else if (y1 - y2 === 1 && x2 - x1 === 0) {
				// right
				newTail = { x: x1, y: y2 - 1 };
				newTailKey = generateKey(newTail.x, newTail.y, true);
			} else if (y1 - y2 === -1 && x2 - x1 === 0) {
				// left
				newTail = { x: x1, y: y2 + 1 };
				newTailKey = generateKey(newTail.x, newTail.y, true);
			} else {
				throw new Error("Snake's data is corrupt!, unable to find the direction.");
			}

			// Now that we know the new tail, decide wheather to add it to the snake or not.
			// Don't add tail if,
			// 1) Is part of the wall.
			// 2) Is part of self.
			// 3) Is part of an opponent.

			const addTail = () => {
				this.keys.push(newTailKey);
				this.hash[newTailKey] = newTail;
			};

			if (this.grid.isFoodCell(newTail.x, newTail.y)) {
				// Remove the food if the added tail is occupied by the
				// food.
				this.grid.removeFoodFromGrid(newTail.x, newTail.y);
				addTail();
			} else if (isCellValid(newTail.x, newTail.y) && !(newTailKey in this.grid.getCellsOccupiedBySnakes())) {
				addTail();
			} else {
				// The cell before the tail cell is already occupied by either,
				// the opponent, self or the wall... So break out of the loop, can't
				// add any cells further.
				break;
			}
		}
	}

	getPenultimateCell() {
		if (this.keys.length >= 2) {
			// penultimate means 'last but one in a series of things; second last.'
			const penultimateKey = this.keys[this.keys.length - 2];
			const penultimateCell = this.hash[penultimateKey];
			return penultimateCell;
		} else {
			throw new Error("The snake has only a head! it doesn't even have a neck.");
		}
	}

	getTail() {
		if (this.keys.length > 0) {
			const tailKey = this.keys[this.keys.length - 1];
			return this.hash[tailKey];
		} else {
			throw new Error("The snake doesn't have a body, so unable to select the tailKey");
		}
	}

	changeDirection(direction) {
		// Since the game is designed in a way that the player can change the direction
		// n number of times before the next tick and the last changed direction will be the direction
		// in which the snake will move, the player can trick the snake into colliding with his own neck...

		const head = this.getHead();
		const neck = this.getNeck();

		if (direction === this.direction) {
			console.warn(`Snake is already moving in the ${direction} direction.`);
		} else if (getOppositeDirection(this.direction) === direction) {
			console.warn(`The snake can't make a 180 degree turn.`);
		} else if (direction === DIRECTIONS.LEFT && head.x - 1 === neck.x) {
			console.warn(`You are trying to put the neck into a state where it will collide with its own head...`);
		} else if (direction === DIRECTIONS.RIGHT && head.x + 1 === neck.x) {
			console.warn(`You are trying to put the neck into a state where it will collide with its own head...`);
		} else if (direction === DIRECTIONS.DOWN && head.y + 1 === neck.y) {
			console.warn(`You are trying to put the neck into a state where it will collide with its own head...`);
		} else if (direction === DIRECTIONS.UP && head.y - 1 === neck.y) {
			console.warn(`You are trying to put the neck into a state where it will collide with its own head...`);
		} else {
			this.direction = direction;
		}
	}

	addNewHead(newHead) {
		if (!isCellValid(newHead.x, newHead.y)) {
			throw SNAKE_COLLIDED_WITH_WALL;
		}

		const newKey = generateKey(newHead.x, newHead.y); // This method throws error.

		if (newKey in this.hash) {
			throw SNAKE_SUCIDE;
		}

		this.keys.unshift(newKey);
		this.hash[newKey] = newHead;
	}

	removeTail() {
		const tailKey = this.keys.pop();
		delete this.hash[tailKey];
	}

	getAnnotations() {
		if (this.isBot) {
			return this.annotations;
		} else {
			throw new Error("This snake is not a bot, can't get any annotations data...");
		}
	}

	updateAnnotations(annotations) {
		if (this.isBot) {
			this.annotations = annotations;
		} else {
			throw new Error('Trying to add annotations for a player that is not a bot?');
		}
	}

	move() {
		if (this.isBot) {
			// The snake has been asked to move to the next cell...
			// If this particular snake is a bot, implement the code for the bot logic here...
			// The 'bot' can only do 1 out of 3 things move 'left', 'right' or 'forward', simple.

			this.bot({
				move: this.changeDirection.bind(this),
				updateAnnotations: this.updateAnnotations.bind(this),
				gameData: this.game.getGameData(),
				self: this,
			});
		}

		switch (this.direction) {
			case DIRECTIONS.DOWN:
				this.moveDown();
				break;
			case DIRECTIONS.UP:
				this.moveUp();
				break;
			case DIRECTIONS.LEFT:
				this.moveLeft();
				break;
			case DIRECTIONS.RIGHT:
				this.moveRight();
				break;
			default:
				throw new Error(`Invalid direction ${this.direction}.`);
		}

		// Some buffs last for a certain number of ticks only.
		// Handle that here.
		for (const [type, buff] of Object.entries(this.buffs)) {
			switch (type) {
				case FOOD_EFFECTS.SPEED:
					if (buff.lastsFor > 0) {
						buff.lastsFor--;
					} else {
						this.changeSpeed(this.defaultTick);
						this.removeBuff(type);
					}
					break;
				default:
					throw new Error('Unknown buff...');
			}
		}
	}

	moveLeft() {
		this.removeTail(); // Remove the tail first since, the new head could be in the tail as well.

		const head = this.getHead();
		const newHead = { x: head.x - 1, y: head.y };
		this.addNewHead(newHead);
	}

	moveRight() {
		this.removeTail();

		const head = this.getHead();
		const newHead = { x: head.x + 1, y: head.y };
		this.addNewHead(newHead);
	}

	moveUp() {
		this.removeTail();

		const head = this.getHead();
		const newHead = { x: head.x, y: head.y - 1 };
		this.addNewHead(newHead);
	}

	moveDown() {
		this.removeTail();

		const head = this.getHead();
		const newHead = { x: head.x, y: head.y + 1 };
		this.addNewHead(newHead);
	}

	getHeadAndHash() {
		const [headKey] = this.keys;
		const head = this.hash[headKey];
		return {
			head,
			headKey,
			hash: this.hash,
		};
	}

	getNeck() {
		const [_, neckKey] = this.keys;
		const neck = this.hash[neckKey];
		return neck;
	}

	getHead() {
		const [headKey] = this.keys;
		const head = this.hash[headKey];
		return head;
	}

	getBody() {
		const body = [];
		for (let i = 1; i < this.keys.length; i++) {
			const key = this.keys[i];
			body.push(this.hash[key]);
		}
		return body;
	}

	getCells() {
		return this.keys.reduce((cells, key) => {
			cells.push(this.hash[key]);
			return cells;
		}, []);
	}
}

export default Snake;
