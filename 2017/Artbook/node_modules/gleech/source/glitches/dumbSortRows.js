/**
 * dumbSortRows
 */
Jimp.prototype.dumbSortRows = function dumbsSortRows(cb) {
	var width = this.bitmap.width,
	height = this.bitmap.height,
	data = new Uint32Array(this.bitmap.data);

	for (var i = 0, size = data.length; i < size; i += width) {
		var da = data.subarray(i, i + width);
		Array.prototype.sort.call(da);
		data.set(da, i);
	}

	this.bitmap.data = new Buffer(data);
	if (isNodePattern(cb)) return cb.call(this, null, this);
	else return this;
};

