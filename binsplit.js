/**
 * Decision tree using recursive binary splitting
 *
 * @ref Introduction to Statistical Learning, James et al
 */
'use strict'
function Split(feature, index, value, error) {
	return { feature, index, value, error };
}

function Tree(data) {
	var data = data;             // array of data points. data points are objects
	var root = undefined;
	var sorted = sortFeatures(); // map: features -> [sorted index by feature of data point]

	function features() {
		let res = new Set();
		for (let d of data)
			for (let k of Object.keys(d))
				res.add(k);
		return res;
	}

	// return array of data point indices sorted by named feature
	function sortByFeature(feature) {
		var ids = range(data.length);
		if (typeof data[0][feature] === "number")
			ids.sort((a, b) => data[a][feature] - data[b][feature]);
		else
			ids.sort((a, b) => {
				var A = data[a][feature];
				var B = data[b][feature];
				if (A < B) return -1;
				if (A > B) return 1;
				else       return 0;
			});
		return ids;
	}

	// sort every feature, return map: feature name -> sorted indices
	function sortFeatures() {
		var res = {};
		features().forEach(
			(feat) => (res[feat] = sortByFeature(feat))
		);
		return res;
	}

	function rss(region, feature) {
		var avg = sum(region.map(d => d[feature])) / region.length;
		return sum(region.map(d => (d[feature] - avg)**2));
	}

	function minRSSByFeature(region, feature) {
	}

	function bestSplit(root_split) {
		var region_ids = sorted[root_split.feature].slice(0, root_split.index);

	}

	return { sortByFeature, data, sorted };
}

// return array with values from min (inclusive) up to max (exclusive).
//
// workalike for python's range (but not a generator)
function range(min, max, step=1) {
	if (max === undefined)      // single argument: range(2) === range(0, 2)
		[max, min] = [min, 0];
	if (min >= max)
		return [];

	var res = [];
	for (var i = min; i < max; i += step)
		res.push(i);
	return res;
}

// sum all elements of array from lo to hi
//
// written in non-functional style for speed
function sum(arr, lo=0, hi=Infinity) {
	if (hi === Infinity)
		hi = arr.length;

	var sum = 0
	for (var i = lo; i < hi; i++)
		sum += arr[i];
	return sum;
}

// residual sum of squares for all elements from lo to hi
function rss(arr, lo=0, hi=Infinity) {
	if (hi === Infinity)
		hi = arr.length;

	var mean = sum(arr, lo, hi) / (hi - lo);
	var res = 0;
	for (var i = lo; i < hi; i++)
		res += (arr[i] - mean)**2;
	return res;
}

// find indices where array values change
// non-recursive for speed
function cutpoints(arr, lo=0, hi=Infinity) {
	if (hi === Infinity)
		hi = arr.length;

	var cuts = [],
	    cut = undefined,
	    i = lo;
	while (i+1 < hi) {
		cut = arr.slice(i+1).findIndex(e => e !== arr[i]);
		if (cut === -1)
			break;
		cut += i+1;             // correct offset from slice
		cuts.push(cut);
		i = cut;
	}
	return cuts;
}

// find minimum RSS region for array and return split. region
// boundaries to consider are given by the cutpoint array `cuts`.
function minRSS(arr, cuts) {
	cuts = cuts === undefined ? cutpoints(arr) : cuts;
	var split = { 'index': undefined, 'value': undefined, 'error': Infinity };
	var res = [];
	for (var i = 0; i < cuts.length; i++) {
		//var losum = sum(arr, 0, cuts[i]);
		//var hisum = sum(arr, cuts[i], arr.length);
		var lorss = rss(arr, 0, cuts[i]);
		var hirss = rss(arr, cuts[i], arr.length);
		res.push(lorss + hirss);
		if (lorss + hirss < split.error) {
			split.error = lorss + hirss;
			split.index = cuts[i];
			split.value = arr[i];
		}
		//lomean = losum / cuts[i];
		//himean = hisum / (arr.length - cuts[i]);
		//losum += arr[i];
		//hisum -= arr[i];
		//lomean += (arr[i] - lomean) / i; // cumulative moving average
		//himean = (himean * (i + 1) - arr[i]) / i;
	}
	return split;
}

module.exports = { range, rss, minRSS, cutpoints, Tree };
