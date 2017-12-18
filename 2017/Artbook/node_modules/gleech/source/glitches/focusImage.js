/**
 * Focus Image
 * @param {number} pixelation - size of pixels to use for pixelization
 */
Jimp.prototype.focusImage = function focusImage(pixelation, cb) {
	if (!nullOrUndefined(pixelation)) {
		if ("number" != typeof pixelation)
			return throwError.call(this, "pixelation must be a number", cb);
		if (pixelation < 2)
			return throwError.call(this, "pixelation must be greater than 1", cb);
	}
	var width = this.bitmap.width,
	height = this.bitmap.height,
	data = new Uint32Array(this.bitmap.data.buffer);
	pixelation = !nullOrUndefined(pixelation) ? pixelation : randRange(2, 10);
	for (var y = 0; y < height; y += pixelation) {
		for (var x = 0; x < width; x += pixelation) {
			var i = (y * width + x);
			for (var n = 0; n < pixelation; n++) {
				for (var m = 0; m < pixelation; m++) {
					if (x + m < width) {
						var j = ((width * (y + n)) + (x + m));
						data[j] = data[i];
					}
				}
			}
		}
	}
	this.bitmap.data.writeUInt32BE(data, 0);
	if (isNodePattern(cb)) return cb.call(this, null, this);
	else return this;
};


