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

let titles = [];
let title_index = 0;

let capitalize = function (word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

let parsePoem = function(poem) {
  let output = "";
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
  return output;
}

let downloadPoem = function(titles) {
  if ( titles.length ) {
    title = titles.pop();
  } else {
    return;
  }
  request('http://poetrydb.org/title/' + encodeURIComponent(title), function(err, response, body) {
    body = JSON.parse(body)[0];
    console.log(parsePoem(body.lines));
    downloadPoem(titles);
  });

};

console.log("getting titles...");
request('http://poetrydb.org/title', function(err, response, body){
  if ( err ) {
    console.log(err);
    process.exit(1);
  }
  titles = shuffle(JSON.parse(body)['titles']);
  titles = titles.slice(0, 10);

  console.log("---\ntitle: " + titles[Math.floor(Math.random() * titles.length)] + "\n");
  console.log("poems:\n-", titles.join('\n-'), '\n---\n');
  downloadPoem(titles);

});
