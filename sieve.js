// Sieve of Eratosthenes, Array of primes up to maxBound
function sieve(maxBound) {
	return [...sieveGen(maxBound)];
}

// Sieve of Eratosthenes, generator
function* sieveGen(maxBound) {
	let nums = [false, false, ...Array(maxBound-2).fill(true)];

	// find primes
	for (var i=2; i < Math.sqrt(maxBound); i++) {
		// find next true value, it is prime
		if (!nums[i])
			continue;

		// sieve out all multiples of the prime
		for (j=i*i; j < maxBound; j+=i)
			nums[j] = false;
	}

	// all remaining true values are primes
	for (var i = 2; i < maxBound; i++)
		if (nums[i])
			yield i;
}

module.exports = {
	sieve,
	sieveGen
}
