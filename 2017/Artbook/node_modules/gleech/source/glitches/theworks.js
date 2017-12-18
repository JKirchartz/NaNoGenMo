/**
 * theworks - run every glitch function on the incoming image
 */
Jimp.prototype.theworks = function (cb) {
	for (var prop in this) {
		if (typeof this[prop] === 'function' &&
				this[prop].name){
			this[prop]();
		}
	}
	if (isNodePattern(cb)) return cb.call(this, null, this);
	else return this;
};


