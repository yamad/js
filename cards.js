export function createDeck() {
	return Array(52).fill(0).map((x, i) => i+1);
}

export function shuffleDeck(deck) {
	return knuthShuffle(deck);
}

export function dealTop(deck) {
	if (!deck.length) throw new Error("Deck is empty");
	return { top: deck[0], rest: deck.slice(1) };
}

/**
 * Shuffle elements of an array using Knuth-Fisher-Yates algorithm
 * @see Knuth, TAOCP vol 2, pg. 145, Algorithm P
 *
 * @return Array copy of input with shuffled elements
 */
function knuthShuffle(arr) {
	shuffled = arr.slice();     // copy array
	let len = shuffled.length;
	for (let i = 0; i < len; i++) {
		let j = getRandomInt(i, len);
		let tmp = shuffled[i];
		shuffled[i] = shuffled[j];
		shuffled[j] = tmp;
	}
	return shuffled;
}

/**
 * Get random integer between min and less than max
 * code from MDN
 */
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max-min)) + min;
}
