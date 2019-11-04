#! /usr/bin/env node

// init project
var get = require("request");
var jimp = require("jimp");
var captionbot = require("captionbot");
var fs = require('fs');

var allimages = [];

const fetchImages = function(type, width, height) {
  if (width > 1000 || height > 1000) {
    type ="huge";
  }
  let params = [
    "action=query",
    "generator=random",
    "grnnamespace=500",
    "grnlimit=500",
    "list=allimages",
    "aiprop=url|dimensions",
    type === "huge" ? "" : "aimaxsize=200000",
    "ailimit=500",
    "prop=imageinfo|images",
    "iiprop=url",
    "imlimit=500",
    "pageids=500",
    "redirects=1",
    "format=json",
    "cachebuster=" + Math.random()
  ].join("&");
  return new Promise(function (resolve, reject) {
    get("https://commons.wikimedia.org/w/api.php?" + params, function(
      err,
      resp,
      body
    ) {
      if (!err && resp.statusCode == 200) {
        var data = JSON.parse(body);
        data = data.query.allimages.filter(function(i) {
          return ["jpg", "jpeg", "png", "bmp", "tiff", "gif"].includes(
            i.url.split(".").pop()
          );
        });
        data.map((data) => {
          console.log(data.url);
        });
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}

const imagegen = function(type, width, height) {
  fetchImages(type, width, height)
    .catch(function (err) {
      console.error(err);
    });
};

module.exports = imagegen;

if (process.argv[1]) {
  imagegen("large");
} else {
  module.exports = imagegen;
}
