const SNAKE_COLLIDED_WITH_WALL = new Error('Snake collided with the wall.');
const SNAKE_SUCIDE = new Error('Snake bite itself.');

// Adding these for consistency reasons.
const SNAKE_HEAD_COLLISION = new Error(`Two snakes heads have collided into each other.`);
const SNAKE_BODY_COLLISION = new Error(`A snake has collied into another snake's body.`);

export { SNAKE_COLLIDED_WITH_WALL, SNAKE_SUCIDE, SNAKE_HEAD_COLLISION, SNAKE_BODY_COLLISION };
