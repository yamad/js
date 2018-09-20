// original code posted by @Gianina Skarlett
// in #javascript channel of Learn Teach Code Slack
// refactored: jyh 2018-09-19

function mostFrequentWord(text) {
	let words = toWords(text);      // text -> [word]
	let freqs = frequencies(words); // { word : count }
	let maxWord = maxKey(freqs);    // word
	return maxWord;
}


function toWords(string) {
	const delimiters = /[ ,!.";:-]+/;
	return string
		.toLowerCase()
		.split(delimiters)
		.filter(Boolean);       // removes falsy values
}

// return count of occurrences of each element in array `arr`
function frequencies(arr) {
	let freq = {}
	for (const el of arr)
		freq[el] = freq.hasOwnProperty(el) ? freq[el] + 1 : 1
	return freq;
}

// return key of property in object `obj` with maximum value
function maxKey(obj) {
	let maxKey = undefined;
	let maxValue = -Infinity;
	for (const [key, value] of Object.entries(obj)) {
		if (value > maxValue) {
			maxKey = key;
			maxValue = value;
		}
	}
	return maxKey;
}
