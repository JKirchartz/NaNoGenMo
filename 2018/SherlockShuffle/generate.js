/*
 * generate.js
 *
 * Copyleft 2018 kirch <kirch@arp>
 *
 * Distributed under the terms of the NPL (Necessary Public License) license.
 *
 */

'use strict';

var corpusLocation = 'corpora/complete.corpus';
var corpusOutputLocation = 'output/corpus.json';
var bookOutputLocation = 'output/book.txt';

// DO NOT EDIT BELOW THIS LINE

var pos = require('pos');
var fs = require('fs');
var ora = require('ora');

var openTimer = ora('Checking corpus').start();

// regex helper to escape strings
RegExp.quote = function(str) {
  return (str+'').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
};

function generateBook() {

  openTimer.text = ("corpus/grammar exists, lets try to write a book!");


  fs.readFile(corpusOutputLocation, function( err, data) {
    if (err) {
      openTimer.succeed("Corpus can't be opened!");
      console.log(err);
      return;
    }

    openTimer.succeed("Corpus read");
    var genTimer = ora("Generating text").start();

    var tracery = require('tracery-grammar');
    var grammar = tracery.createGrammar(JSON.parse(data));
    var bookText = "";
    var bookLength = 0;

    grammar.addModifiers(tracery.baseEngModifiers);


    while(bookLength < 50000) {
      // stich paragraphs back into a 50,000 word book
      bookText += grammar.flatten('#origin#') + "\n\n";
      bookLength = bookText.split(" ").length;
      if (bookLength%100 == 0) { // update spinner every 100th word
        genTimer.render();
      }
    }

    while (fs.existsSync(bookOutputLocation)) {
      if ( /\d+/.test(bookOutputLocation) ) {
        var bookNum = bookOutputLocation.match(/\d+/)[0];
        bookOutputLocation = bookOutputLocation.split(bookNum);
        bookNum = parseInt(bookNum, 10) + 1;
        bookOutputLocation = bookOutputLocation[0] + (bookNum) + ".txt";
      } else {
        bookOutputLocation = bookOutputLocation.split('.');
        bookOutputLocation = bookOutputLocation[0] + "_1.txt";
      }
    }

    genTimer.text = "Writing text to file";
    fs.writeFile(bookOutputLocation,
      bookText,
      function (err) {
        if (err) {
          genTimer.fail('everything sucks!')
          console.err(err);
          return;
        }

        genTimer.succeed("Book Written to " + bookOutputLocation);
        process.exit(0);
      });

  });
}

function generateGrammar() {
  openTimer.text = ('Reading corpus...');
  fs.readFile(corpusLocation, function(err, corpusfile) {
    if (err) {
      openTimer.fail("Can't read file");
    }
    var tracery = { 'paragraphs' : []};
    openTimer.succeed("Corpus opened");

    corpusfile = corpusfile.toString();

    if (corpusfile.length) {
      // split into "paragraphs"
      var corpus = corpusfile.split(/[\n\r]{3,}/);
      // loop through corpus
      var tagTimer = ora("Tagging...").start();
      for (var i in corpus) {
        if (corpus.hasOwnProperty(i)) {
          tracery.paragraphs[i] = corpus[i];
          var words = new pos.Lexer().lex(corpus[i]);
          var tagger = new pos.Tagger();
          var taggedWords = tagger.tag(words);
          if (i%10 == 0) { // update spinner every 10th iteration
            tagTimer.render();
          }
          // replace words in paragraph with tagged words
          for (var j in taggedWords) {
            if (taggedWords.hasOwnProperty(j)) {
              var taggedWord = taggedWords[j];
              var word = taggedWord[0];
              var tag = taggedWord[1];
              // put tagged words into arrays of what part of speech they're tagged with
              if (tag && /\w+/.test(word)) {
                if (! tracery[tag] ) {
                  tracery[tag] = [];
                }
                if (tracery[tag].indexOf(word) === -1 ) {
                  tracery[tag].push(word);
                  var rex = new RegExp('(?!#)' + RegExp.quote(word) + '(?!#)');
                  tracery.paragraphs[i] = tracery.paragraphs[i].replace(rex, '#' + tag + '#');
                }
              }
            }
          }
        }
      }
      tagTimer.succeed("Tagged");


      // remove blanks & duplicates
      tracery.paragraphs = tracery.paragraphs.filter(function(e, i, self) {
        return e !== "" && i === self.indexOf(e);
      });

      // create an "origin"
      tracery.origin = ['#paragraphs#'];

      // prettify output
      var grammar = JSON.stringify(tracery).replace(new RegExp('","', 'g'), '",\n    "').replace(new RegExp('],"', 'g'),'],\n"');

      var writeTimer = ora("Writing grammar to" + corpusOutputLocation).start();

      fs.writeFile(corpusOutputLocation,
        grammar,
        function (err) {
          if (err) {return console.log('everything sucks because: ', err);}

          writeTimer.succeed("Grammar Written");
          generateBook();
        });
    }
  });

}




// TODO: for some reason this fails, IDK why!?
if( fs.existsSync(corpusOutputLocation) ) {
  generateBook();
} else {
  generateGrammar();

}

