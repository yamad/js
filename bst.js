// binary search tree, not balanced

function makeBST() {
	let root = undefined;

	function isEmpty() {
		return size() === 0;
	}

	function insert(key, value) {
		root = _insert(key, value, root);
	}

	function remove(key) {
		let deleted;
		[root, deleted] = _delete(key, root);
		return deleted;
	}

	function get(key) {
		return _getNode(key, root).value;
	}

	function contains(key) {
		return _contains(key, root);
	}

	function size() {
		return _size(root);
	}

	function min() {
		return _minNode(root).key;
	}

	function max() {
		return _maxNode(root).key;
	}

	function floor(key) {
		let node = _floorNode(key, root);
		if (node === undefined) return undefined;
		return node.key;
	}

	function ceiling(key) {
		let node = _ceilingNode(key, root);
		if (node === undefined) return undefined;
		return node.key;
	}

	function *traverseInOrder() {
		yield *_traverseInOrder(root);
	}

	function *traversePostOrder() {
		yield *_traversePostOrder(root);
	}

	function *traversePreOrder() {
		yield *_traversePreOrder(root);
	}

	function *traverseBreadthFirst() {
		if (root === undefined) return undefined;
		let queue = [root];     // start of array is front of queue
		while (queue.length !== 0) {
			let node = queue.shift();
			yield node;

			// it's a tree, so nodes are visited just once by design
			if (node.left  !== undefined) queue.push(node.left);
			if (node.right !== undefined) queue.push(node.right);
		}
		return undefined;
	}

	function toArray() {
		return [...traverseInOrder()].map(n => n.key);
	}

	let api = Object.create({
		isEmpty,
		insert,
		remove,
		get,
		contains,
		min,
		max,
		floor,
		ceiling,
		traverseInOrder,
		traversePostOrder,
		traversePreOrder,
		traverseBreadthFirst,
		toArray
	}, {
		size: { get: size }
	});
	return api;
}

module.exports = makeBST;


/*** Helpers ***/
function makeNode(key, value, left = undefined, right = undefined) {
	return { key: key,
	         value: value,
	         left: left,
	         right: right,
	         N: _size(left) + _size(right) + 1
	       };
}

function _insert(key, value, node) {
	if  (node === undefined) return makeNode(key, value);
	if      (key < node.key) node.left  = _insert(key, value, node.left);
	else if (key > node.key) node.right = _insert(key, value, node.right);
	else node.value = value;
	node.N = _size(node.left) + _size(node.right) + 1;

	return node;
}

function _deleteMin(node) {
	if (node === undefined)
		return { tree: undefined, node: undefined };
	if (node.left === undefined)
		// node is the min
		return { tree: node.right, node: node };

	let minNode;
	({ tree: node.left, node: minNode } = _deleteMin(node.left));
	node.N = _size(node.left) + _size(node.right) + 1;
	return { tree: node, node: minNode };
}

function _delete(key, node) {
	let deleted = undefined;

	// find node to delete
	if (node === undefined)
		return [undefined, undefined];
	if (key < node.key)
		[node.left, deleted] = _delete(key, node.left);
	else if (key > node.key)
		[node.right, deleted] = _delete(key, node.right);

	// if we get here, delete `node`
	// also handles no children (node.right is undefined)
	else {
		deleted = node;
		if (node.left === undefined)
			return [node.right, deleted];
		else if (node.right === undefined)
			return [node.left, deleted];

		// set min of right tree as new local root
		let { tree: newRight, node: newRoot } = _deleteMin(node.right);
		console.log("new right: ", newRight);
		console.log("new root: ", newRoot);
		newRoot.left = node.left;
		newRight.left = newRoot.right;
		newRoot.right = newRight;
		node = newRoot;
	}

	node.N = _size(node.left) + _size(node.right) + 1;
	return [node, deleted];
}

function _getNode(key, node) {
	if  (node === undefined) return undefined;
	if      (key < node.key) return _getNode(key, node.left);
	else if (key > node.key) return _getNode(key, node.right);
	else    return node;
}

function _contains(key, node) {
	if  (node === undefined) return false;
	if      (key < node.key) return _contains(key, node.left);
	else if (key > node.key) return _contains(key, node.right);
	else    return true;
}

function _size(node) {
	if (node === undefined) return 0;
	return node.N;
}

function _minNode(node) {
	if (node === undefined)      return undefined;
	if (node.left === undefined) return node;
	else return _minNode(node.left);
}

function _maxNode(node) {
	if (node === undefined)       return undefined;
	if (node.right === undefined) return node;
	else return _maxNode(node.right);
}

// return node with largest key less than or equal to key
function _floorNode(key, node) {
	if (node === undefined) return undefined;
	if (key === node.key)   return node;
	if (key < node.key)     return _floorNode(key, node.left);
	else {
		t = _floorNode(key, node.right);   // possible floor in right tree
		return t === undefined ? node : t; // if not, then node hold floor
	}
}

// return node with smallest key greater than or equal to key
function _ceilingNode(key, node) {
	if (node === undefined) return undefined;
	if (key === node.key)   return node;
	if (key > node.key)     return _ceilingNode(key, node.right);
	else {
		t = _ceilingNode(key, node.left);  // possible ceiling in left tree
		return t === undefined ? node : t; // if not, then node holds ceiling
	}
}

function *_traverseInOrder(node) {
	if (node === undefined) return node;
	yield *_traverseInOrder(node.left);
	yield node;
	yield *_traverseInOrder(node.right);
}

function *_traversePostOrder(node) {
	if (node === undefined) return node;
	yield *_traversePostOrder(node.left);
	yield *_traversePostOrder(node.right);
	yield node;
}

function *_traversePreOrder(node) {
	if (node === undefined) return node;
	yield node;
	yield *_traversePreOrder(node.left);
	yield *_traversePreOrder(node.right);
}
