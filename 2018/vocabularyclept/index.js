/*
 * index.js
 * Copyleft (ↄ) 2018 jkirchartz <me@jkirchartz.com>
 *
 * Distributed under terms of the NPL (Necessary Public License) license.
 */

let syllables = require('syllable');
let fs = require('fs');
let request = require('request');

// todo: use this to loop all poems in the corpora directory, producing a single collected works
// it's possible to use the syllable-count corpus for all texts, to increase its vocabulary
// create a title-case converter to use on the first line of each poem -- give credit to the original author?

let capitalize = function (word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

let index = 0;
let output = "";
let titles = [];
let parsePoems = function(files, index) {
  if ( index == files.length ) {
    return;
  }
  console.log(files, index);
  let poem = fs.readFileSync('./corpora/' + files[index]).toString();
  poem = poem.split('\n');
  let lines = []
  let words = {};
  poem.forEach(function (line) {
    line = line.split(' ');
    line.forEach(function(word, index) {
      let count = syllables(word);
      if ( count && word.length ) {
        if ( typeof words[count] === 'undefined' ) {
          words[count] = [];
        }
        words[count].push(word.toLowerCase());
        line[index] = count;
      }
    });
    if (line.length && line[0] !== '') {
      lines.push(line);
    }
  });

  lines = lines.map(function(line) {
    line = line.map(function(word, index) {
      // replace each word with line with another word of the same length
      return words[word][Math.floor(Math.random() * words[word].length)];
    });
    return line.join(' ');
  });
  titles.push(lines[0]);
  lines[0] = "## " + lines[0].split(' ').map(capitalize)  + "\n\n"
  output += lines.join('  \n') + "\n\n--------\n\n"
  index += 1;
  parsePoems(files, index);
}


fs.readdir('./corpora', function( err, files ) {
  if ( err ) {
    console.log(err);
    process.exit(1);
  }
  parsePoems(files, index);
  console.log("# " + titles[Math.floor(Math.random() * titles.length)]);
  console.log(output);
});
