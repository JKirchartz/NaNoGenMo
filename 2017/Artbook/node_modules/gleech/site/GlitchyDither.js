var gleech = (function(gleech) {
  'use strict';
  var imageData, originalImageData;
  /* global arrays of functions */
  gleech.exp = ['pixelFunk', 'superPixelFunk', 'shortsort', 'shortdumbsort',
    'sort', 'slicesort', 'sortStripe', 'sortRows', 'randomSortRows', 'dumbSortRows',
  'pixelSort', 'randomGlitch', 'glitch', 'preset1', 'preset2', 'preset3', 'preset4'];
  gleech.orig = ['focusImage', 'rgb_glitch', 'invert', 'slice', 'slice2', 'slice3', 'scanlines',
    'fractalGhosts', 'fractalGhosts2', 'fractalGhosts3', 'fractalGhosts4', 'fractal',
  'fractal2', 'DrumrollHorizontal', 'DrumrollVertical', 'DrumrollHorizontalWave',
  'DrumrollVerticalWave', 'ditherBitmask', 'colorShift', 'colorShift2',
  'ditherRandom', 'ditherRandom3', 'ditherBayer', 'ditherBayer3', 'redShift',
  'greenShift', 'blueShift', 'superShift', 'superSlice', 'superSlice2',
  'ditherAtkinsons', 'ditherFloydSteinberg', 'ditherHalftone', 'dither8Bit'];

  gleech.init = function init(data) {
    if ( data.toString() !== "[object ImageData]" ) {
      throw new Error('Gleech expects ImageData');
    } else {
      gleech.imageData = data;
      gleech.originalImageData = data;
    }
    return this;
  };

  /***************************************************
   * Helper Functions
   ***************************************************/

  function adjustPixelError(data, i, error, multiplier) {
    data[i] = data[i] + multiplier * error[0];
    data[i + 1] = data[i + 1] + multiplier * error[1];
    data[i + 2] = data[i + 2] + multiplier * error[2];
  }

  // return random # < a
  function randFloor(a) {return Math.floor(Math.random() * a);}
  // return random # <= a
  function randRound(a) {return Math.round(Math.random() * a);}
  // return random # between A & B
  function randRange(a, b) {return Math.round(Math.random() * b) + a;}
  // relatively fair 50/50
  function coinToss() {return Math.random() > 0.5;}
  function randMinMax(min, max) {
    // generate min & max values by picking
    // one 'fairly', then picking another from the remainder
    var randA = Math.round(randRange(min, max));
    var randB = Math.round(randRange(randA, max));
    return [randA, randB];
  }
  function randMinMax2(min, max) {
    // generate min & max values by picking both fairly
    // then returning the lesser value before the greater.
    var randA = Math.round(randRange(min, max));
    var randB = Math.round(randRange(min, max));
    return randA < randB ? [randA, randB] : [randB, randA];
  }
  function randChoice(arr) {
    return arr[randFloor(arr.length)];
  }

  function randChance(percent) {
    // percent is a number 1-100
    return (Math.random() < (percent / 100));
  }

  function sum(o) {
    for (var s = 0, i = o.length; i; s += o[--i]) {}
    return s;
  }
  function leftSort(a, b) {return parseInt(a, 10) - parseInt(b, 10);}
  function rightSort(a, b) {return parseInt(b, 10) - parseInt(a, 10);}
  function blueSort(a, b) {
    var aa = a >> 24 & 0xFF,
      ar = a >> 16 & 0xFF,
      ag = a >> 8 & 0xFF,
      ab = a & 0xFF;
    var ba = b >> 24 & 0xFF,
      br = b >> 16 & 0xFF,
      bg = b >> 8 & 0xFF,
      bb = b & 0xFF;
    return aa - bb;
  }
  function redSort(a, b) {
    var aa = a >> 24 & 0xFF,
      ar = a >> 16 & 0xFF,
      ag = a >> 8 & 0xFF,
      ab = a & 0xFF;
    var ba = b >> 24 & 0xFF,
      br = b >> 16 & 0xFF,
      bg = b >> 8 & 0xFF,
      bb = b & 0xFF;
    return ar - br;
  }
  function greenSort(a, b) {
    var aa = a >> 24 & 0xFF,
      ar = a >> 16 & 0xFF,
      ag = a >> 8 & 0xFF,
      ab = a & 0xFF;
    var ba = b >> 24 & 0xFF,
      br = b >> 16 & 0xFF,
      bg = b >> 8 & 0xFF,
      bb = b & 0xFF;
    return ag - bg;
  }
  function avgSort(a, b) {
    var aa = a >> 24 & 0xFF,
      ar = a >> 16 & 0xFF,
      ag = a >> 8 & 0xFF,
      ab = a & 0xFF;
    var ba = b >> 24 & 0xFF,
      br = b >> 16 & 0xFF,
      bg = b >> 8 & 0xFF,
      bb = b & 0xFF;
    return ((aa + ar + ag + ab) / 4) - ((ba + br + bg + bb) / 4);
  }
  function randSort(a, b) {
    var sort = randChoice([coinToss, leftSort, rightSort, redSort, greenSort,
                          blueSort, avgSort]);
    return sort(a, b);
  }


  gleech.original = function original(imageData) {
    return imageData;
  };

  /***************************************************
   * Dithering
   ***************************************************/

  gleech.dither8Bit = function dither8Bit(imageData) {
    var width = imageData.width,
      height = imageData.height,
      data = imageData.data,
      size = 4, sum_r, sum_g, sum_b, avg_r, avg_g, avg_b;
    for (var y = 0; y < height; y += size) {
      for (var x = 0; x < width; x += size) {
        sum_r = 0;
        sum_g = 0;
        sum_b = 0;
        var s_y, s_x, i;
        for (s_y = 0; s_y < size; s_y++) {
          for (s_x = 0; s_x < size; s_x++) {
            i = 4 * (width * (y + s_y) + (x + s_x));
            sum_r += data[i];
            sum_g += data[i + 1];
            sum_b += data[i + 2];
          }
        }
        avg_r = (sum_r / (size * size)) > 127 ? 0xff : 0;
        avg_g = (sum_g / (size * size)) > 127 ? 0xff : 0;
        avg_b = (sum_b / (size * size)) > 127 ? 0xff : 0;
        for (s_y = 0; s_y < size; s_y++) {
          for (s_x = 0; s_x < size; s_x++) {
            i = 4 * (width * (y + s_y) + (x + s_x));
            data[i] = avg_r;
            data[i + 1] = avg_g;
            data[i + 2] = avg_b;
          }
        }
      }
    }
    return imageData;
  };

  gleech.ditherHalftone = function ditherHalftone(imageData) {
    var width = imageData.width,
      height = imageData.height,
      data = imageData.data;
    for (var y = 0; y <= height - 2; y += 3) {
      for (var x = 0; x <= width - 2; x += 3) {
        var sum_r = 0, sum_g = 0, sum_b = 0;
        var indexed = [];
        var count = 0;
        for (var s_y = 0; s_y < 3; s_y++) {
          for (var s_x = 0; s_x < 3; s_x++) {
            var i = 4 * (width * (y + s_y) + (x + s_x));
            sum_r += data[i];
            sum_g += data[i + 1];
            sum_b += data[i + 2];
            data[i] = data[i + 1] = data[i + 2] = 0xff;
            indexed.push(i);
            count++;
          }
        }
        var avg_r = (sum_r / 9) > 127 ? 0xff : 0;
        var avg_g = (sum_g / 9) > 127 ? 0xff : 0;
        var avg_b = (sum_b / 9) > 127 ? 0xff : 0;
        var avg_lum = (avg_r + avg_g + avg_b) / 3;
        var scaled = Math.round((avg_lum * 9) / 255);
        if (scaled < 9) {
          data[indexed[4]] = avg_r;
          data[indexed[4] + 1] = avg_g;
          data[indexed[4] + 2] = avg_b;
        }
        if (scaled < 8) {
          data[indexed[5]] = avg_r;
          data[indexed[5] + 1] = avg_g;
          data[indexed[5] + 2] = avg_b;
        }
        if (scaled < 7) {
          data[indexed[1]] = avg_r;
          data[indexed[1] + 1] = avg_g;
          data[indexed[1] + 2] = avg_b;
        }
        if (scaled < 6) {
          data[indexed[6]] = avg_r;
          data[indexed[6] + 1] = avg_g;
          data[indexed[6] + 2] = avg_b;
        }
        if (scaled < 5) {
          data[indexed[3]] = avg_r;
          data[indexed[3] + 1] = avg_g;
          data[indexed[3] + 2] = avg_b;
        }
        if (scaled < 4) {
          data[indexed[8]] = avg_r;
          data[indexed[8] + 1] = avg_g;
          data[indexed[8] + 2] = avg_b;
        }
        if (scaled < 3) {
          data[indexed[2]] = avg_r;
          data[indexed[2] + 1] = avg_g;
          data[indexed[2] + 2] = avg_b;
        }
        if (scaled < 2) {
          data[indexed[0]] = avg_r;
          data[indexed[0] + 1] = avg_g;
          data[indexed[0] + 2] = avg_b;
        }
        if (scaled < 1) {
          data[indexed[7]] = avg_r;
          data[indexed[7] + 1] = avg_g;
          data[indexed[7] + 2] = avg_b;
        }
      }
    }
    return imageData;
  };

  gleech.ditherAtkinsons = function ditherAtkinsons(imageData) {
    var width = imageData.width,
      height = imageData.height,
      data = imageData.data;
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
        //       *  1/8 1/8
        //  1/8 1/8 1/8
        //      1/8
        // The ones to the right...
        var adj_i = 0;
        if (x < width - 1) {
          adj_i = i + 4;
          adjustPixelError(data, adj_i, [err_r, err_g, err_b], 1 / 8);
          // The pixel that's down and to the right
          if (y < height - 1) {
            adj_i = adj_i + (width * 4) + 4;
            adjustPixelError(data, adj_i, [err_r, err_g, err_b], 1 / 8);
          }
          // The pixel two over
          if (x < width - 2) {
            adj_i = i + 8;
            adjustPixelError(data, adj_i, [err_r, err_g, err_b], 1 / 8);
          }
        }
        if (y < height - 1) {
          // The one right below
          adj_i = i + (width * 4);
          adjustPixelError(data, adj_i, [err_r, err_g, err_b], 1 / 8);
          if (x > 0) {
            // The one to the left
            adj_i = adj_i - 4;
            adjustPixelError(data, adj_i, [err_r, err_g, err_b], 1 / 8);
          }
          if (y < height - 2) {
            // The one two down
            adj_i = i + (2 * width * 4);
            adjustPixelError(data, adj_i, [err_r, err_g, err_b], 1 / 8);
          }
        }
      }
    }
    return imageData;
  };

  gleech.ditherFloydSteinberg = function ditherFloydSteinberg(imageData) {
    var width = imageData.width,
      height = imageData.height,
      data = imageData.data;
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
    return imageData;
  };

  gleech.ditherBayer = function ditherBayer(imageData) {
    var width = imageData.width,
      height = imageData.height,
      data = imageData.data,
      /* added more threshold maps and the randomizer, the rest is stock */
    threshold_maps = [
      [
        [3, 7, 4],
        [6, 1, 9],
        [2, 8, 5]
      ],
      [
        [1, 9, 3, 11],
        [13, 5, 15, 7],
        [4, 12, 2, 10],
        [16, 8, 14, 6]
      ],
      [
        [1, 49, 13, 61, 4, 52, 16, 64],
        [33, 17, 45, 29, 36, 20, 48, 32],
        [9, 57, 5, 53, 12, 60, 8, 56],
        [41, 25, 37, 21, 44, 28, 40, 24],
        [3, 51, 15, 63, 2, 50, 14, 62],
        [35, 19, 47, 31, 34, 18, 46, 30],
        [11, 59, 7, 55, 10, 58, 6, 54],
        [43, 27, 39, 23, 42, 26, 38, 22]
      ]
    ],
    threshold_map = threshold_maps[randFloor(threshold_maps.length)],
      size = threshold_map.length;
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        var i = 4 * (y * width + x);
        var gray = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
        var scaled = (gray * 17) / 255;
        var val = scaled < threshold_map[x % size][y % size] ? 0 : 0xff;
        data[i] = data[i + 1] = data[i + 2] = val;
      }
    }
    return imageData;
  };

  gleech.ditherBayer3 = function ditherBayer3(imageData) {
    var width = imageData.width,
      height = imageData.height,
      data = imageData.data,
      /* adding in more threshold maps, and the randomizer */
    threshold_maps = [
      [
        [3, 7, 4],
        [6, 1, 9],
        [2, 8, 5]
      ],
      [
        [1, 9, 3, 11],
        [13, 5, 15, 7],
        [4, 12, 2, 10],
        [16, 8, 14, 6]
      ],
      [
        [1, 49, 13, 61, 4, 52, 16, 64],
        [33, 17, 45, 29, 36, 20, 48, 32],
        [9, 57, 5, 53, 12, 60, 8, 56],
        [41, 25, 37, 21, 44, 28, 40, 24],
        [3, 51, 15, 63, 2, 50, 14, 62],
        [35, 19, 47, 31, 34, 18, 46, 30],
        [11, 59, 7, 55, 10, 58, 6, 54],
        [43, 27, 39, 23, 42, 26, 38, 22]
      ]
    ],
    threshold_map = threshold_maps[randFloor(threshold_maps.length)],
      size = threshold_map.length;
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        var i = 4 * (y * width + x);
        /* apply the tranformation to each color */
        data[i] = ((data[i] * 17) / 255) < threshold_map[x % size][y %
          size] ? 0 : 0xff;
          data[i + 1] = ((data[i + 1] * 17) / 255) < threshold_map[x %
            size][y % size] ? 0 : 0xff;
            data[i + 2] = ((data[i + 2] * 17) / 255) < threshold_map[x %
              size][y % size] ? 0 : 0xff;
      }
    }
    return imageData;
  };

  gleech.ditherRandom = function ditherRandom(imageData) {
    var width = imageData.width,
      height = imageData.height,
      data = imageData.data;
    for (var i = 0, val, scaled, size = width * height * 4; i < size; i += 4) {
      scaled = ((data[i] + data[i + 1] + data[i + 2]) / 3) % 255;
      val = scaled < randRound(128) ? 0 : 0xff;
      data[i] = data[i + 1] = data[i + 2] = val;
    }
    return imageData;
  };

  gleech.ditherRandom3 = function ditherRandom3(imageData) {
    var width = imageData.width,
      height = imageData.height,
      data = imageData.data;
    for (var i = 0, size = width * height * 4; i < size; i += 4) {
      data[i] = data[i] < randRound(128) ? 0 : 0xff;
      data[i + 1] = data[i + 1] < randRound(128) ? 0 : 0xff;
      data[i + 2] = data[i + 2] < randRound(128) ? 0 : 0xff;
    }
    return imageData;
  };

  gleech.ditherBitmask = function ditherBitmask(imageData) {
    var width = imageData.width,
      height = imageData.height,
      data = imageData.data,
      M = randRange(1, 125);
    // 0xc0; 2 bits
    // 0xe0  3 bits
    // 0xf0  4 bits
    for (var i = 0, size = width * height * 4; i < size; i += 4) {
      // data[i] |= M;
      // data[i + 1] |= M;
      // data[i + 2] |= M;
      data[i] |= M;
      data[i + 1] |= M;
      data[i + 2] |= M;
    }
    return imageData;
  };


  /***************************************************
   * Glitch
   ***************************************************/
  gleech.colorShift = function colorShift(imageData) {
    var width = imageData.width,
      height = imageData.height,
      data = imageData.data,
      dir = coinToss();
    for (var i = 0, size = width * height * 4; i < size; i += 4) {
      var r = data[i],
        g = data[i + 1],
        b = data[i + 2];
      data[i] = dir ? g : b;
      data[i + 1] = dir ? b : r;
      data[i + 2] = dir ? r : g;
    }
    return imageData;
  };
  gleech.colorShift2 = function colorShift2(imageData) {
    var width = imageData.width,
      height = imageData.height,
      data = new Uint32Array(imageData.data.buffer),
      dir = coinToss();
    for (var i = 0, size = data.length; i < size; i++) {
      var a = data[i] >> 24 & 0xFF,
        r = data[i] >> 16 & 0xFF,
        g = data[i] >> 8 & 0xFF,
        b = data[i] & 0xFF;
      r = (dir ? g : b) & 0xFF;
      g = (dir ? b : r) & 0xFF;
      b = (dir ? r : g) & 0xFF;
      data[i] = (a << 24) + (r << 16) + (g << 8) + (b);
    }
    return imageData;
  };

  gleech.greenShift = function greenShift(imageData) {
    var width = imageData.width,
      height = imageData.height,
      data = imageData.data,
      factor = randFloor(64);
    for (var i = 0, size = width * height * 4; i < size; i += 4) {
      var shift = data[i + 1] + factor;
      data[i] -= factor;
      data[i + 1] = (shift) > 255 ? 255 : shift;
      data[i + 2] -= factor;
    }
    return imageData;
  };

  gleech.redShift = function redShift(imageData) {
    var width = imageData.width,
      height = imageData.height,
      data = imageData.data,
      factor = randFloor(64);
    for (var i = 0, size = width * height * 4; i < size; i += 4) {
      var shift = data[i] + factor;
      data[i] = (shift) > 255 ? 255 : shift;
      data[i + 1] -= factor;
      data[i + 2] -= factor;
    }
    return imageData;
  };

  gleech.blueShift = function blueShift(imageData) {
    var width = imageData.width,
      height = imageData.height,
      data = imageData.data,
      factor = randFloor(64);
    for (var i = 0, size = width * height * 4; i < size; i += 4) {
      var shift = data[i + 2] + factor;
      data[i] -= factor;
      data[i + 1] -= factor;
      data[i + 2] = (shift) > 255 ? 255 : shift;
    }
    return imageData;
  };

  gleech.superShift = function superShift(imageData) {
    for (var i = 0, l = randRange(1, 10); i < l; i++) {
      imageData = gleech.colorShift(imageData);
    }
    return imageData;
  };

  // TODO: delete this function
  gleech.getColors = function getColors(imageData) {
    var data = new Uint32Array(imageData.data.buffer),
      height = imageData.height,
      width = imageData.width;
    console.log(data[0].toString(16));
    console.log((~ data[0] | 0xFF000000).toString(16));
    for (var i = 8; i--;) {
      console.log(randChoice(data).toString(16));
    }
    return imageData;
  };

  gleech.superPixelFunk = function superPixelFunk(imageData) {
    var data = new Uint32Array(imageData.data.buffer),
      height = imageData.height,
      width = imageData.width,
      pixelation = randRange(2, 15);
    for (var y = 0; y < height; y += pixelation) {
      for (var x = 0; x < width; x += pixelation) {
        if (coinToss()) {
          var locale = coinToss();
          var mask = randChoice([0x00FF0000, 0x0000FF00, 0x000000FF]);
          var i = coinToss() ? (y * width + x) :
            (y * width + (x - (pixelation * 2)));
          for (var n = 0; n < pixelation; n++) {
            for (var m = 0; m < pixelation; m++) {
              if (x + m < width) {
                var j = ((width * (y + n)) + (x + m));
                data[j] = locale ? data[i] : data[j] | mask;
              }
            }
          }
        }
      }
    }
    return imageData;
  };

  gleech.pixelFunk = function pixelFunk(imageData) {
    var data = new Uint32Array(imageData.data.buffer),
      height = imageData.height,
      width = imageData.width,
      pixelation = randRange(2, 10);
    for (var y = 0; y < height; y += pixelation) {
      for (var x = 0; x < width; x += pixelation) {
        if (coinToss()) {
          var i = (y * width + x);
          for (var n = 0; n < pixelation; n++) {
            for (var m = 0; m < pixelation; m++) {
              if (x + m < width) {
                var j = ((width * (y + n)) + (x + m));
                data[j] = data[i];
              }
            }
          }
        }
      }
    }
    return imageData;
  };
  gleech.focusImage = function focusImage(imageData) {
    var data = new Uint32Array(imageData.data.buffer),
      height = imageData.height,
      width = imageData.width,
      pixelation = randRange(2, 10);
    for (var y = 0; y < height; y += pixelation) {
      for (var x = 0; x < width; x += pixelation) {
        var i = (y * width + x);
        for (var n = 0; n < pixelation; n++) {
          for (var m = 0; m < pixelation; m++) {
            if (x + m < width) {
              var j = ((width * (y + n)) + (x + m));
              data[j] = data[i];
            }
          }
        }
      }
    }
    return imageData;
  };

  gleech.slice = function slice(imageData) {
    var width = imageData.width,
      height = imageData.height,
      data = imageData.data,
      cutend = randFloor(width * height * 4),
      cutstart = Math.floor(cutend / 1.7),
      cut = data.subarray(cutstart, cutend);
    data.set(cut, randFloor((width * height * 4) - cut.length));
    imageData.data.set(data);
    return imageData;
  };

  gleech.slice2 = function slice2(imageData) {
    var width = imageData.width,
      height = imageData.height,
      data = imageData.data;
    for (var i = 0, l = randRound(11); i < l; i++) {
      var cutend = Math.random() < 0.75 ? randFloor(width * height * 4) :
        (width * height * 4),
      cutstart = Math.floor(cutend / 1.7),
        cut = data.subarray(cutstart, cutend);
      //data.set(cut, randFloor(width * height * 2));
      data.set(cut, randFloor((width * height * 4) - cut.length));
    }
    imageData.data.set(data);
    return imageData;
  };

  gleech.slice3 = function slice3(imageData) {
    var width = imageData.width,
      height = imageData.height,
      data = imageData.data;
    for (var i = 0, l = randRound(20); i < l; i++) {
      var cutend = randFloor(width * height * 4),
        cutstart = cutend - randRange(1000, 5100),
        cut = data.subarray(cutstart, cutend);
      data.set(cut, randFloor((width * height * 4) - cut.length));
      //data.set(cut, randFloor(width * height * 2));
    }
    imageData.data.set(data);
    return imageData;
  };


  gleech.superSlice2 = function superSlice2(imageData) {
    var functs = ['slice', 'slice2', 'slice3'];
    for (var i = 0, l = randRound(functs.length); i < l; i++) {
      var fun = randFloor(functs.length);
      imageData = gleech[functs[fun]](imageData);
    }
    return imageData;
  };

  gleech.superSlice = function superSlice(imageData) {
    for (var i = 0, l = randRange(1, 10); i < l; i++) {
      imageData = gleech.slice(gleech.slice2(gleech.slice3(imageData)));
    }
    return imageData;
  };

  gleech.fractalGhosts = function fractalGhosts(imageData) {
    var data = imageData.data;
    for (var i = 0; i < data.length; i++) {
      if (parseInt(data[i * 2 % data.length], 10) < parseInt(data[i], 10)) {
        data[i] = data[i * 2 % data.length];
      }
    }
    imageData.data.set(data);
    return imageData;
  };
  gleech.fractalGhosts2 = function fractalGhosts2(imageData) {
    var data = imageData.data,
      rand = randRange(1, 10);
    for (var i = 0; i < data.length; i++) {
      var tmp = (i * rand) % data.length;
      if (parseInt(data[tmp], 10) < parseInt(data[i], 10)) {
        data[i] = data[tmp];
      }
    }
    imageData.data.set(data);
    return imageData;
  };

  gleech.fractalGhosts3 = function fractalGhosts3(imageData) {
    var data = imageData.data,
      rand = randRange(1, 10),
      color = randRange(0, 4);
    for (var i = 0; i < data.length; i++) {
      if ((i % 4) === color) {
        data[i] = 0xFF;
        continue;
      }
      var tmp = (i * rand) % data.length;
      if (parseInt(data[tmp], 10) < parseInt(data[i], 10)) {
        data[i] = data[tmp];
      }
    }
    imageData.data.set(data);
    return imageData;
  };

  gleech.fractalGhosts4 = function fractalGhosts4(imageData) {
    var data = imageData.data,
      color = randRange(0, 4);
    for (var i = 0; i < data.length; i++) {
      if ((i % 4) === color) {
        data[i] = 0xFF;
        continue;
      }
      if (parseInt(data[i * 2 % data.length], 10) < parseInt(data[i], 10)) {
        data[i] = data[i * 2 % data.length];
      }
    }
    imageData.data.set(data);
    return imageData;
  };
  gleech.fractal = function fractal(imageData) {
    var data = new Uint32Array(imageData.data.buffer);
    for (var i = data.length; i; i--) {
      if (parseInt(data[(i * 2) % data.length], 10) < parseInt(data[i], 10)) {
        data[i] = data[(i * 2) % data.length];
      }
    }
    return imageData;
  };
  gleech.fractal2 = function fractal2(imageData) {
    var data = new Uint32Array(imageData.data.buffer);
    var m = randRange(2, 8);
    for (var i = 0; i < data.length; i++) {
      if (parseInt(data[(i * m) % data.length], 10) < parseInt(data[i], 10)) {
        data[i] = data[(i * m) % data.length];
      }
    }
    return imageData;
  };
  gleech.shortsort = function shortsort(imageData) {
    var data = new Uint32Array(imageData.data.buffer),
      mm = randMinMax(0, imageData.height * imageData.width), cut;
    mm = randMinMax2(mm[0], mm[1]);
    cut = data.subarray(mm[0], mm[1]);
    if (coinToss()) {
      Array.prototype.sort.call(cut, leftSort);
    } else {
      Array.prototype.sort.call(cut, rightSort);
    }
    imageData.data.set(data.buffer);
    return imageData;
  };
  gleech.shortdumbsort = function shortdumbsort(imageData) {
    var data = new Uint32Array(imageData.data.buffer),
      mm = randMinMax(0, imageData.width * imageData.height), da;
    mm = randMinMax2(mm[0], mm[1]);
    da = data.subarray(mm[0], mm[1]);
    Array.prototype.sort.call(da);
    imageData.data.set(da, mm[0]);
    return imageData;
  };

  gleech.sort = function sort(imageData) {
    var data = new Uint32Array(imageData.data.buffer);
    if (coinToss()) {
      Array.prototype.sort.call(data, leftSort);
    } else {
      Array.prototype.sort.call(data, rightSort);
    }
    imageData.data.set(data, 0);
    return imageData;
  };
  gleech.slicesort = function slicesort(imageData) {
    var data = new Uint32Array(imageData.data.buffer),
      mm = randMinMax(0, data.length);
    mm = randMinMax(mm[0], mm[1]);
    mm = randMinMax(mm[0], mm[1]);
    var cut = data.subarray(mm[0], mm[1]),
      offset = Math.abs(randRound(data.length) - cut.length) % data.length;
    Array.prototype.sort.call(cut, leftSort);
    imageData.data.set(data.buffer, coinToss() ? offset : mm[0]);
    return imageData;
  };

  gleech.sortRows = function sortRows(imageData) {
    var data = new Uint32Array(imageData.data.buffer),
      width = imageData.width, height = imageData.height;
    for (var i = 0, size = data.length + 1; i < size; i += width) {
      var da = data.subarray(i, i + width);
      Array.prototype.sort.call(da, leftSort);
      da.copyWithin(data, i);
    }
    imageData.data.set(data.buffer);
    return imageData;
  };

  gleech.sortStripe = function sortStripe(imageData) {
    var data = new Uint32Array(imageData.data.buffer),
      width = imageData.width,
      mm = randMinMax(0, width);
    mm = randMinMax2(mm[0], mm[1]);
    for (var i = 0, size = data.length + 1; i < size; i += width) {
      var da = data.subarray(i + mm[0], i + mm[1]);
      Array.prototype.sort.call(da, leftSort);
      da.copyWithin(data, i + mm[0]);
    }
    imageData.data.set(data.buffer);
    return imageData;
  };


  gleech.dumbSortRows = function dumbSortRows(imageData) {
    var data = new Uint32Array(imageData.data.buffer),
      width = imageData.width, height = imageData.height;
    for (var i = 0, size = data.length; i < size; i += width) {
      // var mm = randMinMax(i, i + width);
      // var da = data.subarray(mm[0], mm[1]);
      var da = data.subarray(i, i + width);
      Array.prototype.sort.call(da);
      data.set(da, i);
      /*
         for (var i = 0, size = data.length; i < size; i += width) {
         var da = Array.apply([], data.subarray(i, i + width));
         da.sort(coinToss);
         data.set(da, i);
         */
    }
    imageData.data.set(data.buffer);
    return imageData;
  };
  gleech.randomSortRows = function randomSortRows(imageData) {
    var data = new Uint32Array(imageData.data.buffer),
      width = imageData.width, height = imageData.height;
    for (var i = 0, size = data.length; i < size; i += width) {
      // var mm = randMinMax(i, i + width);
      // var da = data.subarray(mm[0], mm[1]);
      var da = data.subarray(i, i + width);
      Array.prototype.sort.call(da, coinToss);
      data.set(da, i);
      /*
         for (var i = 0, size = data.length; i < size; i += width) {
         var da = Array.apply([], data.subarray(i, i + width));
         da.sort(coinToss);
         data.set(da, i);
         */
    }
    imageData.data.set(data.buffer);
    return imageData;
  };

  gleech.invert = function invert(imageData) {
    var data = new Uint32Array(imageData.data.buffer);
    for (var i = 0; i < data.length; i++) {
      data[i] = ~ data[i] | 0xFF000000;
    }
    imageData.data.set(data.buffer);
    return imageData;
  };
  gleech.rgb_glitch = function rgb_glitch(imageData) {
    var data = imageData.data,
      width = imageData.width,
      height = imageData.height,
      mm = randMinMax(10, width - 10),
      opt = mm[1] % 3,
      dir = coinToss();
    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        var index = ((width * y) + x) * 4,
          red = data[index],
          green = data[index + 1],
          blue = data[index + 2];
        if (dir) {
          if (opt === 0) {
            data[index + mm[0]] = red;
            data[index + mm[0] + 1] = green;
            data[index] = blue;
          }else if (opt === 1) {
            data[index] = red;
            data[index + mm[0] + 1] = green;
            data[index + mm[0]] = blue;
          } else {
            data[index + mm[0]] = red;
            data[index + 1] = green;
            data[index + mm[0]] = blue;
          }
        } else {
          if (opt === 0) {
            data[index - mm[0] + 1] = red;
            data[index - mm[0]] = green;
            data[index] = blue;
          }else if (opt === 1) {
            data[index + 1] = red;
            data[index - mm[0]] = green;
            data[index - mm[0]] = blue;
          } else {
            data[index - mm[0] + 1] = red;
            data[index] = green;
            data[index - mm[0]] = blue;
          }
        }
      }
    }
    imageData.data.set(data);
    return imageData;
  };
  gleech.DrumrollVerticalWave = function DrumrollVerticalWave(imageData) {
    /* borrowed from https://github.com/ninoseki/glitched-canvas & modified w/
     * cosine */
    var data = imageData.data,
      width = imageData.width,
      height = imageData.height,
      roll = 0;
    for (var x = 0; x < width; x++) {
      if (Math.random() > 0.95) roll = Math.floor(Math.cos(x) * (height * 2));
      if (Math.random() > 0.98) roll = 0;

      for (var y = 0; y < height; y++) {
        var idx = (x + y * width) * 4;

        var y2 = y + roll;
        if (y2 > height - 1) y2 -= height;
        var idx2 = (x + y2 * width) * 4;

        for (var c = 0; c < 4; c++) {
          data[idx2 + c] = data[idx + c];
        }
      }
    }

    imageData.data.set(data);
    return imageData;
  };
  gleech.DrumrollHorizontalWave = function DrumrollHorizontalWave(imageData) {
    /* borrowed from https://github.com/ninoseki/glitched-canvas & modified
     * with cosine */
    var data = imageData.data,
      width = imageData.width,
      height = imageData.height,
      roll = 0;
    for (var x = 0; x < width; x++) {
      if (Math.random() > 0.95) roll = Math.floor(Math.cos(x) * (height * 2));
      if (Math.random() > 0.98) roll = 0;

      for (var y = 0; y < height; y++) {
        var idx = (x + y * width) * 4;

        var x2 = x + roll;
        if (x2 > width - 1) x2 -= width;
        var idx2 = (x2 + y * width) * 4;

        for (var c = 0; c < 4; c++) {
          data[idx2 + c] = data[idx + c];
        }
      }
    }

    imageData.data.set(data);
    return imageData;
  };
  gleech.DrumrollVertical = function DrumrollVertical(imageData) {
    /* borrowed from https://github.com/ninoseki/glitched-canvas */
    var data = imageData.data,
      width = imageData.width,
      height = imageData.height,
      roll = 0;
    for (var x = 0; x < width; x++) {
      if (Math.random() > 0.95) roll = randFloor(height);
      if (Math.random() > 0.95) roll = 0;

      for (var y = 0; y < height; y++) {
        var idx = (x + y * width) * 4;

        var y2 = y + roll;
        if (y2 > height - 1) y2 -= height;
        var idx2 = (x + y2 * width) * 4;

        for (var c = 0; c < 4; c++) {
          data[idx2 + c] = data[idx + c];
        }
      }
    }

    imageData.data.set(data);
    return imageData;
  };
  gleech.DrumrollHorizontal = function DrumrollHorizontal(imageData) {
    /* borrowed from https://github.com/ninoseki/glitched-canvas */
    var data = imageData.data,
      width = imageData.width,
      height = imageData.height,
      roll = 0;
    for (var x = 0; x < width; x++) {
      if (Math.random() < 0.05) roll = randFloor(height);
      if (Math.random() < 0.05) roll = 0;

      for (var y = 0; y < height; y++) {
        var idx = (x + y * width) * 4;

        var x2 = x + roll;
        if (x2 > width - 1) x2 -= width;
        var idx2 = (x2 + y * width) * 4;

        for (var c = 0; c < 4; c++) {
          data[idx2 + c] = data[idx + c];
        }
      }
    }

    imageData.data.set(data);
    return imageData;
  };

  gleech.scanlines = function scanlines(imageData) {
    // future options:
    // type, xor/or ammount, stripe width
    var data = new Uint32Array(imageData.data.buffer),
      width = imageData.width, height = imageData.height,
      type = randRange(0, 3),
      size = randRange(3, 15),
      xorNum = randChoice([0x00555555, 0x00FF00FF00, 0x00F0F0F0, 0x00333333]),
      orNum = randChoice([0xFF555555, 0xFFFF00FF00, 0xFFF0F0F0, 0xFF333333]);
    for (var i = 0, l = data.length; i < l; i += (width * size)) {
      var row = Array.apply([], data.subarray(i, i + width));
      for (var p in row) {
        if (type === 0) {
          row[p] = row[p] ^ xorNum;
        } else if (type === 1) {
          row[p] = row[p] | orNum;
        } else {
          // invert
          row[p] = ~ row[p] | 0xFF000000;
        }
      }
      data.set(row, i);
    }
    imageData.data.set(data.buffer);
    return imageData;
  };

  gleech.pixelSort = function pixelSort(imageData) {
    var data = new Uint32Array(imageData.data.buffer),
      width = imageData.width, height = imageData.height;
    var upper = 0xFFAAAAAA, lower = 0xFF333333;
    for (var i = 0, size = data.length; i < size; i += width) {
      var row = Array.apply([], data.subarray(i, i + width));
      var low = 0, high = 0;
      for (var j in row) {
        if (!high && !low && row[j] >= low) {
          low = j;
        }
        if (low && !high && row[j] >= high) {
          high = j;
        }
      }
      if (low) {
        var da = row.slice(low, high);
        Array.prototype.sort.call(da, leftSort);
        data.set(da, (i + low) % (height * width));
      }
    }
    imageData.data.set(data.buffer);
    return imageData;
  };



  // templates for making new glitches
  gleech.XYtemplate = function XYtemplate(imageData) {
    var data = new Uint32Array(imageData.data.buffer),
      width = imageData.width, height = imageData.height;
    for (var y = 0; y < height; ++y) {
      for (var x = 0; x < width; ++x) {
        // do stuff to a 32bit pixel
        // ex: invert pixel colors
        // data[y * width + x] = ~ data[y * width + x] | 0xFF000000;
      }
    }
    imageData.data.set(data.buffer);
    return imageData;
  };
  gleech.RowTemplate = function RowTemplate(imageData) {
    var data = new Uint32Array(imageData.data.buffer),
      width = imageData.width, height = imageData.height;
    for (var i = 0, size = data.length; i < size; i += width) {
      var row = Array.apply([], data.subarray(i, i + width));
      // transform `row`, which contains a row of 32bit pixels
      // ex: make a black stripe 5px apart
      // if (i % 5 == 0) {
      //   for (var p in row) {
      //     row[p] = 0xFF000000;
      //   }
      // }
      data.set(row, i);
    }
    imageData.data.set(data.buffer);
    return imageData;
  };


  gleech.preset1 = function preset1(imageData) {
    var ops = ['ditherRandom3', 'shortdumbsort', 'slice', 'invert', 'shortsort', 'shortsort', 'ditherRandom3', 'DrumrollVerticalWave', 'ditherBayer3', 'dumbSortRows', 'slicesort', 'DrumrollVertical'];
    for (var i in ops) {
      gleech[ops[i]](imageData);
    }
    return imageData;
  };
  gleech.preset2 = function preset2(imageData) {
    var ops = ['shortsort', 'slice2', 'fractalGhosts4', 'sort', 'fractalGhosts2', 'colorShift'];
    for (var i in ops) {
      gleech[ops[i]](imageData);
    }
    return imageData;
  };
  gleech.preset3 = function preset3(imageData) {
    var ops = ['ditherRandom3', 'focusImage', 'scanlines'];
    for (var i in ops) {
      gleech[ops[i]](imageData);
    }
    return imageData;
  };
  gleech.preset4 = function preset4(imageData) {
    var ops = ['ditherAtkinsons', 'focusImage', 'ditherRandom3', 'focusImage'];
    for (var i in ops) {
      gleech[ops[i]](imageData);
    }
    return imageData;
  };


  /* these run random set of functions */

  gleech.theWorks = function theWorks(imageData) {
    var functions = document.getElementById('experimental').checked ?
      gleech.orig.concat(gleech.exp) : gleech.orig.slice(0),
    sortCounter = 0;
    functions.sort(coinToss);
    // filter out sorts, because stacked sorts are boring
    functions.filter(function(item) { return item.indexOf(/sort/gi); });
    for (var i = 0, l = functions.length, s = 0; i < l; i++) {
      gleech[functions[i]](imageData);
    }
    return imageData;
  };

  gleech.randomGlitch = function randomGlitch(imageData) {
    var functions = document.getElementById('experimental').checked ?  gleech.orig.concat(gleech.exp) : gleech.orig.slice(0),
    history = [];
    for (var i = 0, l = randRange(3, 6); i < l; i++) {
      var fun = randFloor(functions.length);
      gleech[functions[fun]](imageData);
      history.push(functions[fun]);
    }
    if (history.length === 0) {
      return gleech.randomGlitch(imageData);
    }
    console.log('randomGlitch history:', history);
    return imageData;
  };

  gleech.glitch = function glitch(imageData) {
    var hist = [];
    for (var i = 0, l = randRange(5, 10); i < l; i++) {
      switch (randFloor(13)) {
        case 0:
          imageData = gleech.focusImage(imageData);
        hist.push('focusImage');
        break;
        case 1:
          imageData = gleech.ditherBitmask(imageData);
        hist.push('ditherBitmask');
        break;
        case 2:
          imageData = (Math.random() > 0.5) ? gleech.superSlice(imageData) :
          gleech.superSlice2(imageData);
        hist.push('superSlice/2');
        break;
        case 3:
          imageData = gleech.colorShift(imageData);
        hist.push('colorShift');
        break;
        case 4:
          imageData = gleech.ditherRandom3(imageData);
        hist.push('ditherRandom3');
        break;
        case 5:
          imageData = gleech.ditherBayer3(imageData);
        hist.push('ditherBayer3');
        break;
        case 6:
          imageData = gleech.ditherAtkinsons(imageData);
        hist.push('ditherAtkinsons');
        break;
        case 7:
          imageData = gleech.ditherFloydSteinberg(imageData);
        hist.push('ditherFloydSteinberg');
        break;
        case 8:
          imageData = gleech.ditherHalftone(imageData);
        hist.push('ditherHalftone');
        break;
        case 9:
          imageData = gleech.dither8Bit(imageData);
        hist.push('dither8bit');
        break;
        case 10:
          if (coinToss()) {
          var picker = randFloor(3);
          if (picker == 1) {
            imageData = gleech.redShift(imageData);
            hist.push('redShift');
          } else if (picker == 2) {
            imageData = gleech.greenShift(imageData);
            hist.push('greenShift');
          } else {
            imageData = gleech.blueShift(imageData);
            hist.push('blueShift');
          }
        }
        break;
        /*
           case 11:
           imageData = (Math.random()>0.5) ? fractalGhosts(imageData) :
           fractalGhosts2(imageData);
           hist.push('fractalGhosts/2');
           break;
           */
        default:
        imageData = gleech.invert(imageData);
        hist.push('invert');
        break;
      }
    }
    console.log('glitch history', hist);
    return imageData;
  };
  return gleech;
}(gleech || {}));
