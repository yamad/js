// only handles uppercase letters
function rot13(str) {
	var ccA = "A".charCodeAt();
	var ccZ = "Z".charCodeAt();

	function rotChar(c) {
		var ccode = c.charCodeAt();
		if (ccode >= ccA && ccode <= ccZ)
			// wraparound uppercase letters
			return (((ccode - ccA) + 13) % 26) + ccA;
		return ccode;
	}
	return str.split("").map(function(c) {
		return String.fromCharCode(rotChar(c));
	}).join("");
}
