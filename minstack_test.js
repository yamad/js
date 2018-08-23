const jsc = require('jsverify');

//minStack code import
var MinStack = function() {
	this.minVal = 0;
	this.vals = [];
};

MinStack.prototype.push = function(x) {
	this.vals.push(x);
	if(this.minVal === 0){
		this.minVal = x;
	} else {
		this.minVal = this.getMin();
	}
};

MinStack.prototype.pop = function() {
	var removed_item = this.vals.pop();
	if (removed_item === undefined){
		return undefined;
	} else if (this.minVal == removed_item){
		this.minVal  = this.getMin();
		return removed_item;
	}
};

MinStack.prototype.getMin = function() {
	let vals = this.vals;
	if (vals.length === 0) {
		return undefined;
	}
	let minItem = vals[0];
	for (let num of vals){
		if (minItem > num) {
			minItem = num;
		}
	}
	this.minVal = minItem;
	return minItem;
};

MinStack.prototype.pushAll = function(arr) {
	for (let el of arr)
		this.push(el);
};

MinStack.prototype.popAll = function() {
	let arr = [];
	while (this.vals.length > 0)
		arr.push(this.pop());
	return arr;
};


describe("MinStack", function () {
	jsc.property('getMin returns minimum value on stack',
	             'array integer',
	             (arr) => {
		             let ms = new MinStack();
		             ms.pushAll(arr);

		             let m = Math.min(...arr);
		             if (arr.length === 0)
			             m = undefined;
		             return ms.getMin() === m;
	             });

	jsc.property('getMin returns min from pops',
	             'array integer', 'integer',
	             (arr, n) => {
		             let ms = new MinStack();
		             ms.pushAll(arr);

		             for (let i = 0; i < n; i++)
			             ms.pop();

		             let min_ = ms.getMin();
		             let m = Math.min(...ms.popAll());
		             m = m === Infinity ? undefined : m;
		             return min_ === m;
	             });
});
