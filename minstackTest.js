const test = require('tape');
const { check, gen, property } = require('tape-check');

const MinStack = require('./minstack.js');


test("MinStack - is empty on instantiation", function(t) {
	const ms = MinStack()
	t.equals(ms.size(), 0);
	t.end();
});

test("MinStack - undefined minimum when empty", function(t) {
	const ms = MinStack();
	t.equals(ms.getMin(), undefined);

	ms.push(0);
	ms.pop();
	t.equals(ms.getMin(), undefined);

	t.end();
});

// property-based tests

test("MinStack - getMin() always returns minimum integer",
     check(gen.array(gen.int).notEmpty(), propAlwaysMin));

function propAlwaysMin(t, ints) {
	let ms = MinStack();
	for (let el of ints)
		ms.push(el);

	t.equals(ms.getMin(), Math.min(...ints));
	t.end();
};

test("MinStack -- pop() returns last pushed value",
     check(gen.array(gen.number), (t, vals) => {
	     t.plan(1);
	     let ms = MinStack();
	     for (var el of vals)
		     ms.push(el);

	     let p = ms.pop();
	     if (Number.isNaN(p) && Number.isNaN(el))
		     t.ok();
	     else
		     t.equals(p, el);
     }));
