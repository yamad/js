const test = require('tape');
const jsc = require('jsverify');

const { gslice } = require('./genutils')
const { zip_gen,
        zip_iterables,
        zip_delegatemin,
        zip_ntc } = require('./zip');


// generate list of randomly filled arrays
const anyPrimitive = jsc.oneof(jsc.number, jsc.falsy, jsc.bool, jsc.datetime, jsc.json)

function first(iterable) {
	const iterator = iterable[Symbol.iterator]()
	return iterator.next()
}

function is_empty_generator(gen) {
	const first_ = first(gen)
	return first_.done === true && first_.value === undefined
}

function is_empty_array(a) {
	return Array.isArray(a) && a.filter(n => n).length === 0
}

function is_iterable(a) {
	return typeof a[Symbol.iterator] === "function"
}

function equal_iterables(a, b) {
	const ita = a[Symbol.iterator]();
	const itb = b[Symbol.iterator]();

	while (true) {
		let [ ela, elb ] = [ ita.next(), itb.next() ]
		if (ela.value && is_iterable(ela.value) &&
		    elb.value && is_iterable(elb.value) &&
		    !equal_iterables(ela.value, elb.value))
			return false
		if (!jsc.utils.isEqual(ela.value, elb.value))
			return false
		if (ela.done !== elb.done)
			return false
		if (ela.done || elb.done)
			break
	}
	return true
}


// length of first element should be equal to number of inputs, for non-empty arrays
function prop_zipElementLength(zipfunc) {
	return jsc.forall(
		jsc.nearray(jsc.nearray(jsc.number)),
		(arrs) => {
			const result = first(zipfunc(...arrs))
			return arrs.length === result.value.length
		})
}

// if any input is empty, then no output
function prop_zipEmptyInput(zipfunc) {
	const gen_array_arrays = jsc.array(jsc.array(anyPrimitive))
	return jsc.forall(
		gen_array_arrays,
		gen_array_arrays,
		(front, back) => {
			const arrs = [...front, [], ...back] // seed empty input
			return is_empty_generator(zipfunc(...arrs))
		})
}

// zip is inverse of itself, but limited to smallest length
function prop_zipInverts(zipfunc) {
	return jsc.forall(
		jsc.nearray(jsc.nearray(jsc.integer)),
		(arrs) => {
			const result = [...zipfunc(...zipfunc(...arrs))]
			let minlen = Math.min(...result.map(a => a.length))
			if (minlen === Infinity)
				minlen = 0
			const sliced_input = arrs.map(a => [...gslice(a, minlen)])
			return equal_iterables(sliced_input, result)
		})
}

function make_test(zipfunc) {
	test(`${zipfunc.name} -- length of zipped elements === number of inputs`, (t) => {
		t.ok(jsc.check(prop_zipElementLength(zipfunc)))
		t.end()
	})

	test(`${zipfunc.name} -- if an empty input, no output`, (t) => {
		t.ok(jsc.check(prop_zipEmptyInput(zipfunc)))
		t.end()
	})

	test(`${zipfunc.name} -- zip inverts zip`, (t) => {
		t.ok(jsc.check(prop_zipInverts(zipfunc)))
		t.end()
	})

	test(`${zipfunc.name} returns empty list for no input`, (t) => {
		t.ok(is_empty_array([...zipfunc()]))
		t.end()
	})
}

make_test(zip_gen)
make_test(zip_iterables)
make_test(zip_delegatemin)
make_test(zip_ntc)
