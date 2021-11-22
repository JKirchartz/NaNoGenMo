#! /usr/bin/env node

// init project
var jimp = require("jimp");
var fs = require("fs");

var fileprefix = process.argv[2] || "./tmp/";

const compositeImages = function (images) {
  var jimps = [];

  // shuffle images
  for (var j,x,i = images.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = images[i];
    images[i] = images[j];
    images[j] = x;
  }

  for (var k = 0; k < 5; k++) {
    jimps.push(jimp.read(images[k]));
  }

  Promise.all(jimps)
    .then(function() {
      return Promise.all(jimps);
    })
    .then(function(data) {
      var x = data[0].bitmap.width;
      var y = data[0].bitmap.height;
      var offset = Math.floor(Math.random() * x);
      var randOffset = Math.floor(Math.random() * offset);
      var filename = Date.now() + ".png";
      filename = fileprefix + filename;
      console.log(filename);
      for (var i = 1; i <=4; i++) {
        data[i].cover(x, y);
      }
      // layer one
      data[0].composite(data[1], offset, 0, {mode:jimp.BLEND_LIGHTEN});
      data[0].composite(data[2], offset - data[2].width, 0, {mode:jimp.BLEND_LIGHTEN});
      // layer two
      data[0].composite(data[3], randOffset, 0, {mode:jimp.BLEND_LIGHTEN});
      data[0].composite(data[4], randOffset - data[4].width, 0, {mode:jimp.BLEND_LIGHTEN});
      // write image
      data[0].write(filename);
    }).catch(function (err) {
      console.error(err);
    });
};

const imagegen = function(type) {
  fs.readdir("./tmp/images/", {withFileType: true}, function(err, files) {
    compositeImages(files.map((i) => "./tmp/images/" + i), type);
  });
};

module.exports = imagegen;

if (process.argv[1]) {
  imagegen();
} else {
  module.exports = imagegen;
}
