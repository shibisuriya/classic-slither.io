# Classic Slither.io

Experience Slither.io gameplay on a Nokia 6110-style snake game, powered by WebRTC.

<img src="demo/gameplay.gif" alt="Alt Text" width="400">

[Click here](https://shibisuriya.github.io/classic-slither.io/) to play against AI opponents.

[Click here](https://shibisuriya.github.io/classic-slither.io/) to engage in multiplayer gameplay with your friend(s). Utilizing WebRTC, your browser establishes direct communication with your friend's browser, eliminating the need for a centralized server(Work in progress).

## Game mechanics:

### The objective:

To win you have be the last snake alive in the map.

You will die if you,

1. Collide with the map's boundaries.
2. Collide with yourselves.
3. Collide with other snakes.
4. If two snakes have a head to head collision they both die.

**To succeed in this game, you must strategically position yourself so that your opponents collide with either you, the wall, or themselves.**

At regular intervals, a random type of food will spawn in map regions unoccupied by any snake. Snakes can enhance their size or acquire special abilities by consuming these food items.

### Types of food:

#### Frogs:

The snake's body grows by 1 cell if it consumes a frog.

#### The Shrink berries:

Eating a shrink berry decreases the snake's body length by 1 cell. It's important to note that if the snake's body is only 2 cells long, this food has no impact on the snake.

#### Red bull:

The snake gains speed of 1.5x if it consumes this food.

#### Fillets:

When a snake dies in the map its body gets converted to food, other snakes alive in the map can consume this food. The snake's body grows by 4 cells if it consumes a fillet.

## Implementation:

### The Render engine:

The game's rendering is managed by a basic React component, generating a sequence of `<div>` elements on the screen. The background color of each `<div>` changes periodically, providing the illusion of a game. However, referring to this as a rendering engine might be an overstatement. My intention was to maintain a deliberately simple game UI, allowing me to prioritize and concentrate on developing the multiplayer capabilities and AI opponents. This way, I avoid getting sidetracked by the intricacies of creating a visually stunning game, as one might encounter with frameworks featuring dedicated rendering engines like Babylon.js.

It's worth noting that React might not be the most optimal choice for this kind of work.
In the initial stages of developing this game, my understanding of React.js was quite limited. It didn't feel intuitive, leading me to refactor the rendering and game logic three times: initially with simple components, then incorporating custom hooks and ultimately using JavaScript objects to store and manage the game's data, updating the UI whenever a change occurs in the game's data. In this configuration, the UI remains essentially passive, displaying whatever the JavaScript object instructs. Consequently, this approach isolates the rendering from the game logic.

To gain insights into why React might not be the best fit for such scenarios, I recommend reading Dan Abramov's blog post, available at https://overreacted.io/react-as-a-ui-runtime.

### WebRTC:

The game operates without a backend, such as a WebSocket server; instead, it utilizes WebRTC to enable players to play with each other.
