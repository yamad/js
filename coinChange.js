// @flow

/**
 * return array of all values in entries of object `obj` (*polyfill*)
 */
if (!Object.values) {
	Object.values = function values(obj) {
		if (obj)
			return Object.keys(obj).reduce(function(acc, k) {
				if (typeof k === 'string' && obj.propertyIsEnumerable(k))
					return acc.concat([obj[k]]);
				return acc;
			}, []);
		return [];
	};
}

/**
 * Return all ways to make amount using given coin denominations
 * (using direct recursion and no memoization)
 *
 * @param amt   amount of change to make
 * @param coins list of coin denominations to use
 * @return list of solutions, each a list of coins
 */
function coinChange(amt: number, coins: Array<number>): Array<Array<number>> {
	if (amt === 0) return [];

	let solutions = [];
	coins.forEach(function ccr(c, i) {
		if (amt - c < 0)   return;              // too large
		if (amt - c === 0) solutions.push([c]); // solution complete
		else {
			// solutions for remaining amount using coins this large and smaller
			let subsols = coinChange(amt-c, coins.slice(0, i+1));
			solutions = solutions.concat(subsols.map(x => x.concat(c)));
		}
	});
	return solutions;
}

/**
 * Return all ways to make amount using given coin denominations
 * (using memoization)
 *
 * @param amt   amount of change to make
 * @param coins list of coin denominations to use
 * @return list of solutions, each a list of coins
 */
let memo = {}
function memoKey(amt: number, coins: Array<number>): string {
	return amt + "-" + coins.join(",");
}

function coinChangeMemo(amt: number, coins: Array<number>): Array<Array<number>> {
	if (amt === 0) return [];
	if (memo[memoKey(amt, coins)]) return memo[memoKey(amt, coins)];

	let solutions = [];
	coins.forEach(function ccr(c, i) {
		if (amt - c < 0)   return;              // too large
		if (amt - c === 0) solutions.push([c]); // solution complete
		else {
			// solutions for remaining amount using coins this large and smaller
			let subsols = coinChangeMemo(amt-c, coins.slice(0, i+1));
			solutions = solutions.concat(subsols.map(x => x.concat(c)));
		}
	});
	memo[memoKey(amt, coins)] = solutions;
	return solutions;
}


function zeroArrayMatrix(rows, cols) {
	// make second dimension object { 0:0, 1:0, 2:0 ... }
	function column() {
		let a = Array(cols).fill(0).reduce(function(obj, x, i) {
			obj[i] = [];
			return obj;
		}, {});
		return a;
	};

	// make first dimension
	let table = Array(rows).fill(0).reduce(function(obj, x, row) {
		obj[row] = column();
		return obj;
	}, {});

	return table;
}

function sum(array) {
	let add = (a, b) => a + b;
	return Object.values(array).reduce(add, 0);
}


/**
 * Return all ways to make amount using given coin denominations
 * (using bottom-up tabulation)
 *
 * @param amount amount of change to make
 * @param coins  list of coin denominations to use
 * @return list of solutions, each a list of coins
 */
function coinChangeTab(amount: number, coins: Array<number>): number {
	if (amount === 0)       return 0;
	if (coins.length === 0) return 0;

	coins.sort((a,b) => a - b); // js sorts lexicographically by
	// default!! give it numeric compare

	// 2-D matrix of solutions, rows: amounts, cols: # of coin types
	// element x[amount][#coins] = all ways of getting amount using exactly # of coin types
	//
	// add 1s to get a 0-row for base case of amount 0
	//
	// base case:
	//  - 0 ways to get amount of 0 for any number of coins (0-row)
	//  - 0 ways to get any amount using 0 coins (0-column)
	let table = zeroArrayMatrix(amount+1, coins.length);

	// new solution adds one of current coin value to
	//  - each way to get to amount (amount - coin value)
	//  - using the same or fewer coin denominations
	//
	// e.g. to get to 10 using coin denominations [1,5]:
	//   - add 5 coin to each way to get to amount 6-1=5
	//   - using just 1 coin  ([1,1,1,1,1]) -> [5,1,1,1,1,1]
	//   - using just 2 coins ([5])         -> [5,5]
	for (let amt = coins[0]; amt <= amount; amt += 1) {
		for (let ic = 0; ic < coins.length; ic++) {
			let coinVal = coins[ic],
		         prevAmt = amt - coinVal;

			if (prevAmt < 0) break; // coins too large for current amt

			if (coinVal === amt)    // 1 coin solution
				table[amt][ic].push([coinVal]);

			for (let jc = 0; jc <= ic; jc++) {
				let newSols = table[prevAmt][jc].map(
					sol => sol.concat(coinVal)
				);
				table[amt][ic].push(...newSols);
			}
		}
	}

	//let numSols = sum(table[amount].values().map(x => x.length));
	return Object.values(table[amount]);
}


/**
 * Return the number of ways to make change for amount using given
 * coin denominations (using bottom-up tabulation)
 *
 * @param {number}        amount   amount of change to make
 * @param {Array<number>} coins list of coin denominations to use
 * @return {number} count of ways to get amount using given coins
 */
function coinChangeTabCount(amount, coins) {
	if (amount === 0) return 0;
	if (coins.length === 0) return 0;

	coins.sort((a, b) => a - b); // js sorts lexicographically by
	// default!! give it numeric compare

	// 2-D matrix of solutions, rows: amounts, cols: # of coin types
	// element x[amount][#coins] = all ways of getting amount using exactly # of coin types
	//
	// add 1s to get a 0-row for base case of amount 0
	//
	// base case:
	//  - 0 ways to get amount of 0 for any number of coins (0-row)
	//  - 0 ways to get any amount using 0 coins (0-column)
	let table = {'0':{'0': 0}};

	// new solution adds one of current coin value to
	//  - each way to get to amount (amount - coin value)
	//  - using the same or fewer coin denominations
	//
	// e.g. to get to 10 using coin denominations [1,5]:
	//   - add 5 coin to each way to get to amount 6-1=5
	//   - using just 1 coin  ([1,1,1,1,1]) -> [5,1,1,1,1,1]
	//   - using just 2 coins ([5])         -> [5,5]
	for (let amt = 1; amt <= amount; amt += 1) {
		table[amt] = {};
		for (let ic = 0; ic < coins.length; ic++) {
			table[amt][ic] = 0;
			let coinVal = coins[ic],
			    prevAmt = amt - coinVal;

			if (prevAmt < 0) break; // coins too large for current amt

			if (coinVal === amt) // 1 coin solution
				table[amt][ic] += 1;

			for (let jc = 0; jc <= ic; jc++) {
				if (table[prevAmt] && table[prevAmt][jc])
					table[amt][ic] += table[prevAmt][jc];
			}
		}
	}

	return sum(Object.values(table[amount]));
}

function unique(arr) {
	const appendIfUnique = function appendIfUnique(arr, e) {
		if (arr.length === 0)       return [e];
		if (arr.indexOf(e) === -1)  arr.push(e);
		return arr;
	};

	//if (!Array.isArray(sortedArr)) return [];
	//if (sortedArr.length === 1) return sortedArr;
	return arr.slice(1).reduce(appendIfUnique, [arr[0]]);
}

function unique2(sortedArr) {
	return Array.from(new Set(sortedArr));
}

/**
 * Return the number of ways to make change for amount using given
 * coin denominations (using bottom-up tabulation), alternative
 *
 * @param {number}        amount   amount of change to make
 * @param {Array<number>} coins list of coin denominations to use
 * @return {number} count of ways to get amount using given coins
 *
 * After looking at other solutions, reimplement based on some
 * especially clean solutions
 */
function coinChangeCount2(amount, coins) {
	// coins array must be increasing list, no duplicates
	coins.sort((a, b) => a - b);
	coins = unique(coins);

	// counts holds the the count of ways to make change for every amount
	let counts = Array(amount+1).fill(0);
	counts[0] = 1;              // there is 'one way' to make change for amount 0

	// loop through all coins
	// only save results for previous coin
	coins.forEach(function coinLoop(coin) {
		for (let amt = 0; amt <= amount; amt++) {
			if (coin+amt > amount) break;
			counts[coin+amt] += counts[amt];
			//    [1]           [2]
		}
	});
	return counts[amount];
}

// for each coin, the loop visits amount values from `coin` to the
// full `amount` and using previous results from `0` up through
// `amount-coin`.
//
// notably, many prior results in the loop are calculated within the
// same pass through the loop and just calculated earlier.
//
// annotation:
// [1] `coin + amt` is the amount of change that includes an extra coin of coin
//      notes:
//       - multiples of `coin` are handled automatically because
//         - counts[coin+amt] starts at counts[coin] += counts[0],
//           where counts[0] is set to 1.
//         - then when amt is a multiple of coin, then the loop is essentially:
//           counts[coin*n] += counts[coin*(n-1)]
// [2] `amt`, in the context, is the _previous amount_ (without the current coin)
