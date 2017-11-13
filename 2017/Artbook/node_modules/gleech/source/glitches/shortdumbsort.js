/**
 * shortdumbsort
 * @param {integer} start - pixel to start at
 * @param {integer} end - pixel to end at
 */
Jimp.prototype.shortdumbsort = function shortdumbsort(start, end, cb) {
	var width = this.bitmap.width,
	height = this.bitmap.height,
	data = new Uint32Array(this.bitmap.data.buffer);
	var mm;
	if (nullOrUndefined(start) && nullOrUndefined(end)) {
		mm = randMinMax(0, width * height);
		mm = randMinMax2(mm[0], mm[1]);
	} else if(!nullOrUndefined(start) && nullOrUndefined(end)) {
		mm = randMinMax(start, randRange(start, width * height));
	} else if(nullOrUndefined(start) && !nullOrUndefined(end)) {
		mm = randMinMax(randRange(0, (width * height) - end), end);
	} else {
		mm = [start, end];
	}
	var da = data.subarray(mm[0], mm[1]);
	Array.prototype.sort.call(da);
	data.set(da, mm[0]);
	this.bitmap.data = new Buffer(data);
	if (isNodePattern(cb)) return cb.call(this, null, this);
	else return this;
};
