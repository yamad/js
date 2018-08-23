// Return minimum element, comparing elements by result of the
// function `key`
function min(arr, key = x => x, fallback = undefined) {
	const index = argmin(arr.map(key));
	if (index === undefined)
		return fallback;
	return arr[index];
}


// Return index of minimum value in `iterable`
function argmin(iterable) {
    let min_index = undefined;
    let min_value = Infinity;
    iterable.forEach(function(x, i) {
        if (x < min_value) {
            min_value = x;
            min_index = i;
        }
    });
    return min_index;
}


// Return true if any value in iterable is pred(x) === true
function any(iterable, pred = x => x) {
    return iterable.reduce(
        (acc, x) => acc || pred(x),
        false);
}


// extract properties `props` from object `obj`, optionally
// transforming the keys using `keyfunc` and values using `valfunc`
function pickWith(obj, props, keyfunc = x => x, valfunc = x => x) {
	const res = {}
	for (const prop of props)
		res[keyfunc(prop)] = valfunc(obj[prop]);
	return res
}


function isEmptyArray(arr) {
	return Array.isArray(arr) &&
	       arr.filter(n => n !== undefined).length === 0;
}


module.exports = {
	min, argmin,
	any,
	pickWith,
	isEmptyArray,
}
