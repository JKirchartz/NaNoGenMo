/*
 * index.js
 * Copyleft (ↄ) 2018 jkirchartz <me@jkirchartz.com>
 *
 * Distributed under terms of the NPL (Necessary Public License) license.
 */

const fs = require('fs');
const request = require('request');
const syllables = require('syllable');

// IDEAS:
// use the syllable-count corpus for all texts, to increase its vocabulary
// give credit to the original author?
// find anagram or spoonerism or something for authors names?

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
  let lines = []
  let words = {};
  // turn poem into grammar
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

  // turn grammar into poem
  lines = lines.map(function(line) {
    line = line.map(function(word, index) {
      if ( words[word] ) {
        // replace each word with line with another word of the same length
        return words[word][Math.floor(Math.random() * words[word].length)];
      }
    });
    return line.join(' ');
  });
  titles.push(lines[0]);
  // stylize the title
  lines[0] = "## " + lines[0].split(' ').map(capitalize).join(' ')  + "\n\n"
  return lines.join('  \n') + "\n\n---\n---\n\n"
}

let downloadPoem = function(titles) {
  if ( titles.length ) {
    title = titles.pop();
  } else {
    return;
  }
  request('http://poetrydb.org/title/' + encodeURIComponent(title), function(err, response, body) {
    if (err) {
      console.error(err);
    }
    try {
      body = JSON.parse(body);
    } catch (err) {
      console.error(err);
    }
    if ( body[0] && body[0].lines ) {
      console.log(parsePoem(body[0].lines));
    }
    downloadPoem(titles);
  });

};

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
