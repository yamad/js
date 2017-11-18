const test = require('tape');
const { sieve, sieveGen } = require('./sieve')

test("Sieve generator - emits 2 first", function (t) {
	let sg = sieveGen(10);
	t.equal(sg.next().value, 2);
	t.end()
});

test("Sieve generator - exhausts items at expected time", function (t) {
	let sg = sieveGen(10);
	var i = 0;
	while (!(p = sg.next()).done || i === 1000)
		i++;
	t.notEqual(i, 1000);
	t.end();
});

test("Sieve - gets expected prime count", function (t) {
	let expected = { 10: 4,
	                 100: 25,
	                 1000: 168,
	                 10000: 1229,
	                 100000: 9592,
	                 1000000: 78498 };
	for (var bound in expected)
		t.equal(sieve(Number(bound)).length,
		        expected[bound]);
	t.end();
});

test("Sieve - gets correct values for bound 10", function (t) {
	t.deepEqual(sieve(10), [2, 3, 5, 7]);
	t.end();
});

test("Sieve - gets correct values for bound 100", function (t) {
	let expected = [2,3,5,7,11,13,17,19,23,29,31,37,41,
	                43,47,53,59,61,67,71,73,79,83,89,97];
	t.deepEqual(sieve(100), expected);
	t.end();
});

test("Sieve - gets correct (spot check) values for bound 100000", function (t) {
	let primes = sieve(100000);
	t.deepEqual(primes.slice(0, 4),
	            [2, 3, 5, 7], "first primes are right");
	t.deepEqual(primes.slice(-4),
	            [99961, 99971, 99989, 99991], "last primes are right");

	// 166th prime (0-indexed) is 991, etc.
	let spotChecks = { 166: 991,
	                   679: 5087,
	                   1139: 9199 };
	for (var k in spotChecks)
		t.equal(primes[k], spotChecks[k]);
	t.end();
});
