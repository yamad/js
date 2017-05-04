// hash table, linear chaining

function HashTable() {
	let arrLength = 997,
	    arr = Array(arrLength).fill([]),
	    count = 0;

	function fancyHashFunction(key) { return key % arrLength; }
	function hash(key) {
		return fancyHashFunction(key) % arrLength;
	};

	// an entry in the hash table
	function Entry(key, value) {
		return { key: key, value: value };
	}

	function insert(key, value) {
		arr[hash(key)].push(Entry(key, value));
		return ++count;
	}

	function get(key) {
		for (let entry of arr[hash(key)]) {
			if (key === entry.key)
				return entry.value;
		}
		return undefined;
	}

	function has(key) {
		for (let entry of arr[hash(key)]) {
			if (key === entry.key)
				return true;
		}
		return false;
	}

	// mimic ES6 Map API
	var api = {
		get: get,
		set: insert,
		has: has
	};
	// value types need special handling to be non-writable
	Object.defineProperty(api, "count", { get: () => count });

	return api;
}

module.exports = HashTable;
