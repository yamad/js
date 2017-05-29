function fizzBuzz(lastNum)  {
  for (let i = 1; i <= lastNum; i++) {
    let is_div3 = (i % 3) === 0;
    let is_div5 = (i % 5) === 0;

    if (is_div3 && is_div5)  console.log(i, "fizz buzz");
    else if (is_div3)        console.log(i, "fizz");
    else if (is_div5)        console.log(i, "buzz");
    else                     console.log(i);
  }
}

function fizzBuzzNoIfs(maxBound) {
  for (let i = 1; i <= maxBound; i++) {
    let maybeFizz = (!(i % 3) && "fizz") || ""
    let maybeBuzz = (!(i % 5) && "buzz") || ""
    let out = maybeFizz + maybeBuzz || i
    console.log(out);
  }
}

// jyh (2017-05-18), for Learn Teach Code LA
// [Line #]: Comment
// -------------------------------------------------------------
// [2]: for loops are designed for simple iteration like this. also note that i starts at 1.
// [3/4]: I'm not sure these variables are actually worth keeping
// [6-9]: Some people object to this formatting style. I personally like it. It is visually similar to the pattern matching feature available in functional languages.
