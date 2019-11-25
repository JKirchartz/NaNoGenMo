#! /usr/bin/env node

// init project
var get = require("request");
var jimp = require("jimp");
var captionbot = require("captionbot");
var fs = require('fs');

var allimages = [];

var fileprefix = process.argv[2] || './tmp/';

const compositeImages = function (images, type) {
  var jimps = [];

  // shuffle images
  for (var j,x,i = images.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = images[i];
    images[i] = images[j];
    images[j] = x;
  }

  for (var i = 0; i < 5; i++) {
    jimps.push(jimp.read(images[i]));
  }

 Promise.all(jimps)
    .then(function(data) {
      return Promise.all(jimps);
    })
    .then(function(data) {
      var x = data[0].bitmap.width;
      var y = data[0].bitmap.height;
      var offset = Math.floor(Math.random() * x);
      var randOffset = Math.floor(Math.random() * offset);
      var filename = fileprefix + Date.now() + ".png";
      console.log(filename);
      for (var i = 1; i <=4; i++) {
        data[i].cover(x, y);
      }
      if (type !== "small"){
        // layer one
        data[0].composite(data[1], offset, 0, {mode:jimp.BLEND_LIGHTEN});
        data[0].composite(data[2], offset - data[2].width, 0, {mode:jimp.BLEND_LIGHTEN});
      }
      // layer two
      data[0].composite(data[3], randOffset, 0, {mode:jimp.BLEND_LIGHTEN});
      data[0].composite(data[4], randOffset - data[4].width, 0, {mode:jimp.BLEND_LIGHTEN});
      // write image
      data[0].write(filename);
    }).catch(function (err) {
      console.error(err);
    });
};

const imagegen = function(type, width, height) {
  fs.readdir('./tmp/images/', {withFileType: true}, function(err, files) {
    compositeImages(files.map((i) => './tmp/images/' + i), type);
  });
};

module.exports = imagegen;

if (process.argv[1]) {
  imagegen("large");
} else {
  module.exports = imagegen;
}
