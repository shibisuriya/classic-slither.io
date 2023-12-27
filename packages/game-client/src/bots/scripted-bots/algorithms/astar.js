import { NUMBER_OF_COLUMNS, NUMBER_OF_ROWS } from '../../../constants';

function astar(start, end, obstacles) {
	// Define a Node class to represent each cell on the grid
	class Node {
		constructor(x, y) {
			this.x = x;
			this.y = y;
			this.g = 0; // Cost from start node
			this.h = heuristic(this, end); // Heuristic (estimated cost to goal)
			this.f = this.g + this.h; // Total cost
			this.parent = null; // Parent node for constructing the final path
		}
	}

	// Calculate the Manhattan distance with an additional penalty for diagonal movements
	function heuristic(node, target) {
		const dx = Math.abs(node.x - target.x);
		const dy = Math.abs(node.y - target.y);
		const penalty = 0.001; // Adjust the penalty factor as needed

		return dx + dy + penalty * Math.min(dx, dy);
	}

	// Check if a node is valid (not an obstacle and within bounds)
	function isValid(node) {
		return (
			node.x >= 0 &&
			node.x < NUMBER_OF_COLUMNS &&
			node.y >= 0 &&
			node.y < NUMBER_OF_ROWS &&
			!obstacles.some((obstacle) => obstacle.x === node.x && obstacle.y === node.y)
		);
	}

	// Get neighbors of a node
	function getNeighbors(node) {
		const neighbors = [];
		const directions = [
			{ x: 1, y: 0 },
			{ x: 0, y: 1 },
			{ x: -1, y: 0 },
			{ x: 0, y: -1 },
		];

		for (const dir of directions) {
			const neighbor = new Node(node.x + dir.x, node.y + dir.y);
			if (isValid(neighbor)) {
				neighbors.push(neighbor);
			}
		}

		return neighbors;
	}

	// Initialize the open and closed sets
	const openSet = [new Node(start.x, start.y)];
	const closedSet = [];

	// Main A* algorithm loop
	while (openSet.length > 0) {
		// Find the node with the lowest f value in the open set
		const current = openSet.reduce((minNode, node) => (node.f < minNode.f ? node : minNode));

		// Move current node from open to closed set
		openSet.splice(openSet.indexOf(current), 1);
		closedSet.push(current);

		// If we reached the goal, reconstruct the path and return it
		if (current.x === end.x && current.y === end.y) {
			const path = [];
			let temp = current;
			while (temp) {
				path.unshift({ x: temp.x, y: temp.y });
				temp = temp.parent;
			}
			return path;
		}

		// Explore neighbors
		const neighbors = getNeighbors(current);
		for (const neighbor of neighbors) {
			// Skip if neighbor is in the closed set
			if (closedSet.some((node) => node.x === neighbor.x && node.y === neighbor.y)) continue;

			// Calculate tentative g value
			const tentativeG = current.g + 1;

			// Add neighbor to open set if it's not there or has a better path
			if (!openSet.some((node) => node.x === neighbor.x && node.y === neighbor.y) || tentativeG < neighbor.g) {
				neighbor.g = tentativeG;
				neighbor.h = heuristic(neighbor, end);
				neighbor.f = neighbor.g + neighbor.h;
				neighbor.parent = current;

				// Add to open set if not already present
				if (!openSet.some((node) => node.x === neighbor.x && node.y === neighbor.y)) {
					openSet.push(neighbor);
				}
			}
		}
	}

	// If open set is empty and goal is not reached, return an empty array
	return [];
}

export { astar };
