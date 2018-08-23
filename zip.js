const { min } = require('./utils')

// basic zip as generator
// assumes all inputs are arrays
function* zip_gen(...arrs) {
	if (arrs.length === 0) return;
	const minlen = Math.min(...arrs.map(a => a.length));
	for (let i = 0; i < minlen; i++)
		yield arrs.map(a => a[i]);
}


// zip generator, takes any iterable
function* zip_iterables(...iterables) {
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


// zip 2 iterables
// loop by recursive tail call
function zip_tc(a, b, acc = []) {
	if (a.length === 0 || b.length === 0)
		return acc;

	const [x, ...xs] = a;
	const [y, ...ys] = b;
	return zip_tc(xs, ys, acc.concat([[x, y]]));
}


// zip n iterables
// looping by recursive tail call
function zip_ntc(...args) {
	function zip_iter(iters, acc) {
		if (iters.some(x => x.length === 0))
			return acc;

		const heads = iters.map(x => x[0]);
		const rests = iters.map(x => x.slice(1));
		return zip_iter(rests, [...acc, heads]);
	}

	if (args.length === 0) return [];
	return zip_iter(args, []);
}


function zip_delegatemin(...arrs) {
    const shortest = min(arrs, x => x.length, []);
    const vals_at  = i => arrs.map(x => x[i]);
    return shortest.map((_, i) => vals_at(i));
}


// zip array of keys and array of values into an object
function zip_object(keys, values) {
    const obj = {};
    for (const [key, val] of zip_iterables(keys, values))
        obj[key] = val;
    return obj;
}

const zip = zip_iterables;

module.exports = {
	zip,
	zip_delegatemin,
	zip_iterables,
	zip_gen,
	zip_tc,
	zip_ntc,
	zip_object
}
