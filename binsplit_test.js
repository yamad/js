const fs = require('fs');
const test = require('tape');
const tree = require('./binsplit');

test("range -- includes min, excludes max", t => {
	t.plan(1);
	t.deepEqual(tree.range(1, 3), [1, 2]);
});

test("range -- missing min starts from 0", t => {
	t.plan(3);
	t.deepEqual(tree.range(2), [0, 1]);
	t.deepEqual(tree.range(0), []);
	t.deepEqual(tree.range(-1), []);
});

test("residual sum of squares", t => {
	t.plan(6);
	t.equal(tree.rss([]), 0);
	t.equal(tree.rss([1]), 0);
	t.equal(tree.rss([1, 1, 3, 3]), 4);
	t.equal(tree.rss([0, 0, 0]), 0);
	t.equal(tree.rss([1, 1, 1]), 0);
	t.equal(tree.rss([1, 2, 3]), 2);
});

test.skip("minimum residual sum of squares", t => {
	t.plan(1);
	t.deepEqual(tree.minRSS([1, 2, 3], tree.cutpoints([1,2,3])), { 'index': 1, 'value': 0.5 });
});

test("cutpoints", t => {
	t.plan(2);
	t.deepEqual(tree.cutpoints([1, 2, 3, 4]), [1, 2, 3]);
	t.deepEqual(tree.cutpoints([1, 1, 1, 1, 1]), []);
});

test("load json", t => {
	t.plan(1);
	fs.readFile("carseats.json", function(err, data) {
		if (err) throw err;
		try {
			var json = JSON.parse(data);
			t.equal(json[0], "");
		} catch (e) {
			t.fail("json error: " + e);
		}
	});
});

test("hitters example dataset -- splits consistent with R", t => {
	t.plan(2);
	var data = JSON.parse(fs.readFileSync("hitters.json")); // TODO: error check
	var dt = tree.Tree(data);
	var ids = dt.sortByFeature('CAtBat');
	t.deepEqual(tree.minRSS(ids.map(id => data[id].Salary), tree.cutpoints(ids.map(id => data[id].CAtBat))).index, 123);
	t.equal(data[123].CAtBat, 0);
});
