// Requirements: If the user wants to add a bot, he should be able to export a
// function or object or whatever...

import { headHunter } from './bots/headHunter.js';

const SCRIPTED_BOTS = {
	HEAD_HUNTER: {
		key: 'HEAD_HUNTER',
		label: 'Head hunter',
		description: "Runs after the player's head, the bot is sucidal...",
		bot: headHunter,
	},
};

export { SCRIPTED_BOTS };

// TODO: Move this to a unit test.
Object.entries(SCRIPTED_BOTS).forEach(([key, value]) => {
	if (key !== value.key) {
		throw new Error('Key and name not equal, ', 'key = ', key, ' name = ', value.key);
	}
});
