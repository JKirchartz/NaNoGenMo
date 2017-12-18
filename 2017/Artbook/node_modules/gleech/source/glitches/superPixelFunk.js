/**
 * Super Pixel Funk
 * @param {number} pixelation - size of pixels to use for pixelization
 */
Jimp.prototype.superPixelFunk = function superPixelFunk(pixelation, cb) {
	if (!nullOrUndefined(pixelation)) {
		if ("number" != typeof pixelation)
			return throwError.call(this, "pixelation must be a number", cb);
		if (pixelation < 2)
			return throwError.call(this, "pixelation must be greater than 1", cb);
	}
	var width = this.bitmap.width,
	height = this.bitmap.height,
	data = new Uint32Array(this.bitmap.data.buffer);
	pixelation = !nullOrUndefined(pixelation) ? pixelation : randRange(2, 15);
	for (var y = 0; y < height; y += pixelation) {
		for (var x = 0; x < width; x += pixelation) {
			if (coinToss()) {
				var locale = coinToss();
				var mask = randChoice([0x00FF0000, 0x0000FF00, 0x000000FF]);
				var i = coinToss() ? (y * width + x) :
					(y * width + (x - (pixelation * 2)));
				for (var n = 0; n < pixelation; n++) {
					for (var m = 0; m < pixelation; m++) {
						if (x + m < width) {
							var j = ((width * (y + n)) + (x + m));
							data[j] = locale ? data[i] : data[j] | mask;
						}
					}
				}
			}
		}
	}
	this.bitmap.data.writeUInt32BE(data, 0);
	if (isNodePattern(cb)) return cb.call(this, null, this);
	else return this;
};

