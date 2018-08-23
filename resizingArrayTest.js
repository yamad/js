const test = require('tape');
const makeResizingArray = require('./resizingArray');

test("ResizingArray -- basic initialization", function (t) {
	let ra = makeResizingArray();
	t.equal(ra.count, 0, "array starts with zero elements");
	t.equal(ra.capacity, 0, "array starts with no capacity");
	t.end();
});

test("ResizingArray -- takes starting capacity", function (t) {
	let capacity = 10;
	let ra = makeResizingArray(capacity);
	t.equal(ra.capacity, capacity, "has given capacity");
	t.equal(ra.count, 0,           "but no items");
	t.end();
});

test("ResizingArray -- capacity grows when full", function (t) {
	let ra = makeResizingArray(2);
	ra.put("Item 1");
	ra.put("Item 2");
	t.equal(ra.capacity, 2, "hasn't grown yet");

	ra.put("Item 3");
	t.test(ra.capacity > 2, "capacity grew");
	t.end();
});

test("ResizingArray -- capacity will resize to accomodate items", function (t) {
	let ra = makeResizingArray();
	for (let i = 1; i <= 10; i++)
		ra.put("Item " + i);

	t.test(ra.capacity >= 10);
	t.equal(ra.count, 10);

	t.end();
});

test("ResizingArray -- get retrieves item stored at given index", function (t) {
	let ra = makeResizingArray();
	for (let i = 0; i <= 10; i++)
		ra.put("Item " + i);

	t.equal(ra.get(0), "Item 0");
	t.equal(ra.get(1), "Item 1");
	t.equal(ra.get(10), "Item 10");
	t.end();
});
