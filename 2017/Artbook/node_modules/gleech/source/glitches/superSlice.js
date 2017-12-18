/**
 * Super Slice
 * @param {number} iter - Number of times to perform an automatic slice
 */
Jimp.prototype.superSlice = function superSlice(iter, cb) {
	if (!nullOrUndefined(iter)) {
		if ("number" != typeof iter)
			return throwError.call(this, "iter must be a number", cb);
		if (iter > 0)
			return throwError.call(this, "iter must be greater than 0", cb);
	}
	var width = this.bitmap.width,
	height = this.bitmap.height,
	data = this.bitmap.data,
	cutend, cutstart;
	iter = !nullOrUndefined(iter) ? iter : 3;
	for (var i = 0; i < iter; i++ ) {
		switch (randRange(0,1)) {
			case 0:
				cutend = randFloor(width * height * 4);
				cutstart = Math.floor(cutend / 1.7);
				break;
			case 1:
				cutend = Math.random() < 0.75 ? randFloor(width * height * 4) : (width * height * 4);
				cutstart = Math.floor(cutend / 1.7);
				break;
		}
		var cut = data.subarray(cutstart, cutend);
		data.set(cut, randFloor((width * height * 4) - cut.length));
	}
	this.bitmap.data = new Buffer(data);
	if (isNodePattern(cb)) return cb.call(this, null, this);
	else return this;
};

