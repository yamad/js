/// utility functions to make javascript generators useful

// return first n items of iterable
function* take(iterable, n=1) {
	const iterator = iterable[Symbol.iterator]();
	for (let _ of range(n)) {
		const {done, value} = iterator.next();
		if (done) return;
		else yield value;
	}
}

// return every nth item of iterable
function* takeEvery(iterable, step=1) {
	let iterator = iterable[Symbol.iterator]();
	while (true) {
		const {done, value} = iterator.next();
		if (done) return;
		else yield value;

		for (let _ of range(step-1))
			iterator.next();
	}
}

// drop first n items of iterable and return rest
function* drop(iterable, n) {
	const iterator = iterable[Symbol.iterator]();
	for (let _ of range(n)) {
		const {done, _} = iterator.next();
		if (done) return;
	}
	yield* iterator;
}

// return joined iterable, [[1,2], [3, 4]] -> [1, 2, 3, 4]
function* chain(...iterables) {
	for (let iterable of iterables)
		yield* iterable[Symbol.iterator]();
}

// return integers from start to stop, in intervals of step
// if only one argument, return integers up to stop
function* range(start, stop, step=1) {
	if (stop === undefined) {
		stop = start;
		start = 0;
	}
	for (let i = start; i < stop; i += step)
		yield i;
}

// repeat given value n times
function* repeat(value, times=Infinity) {
	for (const _ of range(times))
		yield value
}

// return value forever
function* constant(value) {
	yield* repeat(value);
}

// return natural numbers [0,1,2,...]
function* naturals() {
	yield* range(0, Infinity);
}

// attach index to enumerate iterable
function* enumerate(iterable) {
	yield* zip(naturals(), iterable);
}

// return slice of generator from indices start (inclusive) to stop
// (exclusive). if only two arguments given, the second argument is
// interpreted as stop.
function* gslice(iterable, start, stop, step=1) {
	if (stop === undefined) {
		stop = start;
		start = 0;
	}

	let iterator = iterable[Symbol.iterator]();
	if (start > 0)
		iterator = drop(iterator, start);
	iterator = take(iterator, stop-start);
	yield* takeEvery(iterator, step);
}


// zip n iterables
function* zip(...iterables) {
	if (iterables.length === 0) return;
	const iters = iterables.map(a => a[Symbol.iterator]());
	while (true) {
		const nexts = iters.map(a => a.next());
		const dones = nexts.map(a => a.done);
		if (dones.some(d => d === true))
			return;
		yield nexts.map(a => a.value)
	}
}

function* gmap(iterable, callback, this_) {
	const f = callback.bind(this_)
	switch (callback.length) {
	case 1:
		for (const el of iterable)
			yield f(el)
		break
	case 2:
	case 3:
		for (const [i, el] of enumerate(iterable))
			yield f(el, i, iterable)
		break
	default:
		// some sort of error
		break
	}
}


function argcompare(iterable, cmp, start) {
	let min_index = undefined;
	let min_value = start;
	for (const [i, x] of enumerate(iterable)) {
		if (cmp(x, min_value)) {
			min_value = x;
			min_index = i;
		}
	}
	return min_index;
}

function argmin(iterable) {
	const min_ = (a, b) => a < b
	return argcompare(iterable, min_, Infinity)
}

function argmax(iterable) {
	const max_ = (a, b) => a > b
	return argcompare(iterable, max_, -Infinity)
}


module.exports = {
	argcompare,
	chain,
	constant,
	drop,
	enumerate,
	gmap,
	gslice,
	naturals,
	range,
	repeat,
	take,
	takeEvery,
	zip
};
