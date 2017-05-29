// jyh (2017-05-18), for Learn Teach Code LA
// Problem: Write an iterative fibonacci function (non-recursive) that
// takes in an `index` parameter that is an integer and returns the
// number in the sequence at that index.

function fibIter(index) {
  let [a, b] = [0, 1];
  for (let i = 0; i < index; i++) {
    [b, a] = [a, a+b];
  }
  return a;
}

/// Seems a shame to do all these calculations with no way to access
/// the sequence. A generator is a good option for this. See `fib`
/// below, which uses the generator returned by `fibGen`...


// iterative fibonacci, generator version
//
// fibGen() gives an infinite generator
// fibGen(x) will emit up to the xth fibonacci number
//
// note: sequence is 0-indexed: fib(0) === 0, fib(1) === 1
function *fibGen(index = Infinity) {
  let [a, b] = [0, 1];
  for (let i = 0; i <= index; i++) {
    yield a;
    [b, a] = [a, a+b];
  }
  return;
}

/// And here are two ways to use the `fibGen` generator...

// return index-th fibonacci number
function fib(index) {
  var r;
  for (r of fibGen(index))
    ;
  return r;
}

// return array of all fibonacci numbers up to index
function fibSeqTo(index) {
  g = fibGen();
  return Array(index+1).fill(undefined).map(_ => g.next().value);
}
