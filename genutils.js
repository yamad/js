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

// zip n iterables, where 1st element is a list of 1st element of each
// iterable.
function* zip(...arrs) {
	const lengths = arrs.map(a => a.length);
	if (!lengths) return;

	const minlen = Math.min(...lengths);
	for (let i = 0; i < minlen; i++)
		yield arrs.map(a => a[i]);
}


module.exports = {
	chain,
	constant,
	drop,
	gslice,
	range,
	repeat,
	take,
	takeEvery,
	zip
};
