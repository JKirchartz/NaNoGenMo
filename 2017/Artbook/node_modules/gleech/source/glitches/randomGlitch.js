/**
 * randomGlitch - randomly choose glitch functions to perform on the incoming image
 */
Jimp.prototype.randomGlitch = function (cb) {
	var history = [];
	// enumerate glitch functions
	var glitches = [];
	for (var prop in Jimp.prototype) {
		if (typeof Jimp.prototype[prop] === 'function' &&
				Jimp.prototype[prop].name){
			glitches.push(this[prop].name);
		}
	}
	console.log(glitches);
	for (var i = 0, l = randRange(3, 6); i < l; i++) {
		var fun = randFloor(glitches.length);
		console.log(fun);
		this[glitches[fun]]();
		history.push(glitches[fun]);
	}
	if (history.length === 0) {
		return this.randomGlitch();
	}
	console.log('randomGlitch history:', history);

	if (isNodePattern(cb)) return cb.call(this, null, this);
	else return this;
};
