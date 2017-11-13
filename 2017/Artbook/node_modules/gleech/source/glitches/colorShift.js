// todo: rewrite colorShift functions to match Jimp.prototype.sepia

/**
 * Color Shift
 * @param {boolean} dir - direction to shift colors, true for RGB->GBR, false for RGB->BRG.
 */
Jimp.prototype.colorShift = function colorShift(dir, cb) {
	var width = this.bitmap.width,
	height = this.bitmap.height,
	data = this.bitmap.data;
	dir = nullOrUndefined(dir) ? coinToss() : dir;
	if (!nullOrUndefined(dir) && typeof (!!dir) !== 'boolean') {
		return throwError.call(this, "dir must be truthy or falsey", cb);
	}
	for (var i = 0, size = width * height * 4; i < size; i += 4) {
		var r = data[i],
			g = data[i + 1],
			b = data[i + 2];
			data[i] = dir ? g : b;
			data[i + 1] = dir ? b : r;
			data[i + 2] = dir ? r : g;
	}
	this.bitmap.data = new Buffer(data);
	if (isNodePattern(cb)) return cb.call(this, null, this);
	else return this;
};

