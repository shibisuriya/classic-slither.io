import { generateKey, getOppositeDirection, isCellValid } from './helpers';

import { DIRECTIONS, FOOD_EFFECTS, FOOD_TYPES } from './constants';
import { SNAKE_COLLIDED_WITH_WALL, SNAKE_SUCIDE } from './errors';
import cloneDeep from 'lodash/cloneDeep';

class Snake {
	constructor(snake) {
		// Organise the cells data into a hashMap so that it is easier to
		// perform computation on this data.
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
		if (direction === this.direction) {
			console.warn(`Snake is already moving in the ${direction} direction.`);
		} else if (getOppositeDirection(this.direction) === direction) {
			console.warn(`The snake can't make a 180 degree turn.`);
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

	move() {
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

	getHead() {
		const [headKey] = this.keys;
		const head = this.hash[headKey];
		return head;
	}
}

export default Snake;
