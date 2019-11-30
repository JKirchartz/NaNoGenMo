/*
 * generate.js
 *
 * Copyleft 2018 kirch <kirch@arp>
 *
 * Distributed under the terms of the NPL (Necessary Public License) license.
 *
 */

'use strict';

var corpusALocation = 'corpora/11-0.txt';
var corpusBLocation = 'corpora/pg26732.txt';
var corpusOutputLocation = 'sources/corpus.json';
var bookOutputLocation = 'output/'+ process.argv[2] +'/book.md';

// DO NOT EDIT BELOW THIS LINE ... unless you want to, I'm a comment not a cop.

// var pos = require('pos');
var fs = require('fs');
var ora = require('ora');
// var contractions = require('expand-contractions');

var tracery = require('tracery-grammar');
var p2t = require('/home/kirch/projects/pos2tracery');

var openTimer = ora('Checking corpus').start();

// regex helper to escape strings
RegExp.quote = function(str) {
  return (str+'').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
};

function generateBook() {

  openTimer.text = ("corpus/grammar exists, lets try to write a book!");


  fs.readFile(corpusOutputLocation, function( err, data) {
    if (err) {
      openTimer.fail("Corpus can't be opened!");
      return;
    }

    openTimer.text = ("Corpus read & Generating Text");

    var grammar = tracery.createGrammar(JSON.parse(data));
    var bookText = "---\n" +
      "title: Sinclair Lewis Carrol\n" +
      "title: Sinclair Lewis Carrol\n" +
      "author: \"Sherlock Shuffle 4.0 by JKirchartz\"\n" +
      "---\n\n";
    var bookLength = 0;
    var chapters = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X" , "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];

    grammar.addModifiers(tracery.baseEngModifiers);

    chapters.splice(chapters.length - Math.floor(Math.random() * 10));
    var ch = Math.abs(50000 / chapters.length);
    var chCounter = 0;


    for (var bookLength = 0; bookLength < 50000; ) {
      if ( chapters.length && bookLength >= chCounter) {
        bookText += "\n\\hfill\n\\pagebreak\n\n";
        bookText += "## CHAPTER " + chapters.shift() + "\n\n\n";
        chCounter += ch;
      }
      // stich paragraphs back into a 50,000 word book
      bookText += grammar.flatten('#origin.capitalize#') + "\n\n";
      bookLength = bookText.split(" ").length;
      if (bookLength%100 == 0) { // update spinner every 100th word
        openTimer.render();
      }
    }

    //   if ( /\d+/.test(bookOutputLocation) ) {
    //     var bookNum = bookOutputLocation.match(/\d+/)[0];
    //     bookOutputLocation = bookOutputLocation.split(bookNum);
    //     bookNum = parseInt(bookNum, 10) + 1;
    //     bookOutputLocation = bookOutputLocation[0] + (bookNum) + ".md";
    //   } else {
    //     bookOutputLocation = bookOutputLocation.split('.');
    //     bookOutputLocation = bookOutputLocation[0] + "_1.md";
    //   }
    // }

    openTimer.text = "Writing text to file";
    fs.writeFile(bookOutputLocation,
      bookText,
      function (err) {
        if (err) {
          openTimer.fail('uh-oh!')
          console.error(err);
          return;
        }

        openTimer.succeed("Book Written to " + bookOutputLocation);
        process.stdout.write(bookOutputLocation);
        process.exit(0);
      });

  });
}

function generateGrammar(callback) {
  openTimer.text = ('Reading corpus...');
  let corpusA = p2t.pos2tracery({ input: corpusALocation, percent: 75, modifiers:true, origin: true, split: 'p'});
  let corpusB = p2t.pos2tracery({ input: corpusBLocation, percent: 75, modifiers:true, origin: true, split: 'p'});
  let merged = p2t.merge({
    inputA: p2t.del({
              input: corpusA,
              toss: ["sentences", "NN", "NNP"]
            }),
    inputB: p2t.del({
              input: corpusB,
              keep: ["sentences", "NN", "NNP"]
            }),
    output: corpusOutputLocation
  });
  generateBook();
}




if( fs.existsSync(corpusOutputLocation) ) {
  generateBook();
} else {
  generateGrammar(generateBook);
}

