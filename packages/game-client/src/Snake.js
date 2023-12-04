import { generateKey, getOppositeDirection } from './helpers';

import { DIRECTIONS } from './constants';

class Snake {
	constructor(snake) {
		// Organise the cells data into a hashMap so that it is easier to
		// perform computation on this data.
		this.bodyColor = snake.bodyColor;
		this.headColor = snake.headColor;
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
		const newKey = generateKey(newHead.x, newHead.y);
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
		}
	}

	moveLeft() {
		const head = this.getHead();
		const newHead = { x: head.x - 1, y: head.y };
		this.addNewHead(newHead);
		this.removeTail();
	}

	moveRight() {
		const head = this.getHead();
		const newHead = { x: head.x + 1, y: head.y };
		this.addNewHead(newHead);
		this.removeTail();
	}

	moveUp() {
		const head = this.getHead();
		const newHead = { x: head.x, y: head.y - 1 };
		this.addNewHead(newHead);
		this.removeTail();
	}

	moveDown() {
		const head = this.getHead();
		const newHead = { x: head.x, y: head.y + 1 };
		this.addNewHead(newHead);
		this.removeTail();
	}

	getHead() {
		const [headKey] = this.keys;
		const head = this.hash[headKey];
		return head;
	}
}

export default Snake;
