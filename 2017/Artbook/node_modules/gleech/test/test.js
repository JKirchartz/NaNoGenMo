/*
 * test.js
 * Copyright (C) 2017 jkirchartz <me@jkirchartz.com>
 *
 * Distributed under terms of the GPL 3.0 (General Public License) license.
 */

'use strict';
var gleech = require('../dist/gleech.js');


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.pixelFunk().write('test_pixelFunk.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.superPixelFunk().write('test_superPixelFunk.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.shortsort().write('test_shortsort.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.shortdumbsort().write('test_shortdumbsort.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.sort().write('test_sort.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.slicesort().write('test_slicesort.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.sortStripe().write('test_sortStripe.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.sortRows().write('test_sortRows.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.randomSortRows().write('test_randomSortRows.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.dumbSortRows().write('test_dumbSortRows.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.pixelSort().write('test_pixelSort.jpg');
});

gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.randomGlitch().write('test_randomGlitch.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.glitch().write('test_glitch.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.preset(1).write('test_preset1.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.preset(2).write('test_preset2.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.preset(3).write('test_preset3.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.preset(4).write('test_preset4.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.focusImage().write('test_focusImage.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.rgb_glitch().write('test_rgb_glitch.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.invert().write('test_invert.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.slice().write('test_slice.jpg');
});



gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.scanlines().write('test_scanlines.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.fractalGhosts().write('test_fractalGhosts.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.fractal().write('test_fractal.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.drumrollHorizontal().write('test_drumrollHorizontal.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.drumrollVertical().write('test_drumrollVertical.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.drumrollHorizontalWave().write('test_drumrollHorizontalWave.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.drumrollVerticalWave().write('test_drumrollVerticalWave.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.ditherBitmask().write('test_ditherBitmask.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.colorShift().write('test_colorShift.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.colorShift2().write('test_colorShift2.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.ditherRandom().write('test_ditherRandom.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.ditherRandom3().write('test_ditherRandom3.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.ditherBayer().write('test_ditherBayer.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.ditherBayer3().write('test_ditherBayer3.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.redShift().write('test_redShift.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.greenShift().write('test_greenShift.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.blueShift().write('test_blueShift.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.superShift().write('test_superShift.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.superSlice().write('test_superSlice.jpg');
});


/* TODO: implement, or figure out why this wasn't implemented
gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.superSlice2().write('test_superSlice2.jpg');
});
*/


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.ditherAtkinsons().write('test_ditherAtkinsons.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.ditherFloydSteinberg().write('test_ditherFloydSteinberg.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.ditherHalftone().write('test_ditherHalftone.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.dither8Bit().write('test_dither8Bit.jpg');
});






gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.glitch().write('test_glitch.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.preset(0).write('test_preset0.jpg');
});
gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.preset(1).write('test_preset1.jpg');
});
gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.preset(2).write('test_preset2.jpg');
});
gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.preset(3).write('test_preset3.jpg');
});
gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.preset(4).write('test_preset4.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.randomGlitch().write('test_randomGlitch.jpg');
});


gleech.read('./test.jpg', function (err, img) {
	if (err) { throw new Error(err); }
	img.theworks().write('test_theworks.jpg');
});
