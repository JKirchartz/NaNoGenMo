/*
 * index.js
 * Copyleft (ↄ) 2018 jkirchartz <me@jkirchartz.com>
 *
 * Distributed under terms of the NPL (Necessary Public License) license.
 */

const fs = require('fs');
const request = require('request');
const syllables = require('syllable');
const timer = require('ora')('Finding poems').start();

// IDEAS:
// use the syllable-count corpus for all texts, to increase its vocabulary
// give credit to the original author?
// find anagram or spoonerism or something for authors names?

const poems = [];

let capitalize = function (word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

let capitalizeAll = function (words) {
  return words.split(' ').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

let filename = function(title) {
  return title.replace(/[^a-z0-9]+/gi, '');
};

let shuffle = function (a) {
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
  // generate grammar from syllable count, and reconstruct poem with similar meter
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
    if (line.length) {
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
  return lines;
};
let alphabetizePoem = function(poem) {
  // alphabetically sort all words in the poem, keep word-count the same per line
  let lines = []
  let words = [];
  // turn poem into grammar
  poem.forEach(function (line) {
    line = line.split(' ');
    lines.push(line.length);
    words = words.concat(line);
  });

  words.sort((a, b) => {
    a = a.replace(/[^a-z0-9]/gi, '');
    b = b.replace(/[^a-z0-9]/gi, '');
    if (a === '' || b === '') {
      return 0;
    }
    return a.localeCompare(b);
  });

  // turn grammar into poem
  lines = lines.map(function(line) {
    var text = "";
    while ( line ) {
      text += words.shift() + ' ';
      line -= 1;
    }
    return text;
  });
  return lines;
};

let getPoem = function(titles) {
  let title = "";
  if ( titles.length ) {
    title = titles.pop();
  } else {
    printBook();
    return;
  }
  timer.text = "Fetching " + title;
  timer.render();
  request('http://poetrydb.org/title/' + encodeURIComponent(title) + '/author,lines' , function(err, response, body) {
    if (err) {
      timer.fail('Failed');
      console.log(err);
    }
    try {
      body = JSON.parse(body);
    } catch (err) {
      timer.fail('Failed');
      console.log(err);
    }
    if ( body[0] && body[0].lines ) {
      let poem = Math.floor(Math.random() * 100) > 25 ?  parsePoem(body[0].lines) : alphabetizePoem(body[0].lines);
      poems.push({
        "author": body[0].author,
        "title": capitalizeAll(poem[0]),
        "originally": title,
        "poem": poem
      });
    }
    getPoem(titles);
  });

};

let printBook = function() {
  timer.text = "Composing Book..."
  timer.render();
  let output = ('---\n');
  let titles = [];
  for (var i in poems) {
    titles.push(poems[i].title);
  }
  let title = titles[Math.floor(Math.random() * titles.length)];

  output += ('title: \'' + title + '\'\npoems:\n');
  output += ("  - \'" + titles.join('\'\n  - \'') + '\'\n---\n\n');
  for (var i in poems) {
    let lines = poems[i].poem;
    output += "## " + lines[0].split(' ').map(capitalize).join(' ')  + "\n\n";
    output += ("    " + lines.join('\n    ') + "\n\n");
    output += ("\n\n(generated from \"" + poems[i].originally + "\" by " + poems[i].author + ")\n\n");
    output += ("\\pagebreak\n\n");
  }

  let bookOutputLocation = "output/" + filename(title)  + ".md";
  while (fs.existsSync(bookOutputLocation)) {
    if ( /\d+/.test(bookOutputLocation) ) {
      var bookNum = bookOutputLocation.match(/\d+/)[0];
      bookOutputLocation = bookOutputLocation.split(bookNum);
      bookNum = parseInt(bookNum, 10) + 1;
      bookOutputLocation = bookOutputLocation[0] + (bookNum) + ".md";
    } else {
      bookOutputLocation = bookOutputLocation.split('.');
      bookOutputLocation = bookOutputLocation[0] + "_1.md";
    }
  }
  fs.writeFile(bookOutputLocation,
    output,
    function (err) {
      if (err) {
        timer.fail('Failed');
        console.err(err);
        process.exit(1);
      }
      timer.succeed('Book written to: ' + bookOutputLocation);
      process.exit(0);
    });
};

request('http://poetrydb.org/title', function(err, response, body){
  if ( err ) {
    timer.fail('Failed');
    console.log(err);
    process.exit(1);
  }
  let titles = shuffle(JSON.parse(body)['titles']);
  timer.text = "Fetching 10 poems...";
  timer.render();
  getPoem(titles.slice(0,10));

});
