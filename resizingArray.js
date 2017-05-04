// resizing array
//
// note: this is obviously silly in JS. JS "arrays" are objects with
// integer keys, and resize automatically.

function ResizingArray(startCapacity = 0) {
	let resizeFactor = 2,
	    store = Array(startCapacity),
	    nitems = 0;

	function put(value) {
		if (nitems >= store.length)
			resize();
		store[nitems++] = value;
	}

	function get(index) {
		return store[index];
	}

	function resize() {
		let newStore = Array(store.length * resizeFactor);
		store.forEach((e, i) => newStore[i] = e); // copy
		store = newStore;
		return store.length;
	}

	var api = Object.create({   // methods
		put: put,
		get: get
	}, {                        // properties (read-only) [note 1]
		count: { get: () => nitems },
		capacity: { get: () => store.length }
	});
	return api;
}

function makeResizingArray(startCapacity) {
	return ResizingArray(startCapacity);
}

module.exports = makeResizingArray; // use nodejs convention

// note 1: this trick allows property access syntax (x.count) for
// reading an internal variable. without this, we'd need to read these
// variables with a getter function (e.g., x.count(), x.getCount()).
