var array = [7, 8, 4, 9, 9, 15, 3, 1, 10];

findLargestDifference(array);

function findLargestDifference(arr) {
	function maxDifferenceRecurse(arr_) {
		// no difference possible, if less than 2 elements
		if (arr_.length < 2) return -Infinity;
		let diffs = arr_.slice(1).map(b => b - arr_[0]);
		let rest = maxDifferenceRecurse(arr_.slice(1));
		return Math.max(...diffs.concat(rest));
	}

	var d = maxDifferenceRecurse(arr);
	return d !== -Infinity ? d : undefined;
}

function findMaxProfit(arr) {
	if (arr.length < 2)
		return undefined;

	var curMin = arr[0];
	var mp = arr.slice(1).reduce((maxProfit, el) => {
		maxProfit = Math.max(el - curMin, maxProfit);
		curMin  = Math.min(el, curMin);
		return maxProfit;
	}, -Infinity);
	return mp !== -Infinity ? mp : undefined;
}
