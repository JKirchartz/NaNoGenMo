/**
 * Red Shift
 * @param {number} factor - factor by which to reduce green and blue channels and boost red channel
 */
Jimp.prototype.redShift = function redShift(factor, cb) {
	if (!nullOrUndefined(factor)) {
		if ("number" != typeof factor)
			return throwError.call(this, "factor must be a number", cb);
		if (factor < 2)
			return throwError.call(this, "factor must be greater than 1", cb);
	}
	var width = this.bitmap.width,
	height = this.bitmap.height,
	data = this.bitmap.data;
	factor = !nullOrUndefined(factor) ? factor : randFloor(64);
	for (var i = 0, size = width * height * 4; i < size; i += 4) {
		var shift = data[i] + factor;
		data[i] = (shift) > 255 ? 255 : shift;
		data[i + 1] -= factor;
		data[i + 2] -= factor;
	}
	this.bitmap.data = new Buffer(data);
	if (isNodePattern(cb)) return cb.call(this, null, this);
	else return this;
};
