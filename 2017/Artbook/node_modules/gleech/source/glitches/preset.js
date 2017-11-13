/**
 * Preset - sequentially run ___ with random parameters
 * number - which preset to run (1-4) (default to 5 random glitches)
 */
Jimp.prototype.preset = function (number, cb) {
	var ops = [];
	switch(number) {
		case 1:
			ops = ['ditherRandom3', 'shortdumbsort', 'slice', 'invert', 'shortsort', 'shortsort', 'ditherRandom3', 'DrumrollVerticalWave', 'ditherBayer3', 'dumbSortRows', 'slicesort', 'DrumrollVertical'];
			break;
		case 2:
			ops = ['shortsort', 'slice2', 'fractalGhosts4', 'sort', 'fractalGhosts2', 'colorShift'];
			break;
		case 3:
			ops = ['ditherRandom3', 'focusImage', 'scanlines'];
			break;
		case 4:
			ops = ['ditherAtkinsons', 'focusImage', 'ditherRandom3', 'focusImage'];
			break;
		default:
			ops = ['glitch', 'glitch', 'glitch', 'glitch', 'glitch'];
			break;
	}
	for (var i in ops) {
		this[ops[i]]();
	}
	if (isNodePattern(cb)) return cb.call(this, null, this);
	else return this;
};


