function convertToRoman(num) {
	var table = [[""],
	             ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
	             ["", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC"],
	             ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM"]];

	var place = 1;
	var res = [];
	while (place < 4 && num > 0) {
		console.log(num, place);
		res.push(table[place++][num % 10]);
		num = Math.floor(num / 10);
	}
	console.log(num);
	res.push("M".repeat(num));
	return res.reverse().join("");
}

function testRoman() {
	return [
		convertToRoman(2) === "II",
		convertToRoman(3) === "III",
		convertToRoman(4) === "IV",
		convertToRoman(5) === "V",
		convertToRoman(9) === "IX",
		convertToRoman(12) === "XII",
		convertToRoman(16) === "XVI",
		convertToRoman(29) === "XXIX",
		convertToRoman(44) === "XLIV",
		convertToRoman(45) === "XLV",
		convertToRoman(68) === "LXVIII",
		convertToRoman(83) === "LXXXIII",
		convertToRoman(97) === "XCVII",
		convertToRoman(99) === "XCIX",
		convertToRoman(500) === "D",
		convertToRoman(501) === "DI",
		convertToRoman(649) === "DCXLIX",
		convertToRoman(798) === "DCCXCVIII",
		convertToRoman(891) === "DCCCXCI",
		convertToRoman(1000) === "M",
		convertToRoman(1004) === "MIV",
		convertToRoman(1006) === "MVI",
		convertToRoman(1023) === "MXXIII",
		convertToRoman(2014) === "MMXIV",
		convertToRoman(3999) === "MMMCMXCIX"];
}

testRoman();
