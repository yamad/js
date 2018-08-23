const { range, gslice } = require('./genutils');

/// First, we'll play with variations of generating the right characters...

// push onto array in pairs
function make_board1(width, height) {
	const make_row = pattern => {
		const times = (width + 1) / 2;
		return pattern.repeat(times).slice(0, width) + '\n';
	};

	let rows = [];
	for (let irow = 0; irow < height; irow += 2) {
		rows.push(make_row(' #'));
		rows.push(make_row('# '));
	}
	return rows.slice(0, height).join('');
}

// mod-based toggle of pre-generated rows
function make_board2(width, height) {
	const times = Math.ceil(width / 2);
	const odd_row = ' #'.repeat(times).slice(0, width);
	const even_row = '# '.repeat(times).slice(0, width);

	let rows = [];
	for (let i of range(height))
		rows.push(i % 2 ? even_row : odd_row, '\n');
	return rows.join('');
}

// slice from a character generator
function make_board3(width, height) {
	const odd_row = [...gslice(checkers(), 0, width), '\n'];
	const even_row = [...gslice(checkers(), 1, width + 1), '\n'];
	const row_pair = [odd_row.join(''), even_row.join('')];

	let rows = [];
	for (let _ of range(0, height, 2))
		rows.push(...row_pair);
	return rows.slice(0, height).join('');
}

// slice from pre-generated string
// perhaps my favorite
function make_board4(width, height) {
	const chars = ' #'.repeat(width/ 2 + 1);
	const odd_row = chars.slice(0, width) + '\n';
	const even_row = chars.slice(1, width + 1) + '\n';

	let rows = [];
	for (let i = 0; i < height; i += 2)
		rows.push(odd_row, even_row);
	return rows.slice(0, height).join('');
}

// pull from one generator for each row
function make_board5(width, height) {
	let chars = [];
	let checks = checkers();
	for (_ of range(height)) {
		chars.push(...gslice(checks, width), '\n');
		// toss next char to get offset rows
		if (width % 2 === 0) checks.next();
	}
	return chars.join('');
}

// poor-man's generator
// create source string inline by joining
function make_board6(width, height) {
	// way more chars than needed,
	// didn't feel like working out the math
	let nchars = (width + 1) * height;
	let chars = Array.from(' '.repeat(nchars)).join('#');

	let res = [];
	for (let _ of range(height)) {
		let row = chars.slice(0, width);
		chars = chars.slice(width % 2 ? width : width + 1);
		res.push(...row, '\n');
	}
	return res.join('');
}


/// Now, we'll play with more exotic iteration patterns...

// ascending recursive fold, with mod-based toggle
function make_board7(width, height) {
	const times = (width + 1) / 2;
	const odd_row = ' #'.repeat(times).slice(0, width);
	const even_row = '# '.repeat(times).slice(0, width);

	function recurse(nrow) {
		if (nrow === height) return [];
		const row = (nrow + 1) % 2 ? odd_row : even_row;
		return [row, '\n', ...recurse(nrow + 1)];
	}
	return recurse(0).join('');
}

// descending recursive fold, with array toggle
function make_board8(width, height) {
	const times = width / 2 + 1;
	const chars = ' #'.repeat(times);
	const odd_row = chars.slice(0, width);
	const even_row = chars.slice(1, width + 1);

	function recurse(nrows, patterns) {
		if (nrows === 0) return [];
		return [patterns[0], '\n',
		        ...recurse(nrows - 1, patterns.reverse())];
	}
	return recurse(height, [odd_row, even_row]).join('');
}

// recursive iteration, with array toggle
function make_board9(width, height) {
	const chars = ' #'.repeat(Math.ceil(width / 2) + 1);
	const odd_row = chars.slice(0, width);
	const even_row = chars.slice(1, width + 1);

	function iter(nrows, patterns, acc) {
		if (nrows === 0) return acc;
		return iter(
			nrows - 1,
			[patterns[1], patterns[0]],
			acc.concat(patterns[0], '\n')
		);
	}
	return iter(height, [odd_row, even_row], []).join('');
}

// use reduce to collect rows in pairs
function make_board10(width, height) {
	const chars = ' #'.repeat(Math.ceil(width / 2) + 1);
	const odd_row = chars.slice(0, width) + '\n';
	const even_row = chars.slice(1, width + 1) + '\n';

	let iter = Array.from(range(0, height, 2));
	let rows = iter.reduce(
		(rows, _) => rows.concat([odd_row, even_row]), []);
	return rows.slice(0, height).join('');
}

// Now that I learned the [...Array(n)] trick...

// version 6, using map
function make_board11(width, height) {
	// way more chars than needed,
	// didn't feel like working out the math
	let nchars = (width + 1) * height;
	let chars = Array.from(' '.repeat(nchars)).join('#');

	return [...Array(height)].map(() => {
		let row = chars.slice(0, width);
		chars = chars.slice(width % 2 ? width : width + 1);
		return row + '\n';
	}).join('');
}

// version 5, using map
function make_board12(width, height) {
	let checks = checkers();
	return [...Array(height)].map(() => {
		const row = [...gslice(checks, width), '\n'];
		if (width % 2 === 0) checks.next(); // skip for offset rows
		return row.join('');
	}).join('');
}

// version 7, using reduce
function make_board13(width, height) {
	const times = Math.ceil((width + 1) / 2);
	const odd_row = ' #'.repeat(times).slice(0, width);
	const even_row = '# '.repeat(times).slice(0, width);

	return [...Array(height)].reduce((rows, _, nrow) => {
		const row = (nrow+1) % 2 ? odd_row : even_row;
		return rows.concat([row, '\n']);
	}, []).join('');
}

// version 5, using utility functions
function make_board14(width, height) {
	const checks = checkers();
	const make_row = () => {
		const row = [...gslice(checks, width), '\n'];
		if (width % 2 === 0) checks.next();
		return row.join('');
	};
	return arr_range(height).map(make_row).join('');
}

function* checkers() {
	while (true) {
		yield ' ';
		yield '#';
	}
}


function arr_range(start, stop, step = 1) {
	return Array.from(range(start, stop, step));
}

function test_make_board(func) {
	const cases = [
		[0, 0, ''],
		[0, 1, '\n'],
		[1, 0, ''],
		[3, 1, ' # \n'],
		[1, 3, ' \n#\n \n'],
		[2, 2, ' #\n# \n'],
		[3, 3, ' # \n# #\n # \n'],
		[4, 4, ' # #\n# # \n # #\n# # \n']
	];

	let ok = true;
	let results = {};
	for (let case_ of cases) {
		const [width, height, expect] = case_;
		const actual = func(width, height);
		const passed = actual === expect;
		if (!passed) ok = false;
		results[[width, height]] = { passed, actual, expect };
	}
	return { ok, results };
}

function run_tests() {
	const funcs = Array.from(range(1, 15)).map(
		x => eval(`make_board${x}`));
	return funcs.map(f => test_make_board(f)['ok']);
}

function all(bool_arr) {
	return bool_arr.reduce((a, b) => a && b, true);
}

module.exports = { run_tests };
