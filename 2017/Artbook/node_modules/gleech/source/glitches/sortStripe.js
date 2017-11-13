/**
 * sortStripe
 * @param {boolean} direction - pixel to start at
 * @param {integer} start - pixel to start at
 * @param {integer} end - pixel to end at
 */
Jimp.prototype.sortStripe = function sortStripe(dir, start, end, cb) {
	var width = this.bitmap.width,
	height = this.bitmap.height,
	data = new Uint32Array(this.bitmap.data),
	mm;

	if (nullOrUndefined(start) && nullOrUndefined(end)) {
		mm = randMinMax(0, width * height);
		mm = randMinMax2(mm[0], mm[1]);
	} else if(!nullOrUndefined(start) && nullOrUndefined(end)) {
		mm = randMinMax(start, randMinMax2(width * height)[1]);
	} else if(nullOrUndefined(start) && !nullOrUndefined(end)) {
		mm = randMinMax(randMinMax2((width * height) - end)[0], end);
	} else {
		mm = [start, end];
	}

	for (var i = 0, size = data.length + 1; i < size; i += width) {
		var da = data.subarray(i + mm[0], i + mm[1]);
		Array.prototype.sort.call(da, leftSort);
		da.copyWithin(data, i + mm[0]);
	}

	this.bitmap.data = new Buffer(data);
	if (isNodePattern(cb)) return cb.call(this, null, this);
	else return this;
};
