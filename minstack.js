// Stack data structure (last-in first-out) with O(1) retrieval of the
// minimum element
function MinStack() {
	let val_stack = [];         // keep values
	let min_stack = [];         // track minimums

	function _peek(stack) {
		return stack[stack.length-1];
	}

	function push(val) {
		val_stack.push(val);
		if (min_stack.length === 0
		    || _peek(min_stack) >= val)
			min_stack.push(val);
		return val;
	}

	function pop() {
		const val = val_stack.pop();
		if (_peek(min_stack) === val)
			min_stack.pop();
		return val;
	}

	function top() {
		return _peek(val_stack);
	}

	function getMin() {
		return _peek(min_stack);
	}

	function size() {
		return val_stack.length;
	}

	return { push,
	         pop,
	         top,
	         getMin,
	         size };
}

module.exports = MinStack;
