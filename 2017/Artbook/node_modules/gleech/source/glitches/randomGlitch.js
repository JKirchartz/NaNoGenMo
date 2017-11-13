/**
 * randomGlitch - randomly choose glitch functions to perform on the incoming image
 */
Jimp.prototype.randomGlitch = function (imageData) {
	var history = [];
	// enumerate glitch functions
	var glitches = [];
	for (var prop in this) {
		if (typeof this[prop] === 'function' &&
				this[prop].name){
			glitches.push(this[prop].name);
		}
	}
	for (var i = 0, l = randRange(3, 6); i < l; i++) {
		var fun = randFloor(glitches.length);
		this[glitches[fun]](imageData);
		history.push(glitches[fun]);
	}
	if (history.length === 0) {
		return this.randomGlitch(imageData);
	}
	console.log('randomGlitch history:', history);
	return imageData;
};
