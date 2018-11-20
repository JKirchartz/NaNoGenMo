/*
 * index.js
 * Copyleft (ↄ) 2018 jkirchartz <me@jkirchartz.com>
 *
 * Distributed under terms of the NPL (Necessary Public License) license.
 */

let syllables = require('syllable');
let fs = require('fs');

let poem = fs.readFileSync('corpora/poem.txt').toString();
poem = poem.split('\n');
let lines = []
let words = {};
poem.forEach(function (line) {
  line = line.split(' ');
  lines.push(line);
  line.forEach(function(word, index) {
    let count = syllables(word);
    console.log(word, count);
    if ( typeof words[count] === 'undefined' ) {
      words[count] = [];
    }
    console.log(words[count]);
    words[count].push(word);
    line[index] = count;
  });
});


lines.map(function(line) {
  line = line.map(function(word, index) {
    // replace each word with line with another word of the same length
    return words[word][Math.floor(Math.random() * words[word].length)];
  });
  console.log(line.join(' '));
});
