/**
 * pixelSort
 */
Jimp.prototype.pixelSort = function pixelSort(cb) {
	var width = this.bitmap.width,
	height = this.bitmap.height,
	data = new Uint32Array(this.bitmap.data);

	var upper = 0xFFAAAAAA, lower = 0xFF333333;
	for (var i = 0, size = data.length; i < size; i += width) {
		var row = Array.apply([], data.subarray(i, i + width));
		var low = 0, high = 0;
		for (var j in row) {
			if (!high && !low && row[j] >= low) {
				low = j;
			}
			if (low && !high && row[j] >= high) {
				high = j;
			}
		}
		if (low) {
			var da = row.slice(low, high);
			Array.prototype.sort.call(da, leftSort);
			data.set(da, (i + low) % (height * width));
		}
	}

	this.bitmap.data = new Buffer(data);
	if (isNodePattern(cb)) return cb.call(this, null, this);
	else return this;
};
