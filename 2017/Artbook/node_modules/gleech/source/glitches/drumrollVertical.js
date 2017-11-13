/**
 * drumrollVertical
 */
Jimp.prototype.drumrollVertical = function drumrollVertical(cb) {
	// borrowed from https://github.com/ninoseki/glitched-canvas
	var width = this.bitmap.width,
	height = this.bitmap.height,
	data = this.bitmap.data,
	roll = 0;
	for (var x = 0; x < width; x++) {
		if (Math.random() > 0.95) roll = randFloor(height);
		if (Math.random() > 0.95) roll = 0;

		for (var y = 0; y < height; y++) {
			var idx = (x + y * width) * 4;

			var y2 = y + roll;
			if (y2 > height - 1) y2 -= height;
			var idx2 = (x + y2 * width) * 4;

			for (var c = 0; c < 4; c++) {
				data[idx2 + c] = data[idx + c];
			}
		}
	}

	this.bitmap.data = new Buffer(data);
	if (isNodePattern(cb)) return cb.call(this, null, this);
	else return this;
};
