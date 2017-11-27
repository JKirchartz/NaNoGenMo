Glitchy 3 Bit Dither
==============

Test this online with <a href="http://jkirchartz.com/Glitchy3bitdither/GlitchCruiser.html" title="Glitch Cruiser">Glitch Cruiser</a>.

<p>This is a commandline and web-based utility to mutilate images in unpredictable ways. It can randomly choose between algorithms, and many algorithms randomly mutate themselves.
    You can choose different encodings, effects, and emulate several glitch techniques, resulting in aleatoric new images and hidden configurations.</p>
</p>
<p>Check out some curated images at <a href="http://glitches.jkirchartz.com/">glitches.jkirchartz.com</a></p>
<p>This web-based utility completely client-side, using the FileReader and canvas APIs, your image isn't being uploaded to any server. If you have a decent browser, this should work. Also, you can right-click and save the result of the processing.</p>
<p>Based on Nolan Caudill's <a href="https://github.com/mncaudill/3bitdither">3bitdither</a></p>
<p>Heavily modified by JKirchartz, <a href="https://github.com/jkirchartz/Glitchy3bitdither">code on github</a></p>
<p>Experimental functions may not be 100% stable, this is a work in progress.</p>

## Usage

### use this as a command-line utility

install with `npm install -g git@github.com/jkirchartz/Glitchy3bitDither`

then run `gleech glitch <input image> <output image> <glitch function name> [optional: parameters]`

for example: `gleech glitch test.jpg output.jpg fractal` to allow the fractal function to choose it's own parameters OR `gleech.glitch test.jpg output.jpg fractal 0` to choose fractal type 0 (alternatively you can choose 1)


### using this as a node package

install with `npm install --save git@github.com/jkirchartz/Glitchy3bitDither`

and import it into your project for use like so:

```javascript
'use strict';
var gleech = require('gleech');

gleech.read('test.jpg', function(err, image) {
	image.fractal().write('output.jpg');
});
```
## Additional Information

Gleech is based on [JIMP][https://github.com/oliver-moran/jimp] and (theoretically) any JIMP function can be used in place of a glitch function.

run `gleech list` to see all available function names.


## todo:

1. update site (and gh-pages branch) to use `dist/gleech.js` instead of `site/js/Glitchy3bitDither.js`
1. optimize code w/ better code from the row-sorting algos
2. web workers
3. namespace
4. better function names
5. better comments
7. Add glitches:
  - scan lines (1px black line the entire width every N lines)
  - move each "row" in opposite directions (1px at a time)
  - kaleidoscope
8. Add blend modes: https://en.wikipedia.org/wiki/Blend_modes

## Release Notes

v0.2.1 glitch function only calls existant functions

v0.2.0 glitch functionality is available as a node package and a command-line interface (gleech)

v0.1.0 has added glitch functions to jimp, and mostly successfully emulates Glitchy3bitDither in node.js.
There are still some kinks to work out in a few of the glitch functions, use at your own peril.

## Run the site locally

The demo site in this repo is a [Jekyll](http://jekyllrb.com) project. To run locally install the gem &amp; run `jekyll --serve`.

You can also use the `--auto` flag to make Jekyll automatically update the site as files change.

Portions under the included MIT license, copyright 2013 Matthew Nolan Caudill, as noted.

JIMP (included in the node.js branch) is included under the MIT license (with Open Sans included under the Apache License)

Glitchy3bitDither is presented under the [GPL3.0 license](gpl-3.0.txt), copyleft 2013 JKirchartz, except as noted.


## Development

build with `npm build`

test with `npm test`

manually inspect images output in current directory


# I am open to any and all Pull Requests

please read [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

and... hack away! huzzah!
