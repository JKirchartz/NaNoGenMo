/**
 * Dither: Random 3 - full color dithering via noise
 */
Jimp.prototype.ditherRandom3 = function ditherRandom3(cb) {
	var width = this.bitmap.width,
	height = this.bitmap.height,
	data = this.bitmap.data;
	for (var i = 0, size = width * height * 4; i < size; i += 4) {
		data[i] = data[i] < randRound(128) ? 0 : 0xff;
		data[i + 1] = data[i + 1] < randRound(128) ? 0 : 0xff;
		data[i + 2] = data[i + 2] < randRound(128) ? 0 : 0xff;
	}

	this.bitmap.data = new Buffer(data);
	if (isNodePattern(cb)) return cb.call(this, null, this);
	else return this;
};

