/**
 * Dither: Floyd-Steinberg
 */
Jimp.prototype.ditherFloydSteinberg = function ditherFloydSteinberg(cb) {
	var width = this.bitmap.width,
	height = this.bitmap.height,
	data = this.bitmap.data;
	for (var y = 0; y < height; y++) {
		for (var x = 0; x < width; x++) {
			var i = 4 * (y * width + x);
			var old_r = data[i];
			var old_g = data[i + 1];
			var old_b = data[i + 2];
			var new_r = (old_r > 127) ? 0xff : 0;
			var new_g = (old_g > 127) ? 0xff : 0;
			var new_b = (old_b > 127) ? 0xff : 0;
			data[i] = new_r;
			data[i + 1] = new_g;
			data[i + 2] = new_b;
			var err_r = old_r - new_r;
			var err_g = old_g - new_g;
			var err_b = old_b - new_b;
			// Redistribute the pixel's error like this:
			//   * 7
			// 3 5 1
			// The ones to the right...
			var right_i = 0, down_i = 0, left_i = 0, next_right_i = 0;
			if (x < width - 1) {
				right_i = i + 4;
				adjustPixelError(data, right_i, [err_r, err_g, err_b], 7 / 16);
				// The pixel that's down and to the right
				if (y < height - 1) {
					next_right_i = right_i + (width * 4);
					adjustPixelError(data, next_right_i, [err_r, err_g, err_b],
							1 / 16);
				}
			}
			if (y < height - 1) {
				// The one right below
				down_i = i + (width * 4);
				adjustPixelError(data, down_i, [err_r, err_g, err_b], 5 / 16);
				if (x > 0) {
					// The one down and to the left...
					left_i = down_i - 4;
					adjustPixelError(data, left_i, [err_r, err_g, err_b], 3 /
							16);
				}
			}
		}
	}
	this.bitmap.data = new Buffer(data);
	if (isNodePattern(cb)) return cb.call(this, null, this);
	else return this;
};

