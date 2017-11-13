/**
 * Glitch - randomly choose glitch functions to perform on the incoming image
 */
Jimp.prototype.glitch = function (cb) {
	// chose and run random functions
	var hist = [];
	for (var i = 0, l = randRange(5, 10); i < l; i++) {
		switch (randFloor(13)) {
			case 0:
				this.focusImage();
				hist.push('focusImage');
				break;
			case 1:
				this.ditherBitmask();
				hist.push('ditherBitmask');
				break;
			case 2:
				if (Math.random() > 0.5) {
					this.superSlice();
				} else {
					this.superSlice2();
				}
				hist.push('superSlice/2');
				break;
			case 3:
				this.colorShift();
				hist.push('colorShift');
				break;
			case 4:
				this.ditherRandom3();
				hist.push('ditherRandom3');
				break;
			case 5:
				this.ditherBayer3();
				hist.push('ditherBayer3');
				break;
			case 6:
				this.ditherAtkinsons();
				hist.push('ditherAtkinsons');
				break;
			case 7:
				this.ditherFloydSteinberg();
				hist.push('ditherFloydSteinberg');
				break;
			case 8:
				this.ditherHalftone();
				hist.push('ditherHalftone');
				break;
			case 9:
				this.dither8Bit();
				hist.push('dither8bit');
				break;
			case 10:
				if (coinToss()) {
					var picker = randFloor(3);
					if (picker == 1) {
						this.redShift();
						hist.push('redShift');
					} else if (picker == 2) {
						this.greenShift();
						hist.push('greenShift');
					} else {
						this.blueShift();
						hist.push('blueShift');
					}
				}
				break;
			default:
				this.invert();
				hist.push('invert');
				break;
		}
	}
	console.log('glitch history: ', hist.join(', '));
	if (isNodePattern(cb)) return cb.call(this, null, this);
	else return this;
};
