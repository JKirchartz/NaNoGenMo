/***************************************************
 * Helper Functions
 ***************************************************/

function throwError(err, cb) {
	if (typeof err === 'string') err = new Error(err);
	if(typeof cb === 'function') return cb.call(this, err);
	else throw err;
}

function adjustPixelError(data, i, error, multiplier) {
	data[i] = data[i] + multiplier * error[0];
	data[i + 1] = data[i + 1] + multiplier * error[1];
	data[i + 2] = data[i + 2] + multiplier * error[2];
}

function nullOrUndefined(item) {
	if (typeof item === 'undefined' || item === null) {
		return true;
	}
	return false;
}

// return random # < a
function randFloor(a) {return Math.floor(Math.random() * a);}
// return random # <= a
function randRound(a) {return Math.round(Math.random() * a);}
// return random # between A & B
function randRange(a, b) {return Math.round(Math.random() * b) + a;}
// relatively fair 50/50
function coinToss() {return Math.random() > 0.5;}
function randMinMax(min, max) {
	// generate min & max values by picking
	// one 'fairly', then picking another from the remainder
	var randA = Math.round(randRange(min, max));
	var randB = Math.round(randRange(randA, max));
	return [randA, randB];
}
function randMinMax2(min, max) {
	// generate min & max values by picking both fairly
	// then returning the lesser value before the greater.
	var randA = Math.round(randRange(min, max));
	var randB = Math.round(randRange(min, max));
	return randA < randB ? [randA, randB] : [randB, randA];
}
function randChoice(arr) {
	return arr[randFloor(arr.length)];
}

function randChance(percent) {
	// percent is a number 1-100
	return (Math.random() < (percent / 100));
}

function sum(o) {
	for (var s = 0, i = o.length; i; s += o[--i]) {}
	return s;
}
function leftSort(a, b) {return parseInt(a, 10) - parseInt(b, 10);}
function rightSort(a, b) {return parseInt(b, 10) - parseInt(a, 10);}
function blueSort(a, b) {
	var aa = a >> 24 & 0xFF,
	ar = a >> 16 & 0xFF,
	ag = a >> 8 & 0xFF,
	ab = a & 0xFF;
	var ba = b >> 24 & 0xFF,
	br = b >> 16 & 0xFF,
	bg = b >> 8 & 0xFF,
	bb = b & 0xFF;
	return aa - bb;
}
function redSort(a, b) {
	var aa = a >> 24 & 0xFF,
	ar = a >> 16 & 0xFF,
	ag = a >> 8 & 0xFF,
	ab = a & 0xFF;
	var ba = b >> 24 & 0xFF,
	br = b >> 16 & 0xFF,
	bg = b >> 8 & 0xFF,
	bb = b & 0xFF;
	return ar - br;
}
function greenSort(a, b) {
	var aa = a >> 24 & 0xFF,
	ar = a >> 16 & 0xFF,
	ag = a >> 8 & 0xFF,
	ab = a & 0xFF;
	var ba = b >> 24 & 0xFF,
	br = b >> 16 & 0xFF,
	bg = b >> 8 & 0xFF,
	bb = b & 0xFF;
	return ag - bg;
}
function avgSort(a, b) {
	var aa = a >> 24 & 0xFF,
	ar = a >> 16 & 0xFF,
	ag = a >> 8 & 0xFF,
	ab = a & 0xFF;
	var ba = b >> 24 & 0xFF,
	br = b >> 16 & 0xFF,
	bg = b >> 8 & 0xFF,
	bb = b & 0xFF;
	return ((aa + ar + ag + ab) / 4) - ((ba + br + bg + bb) / 4);
}
function randSort(a, b) {
	var sort = randChoice([coinToss, leftSort, rightSort, redSort, greenSort,
			blueSort, avgSort]);
	return sort(a, b);
}


function isNodePattern(cb) {
	// borrowed from JIMP
	if ("undefined" == typeof cb) return false;
	if ("function" != typeof cb)
		throw new Error("Callback must be a function");
	return true;
}

