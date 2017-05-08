const test = require('tape');
const makeBST = require('./bst');

let testTrees = [ emptyTree, oneNode, treeNoRight, treeNoLeft, mediumTree ];

function emptyTree() {
	return makeBST();
}

function oneNode() {
	let b = makeBST();
	b.insert("S");
	return b;
}

function treeNoRight() {
	let b = makeBST();
	b.insert("S");
	b.insert("E");
	return b;
}

function treeNoLeft() {
	let b = makeBST();
	b.insert("S");
	b.insert("X");
}

//  The example tree from Sedgewick's Algorithms
//
//           S
//      E       X
//  A      R
//    C  H
//        M
function mediumTree() {
	let b = makeBST();
	b.insert("S");
	b.insert("E");
	b.insert("X");
	b.insert("A");
	b.insert("R");
	b.insert("C");
	b.insert("H");
	b.insert("M");
	return b;
}

test("BST -- empty tree reported empty", function (t) {
	t.true(emptyTree().isEmpty());
	t.end();
});

test("BST -- non-empty tree reported non-empty", function (t) {
	t.false(oneNode().isEmpty());
	t.end();
});

test("BST -- can insert a node", function (t) {
	let b = makeBST();
	b.insert("A", 2);

	t.equal(b.size, 1);
	t.equal(b.get("A"), 2);
	t.end();
});

test("BST -- deleting node from empty tree is no-op", function (t) {
	let b = makeBST();
	t.equal(b.remove("A"), undefined);
	t.end();
});

test("BST -- deleting node from single node tree gives empty", function (t) {
	let b = makeBST();
	b.insert("A");

	t.deepEqual(b.toArray(), ["A"]);
	b.remove("A");
	t.deepEqual(b.toArray(), []);

	t.end();
});

test("BST -- deleting node with only a left child", function (t) {
	let b = makeBST();
	b.insert("C");
	b.insert("A");

	t.deepEqual(b.toArray(), ["A", "C"]);
	b.remove("C");
	t.deepEqual(b.toArray(), ["A"]);
	t.end();
});

test("BST -- deleting node with only a right child", function (t) {
	let b = makeBST();
	b.insert("A");
	b.insert("C");

	t.deepEqual(b.toArray(), ["A", "C"]);
	b.remove("A");
	t.deepEqual(b.toArray(), ["C"]);
	t.end();
});

test.skip("BST -- deleting node with both children", function (t) {
	let b = makeBST();
	b.insert("B");
	b.insert("C");
	b.insert("A");

	t.deepEqual(b.toArray(), ["A", "B", "C"]);
	b.remove("B");
	t.deepEqual(b.toArray(), ["A", "C"]);
	t.end();
});

test("BST -- deleting node", function (t) {
	let b = mediumTree();

	t.deepEqual(b.toArray(), ["A", "C", "E", "H", "M", "R", "S", "X"]);
	let d = b.remove("E");
	t.deepEqual(b.toArray(), ["A", "C", "H", "M", "R", "S", "X"]);

	t.equal(d !== undefined && d.key, "E");
	t.end();
});
