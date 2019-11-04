#! /usr/bin/env node

// init project
var get = require("request");
var jimp = require("jimp");
var captionbot = require("captionbot");
var fs = require('fs');

var allimages = [];

const compositeImages = function (images) {
  console.log("composite images");
  var jimps = [];

  for (var i = 0; i < images.length; i++) {
    jimps.push(jimp.read(images[i].url));
  }

  Promise.all(jimps)
    .then(function(data) {
      console.log("p.a(jimps):");
      return Promise.all(jimps);
    })
    .then(function(data) {
      console.log("composite");
      var x = width ? width : data[0].bitmap.width;
      var y = height ? height : data[0].bitmap.height;
      var offset = Math.floor(Math.random() * x);
      var randOffset = Math.floor(Math.random() * offset);
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
      console.log("write image");
      // write image
      data[0].write(Date().toString().replace(/\s+/g, '_') + ".png");
    }).catch(function (err) {
      console.error(err);
    });
};

const imagegen = function(type, width, height) {
  fs.readdir('./tmp/images/', {withFileType: true}, function(err, files) {
    compositeImages(files)
    .catch(function (err) {
      console.error(err);
    });
  }
};

module.exports = imagegen;

if (process.argv[1]) {
  imagegen("large");
} else {
  module.exports = imagegen;
}
