import { generateKey, getOppositeDirection, isCellValid } from './helpers';

import { DIRECTIONS } from './constants';
import { SNAKE_COLLIDED_WITH_WALL, SNAKE_SUCIDE } from './errors';

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
				return this.moveDown();
			case DIRECTIONS.UP:
				return this.moveUp();
			case DIRECTIONS.LEFT:
				return this.moveLeft();
			case DIRECTIONS.RIGHT:
				return this.moveRight();
			default:
				throw new Error(`Invalid direction ${this.direction}.`);
		}
	}

	moveLeft() {
		this.removeTail(); // Remove the tail first since, the new head could be in the tail as well.

		const head = this.getHead();
		const newHead = { x: head.x - 1, y: head.y };
		this.addNewHead(newHead);

		return this.getHeadAndHash();
	}

	moveRight() {
		this.removeTail();

		const head = this.getHead();
		const newHead = { x: head.x + 1, y: head.y };
		this.addNewHead(newHead);

		return this.getHeadAndHash();
	}

	moveUp() {
		this.removeTail();

		const head = this.getHead();
		const newHead = { x: head.x, y: head.y - 1 };
		this.addNewHead(newHead);

		return this.getHeadAndHash();
	}

	getHeadAndHash() {
		const [headKey] = this.keys;
		return {
			headKey,
			hash: this.hash,
		};
	}

	moveDown() {
		this.removeTail();

		const head = this.getHead();
		const newHead = { x: head.x, y: head.y + 1 };
		this.addNewHead(newHead);

		return this.getHeadAndHash();
	}

	getHead() {
		const [headKey] = this.keys;
		const head = this.hash[headKey];
		return head;
	}
}

export default Snake;
