import { generateKey } from './utils.js';
export default class OrderedHash {
	constructor({ list = [], columns, rows } = {}) {
		this.columns = columns;
		this.rows = rows;
		this.orderedHash = {};
		this.keys = [];
		list.forEach((item) => {
			this.push(...item);
		});
	}
	push(x, y) {
		const key = generateKey(x, y, this.columns, this.rows);
		if (!this.keys.includes(key)) {
			this.keys.push(key);
		} else {
			throw new Error("Error: The key already exists in the 'OrderedHash'.");
		}
		this.orderedHash[key] = [x, y];
	}
	/**
	 * Adds an element to the beginning of the ordered hash.
	 * @param {any} x - Data to be added to the ordered hash.
	 * @param {any} y - Data to be added to the ordered hash.
	 * @returns {void}
	 */
	unshift(x, y) {
		const key = generateKey(x, y, this.columns, this.rows);
		if (!this.keys.includes(key)) {
			this.keys.unshift(key);
		} else {
			throw new Error("Error: The key already exists in the 'OrderedHash'.");
		}
		this.orderedHash[key] = [x, y];
	}
	remove(x, y) {
		const key = generateKey(x, y, this.columns, this.rows);
		if (this.keys.includes(key)) {
			this.keys.splice(this.keys.indexOf(key), 1);
			delete this.orderedHash[key];
		} else {
			throw new Error("Error: The key doesn't exists in the 'OrderedHash'.");
		}
	}
	count() {
		return this.keys.length;
	}
	get(x, y) {
		const key = generateKey(x, y, this.columns, this.rows);
		return this.orderedHash[key];
	}
	getOrderedHash() {
		return this.orderedHash;
	}
	getKeys() {
		return this.keys;
	}
	getArray() {
		return this.keys.map((key) => this.orderedHash[key]);
	}
	getHead() {
		const [head] = this.keys;
		return this.orderedHash[head];
	}
	getBody() {
		const [head, ...body] = this.keys;
		return body.map((key) => this.orderedHash[key]);
	}
	getTail() {
		const key = this.keys[this.keys.length - 1];
		return this.orderedHash[key];
	}
	getNeck() {
		return this.orderedHash[this.keys[1]];
	}
}
