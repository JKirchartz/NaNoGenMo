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
var bookOutputLocation = 'output/book.md';

// DO NOT EDIT BELOW THIS LINE

var pos = require('pos');
var fs = require('fs');
var ora = require('ora');
var contractions = require('expand-contractions');

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
      generateGrammar();
      return;
    }

    openTimer.text = ("Corpus read & Generating Text");

    var tracery = require('tracery-grammar');
    var grammar = tracery.createGrammar(JSON.parse(data));
    var bookText = "---\n" +
      "title: Sherlock Shuffle\n" +
      "title: Sherlock Shuffle\n" +
      "author: \"Sherlock Shuffle 3.0 by JKirchartz\"\n" +
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
      bookText += grammar.flatten('#origin#') + "\n\n";
      bookLength = bookText.split(" ").length;
      if (bookLength%100 == 0) { // update spinner every 100th word
        openTimer.render();
      }
    }

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

    openTimer.text = "Writing text to file";
    fs.writeFile(bookOutputLocation,
      bookText,
      function (err) {
        if (err) {
          openTimer.fail('everything sucks!')
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
  fs.readFile(corpusLocation, function(err, corpusfile) {
    if (err) {
      openTimer.fail("Can't read file");
    }
    var tracery = { 'paragraphs' : [] };
    openTimer.text = ("Corpus opened");

    corpusfile = corpusfile.toString();
    corpusfile = contractions.expand(corpusfile);

    if (corpusfile.length) {
      // split into "paragraphs"
      var corpus = corpusfile.split(/[\n\r]{3,}/);
      // loop through corpus
      openTimer.text = "Tagging...";
      for (var i in corpus) {
        if (corpus.hasOwnProperty(i)) {
          if ( /^\s+chapter/gi.test(corpus[i]) ) {
            // skip chapter headings
            continue;
          }
          tracery.paragraphs[i] = corpus[i];
          var words = new pos.Lexer().lex(corpus[i]);
          var tagger = new pos.Tagger();
          var taggedWords = tagger.tag(words);
          if (i%10 == 0) { // prevent spinner from freezing by reminding it to update
            openTimer.render();
          }
          // replace words in paragraph with tagged words
          for (var j in taggedWords) {
            if (taggedWords.hasOwnProperty(j)) {
              var taggedWord = taggedWords[j];
              var word = taggedWord[0];
              var tag = taggedWord[1];
              // put tagged words into arrays of what part of speech they're tagged with
              // Ignore proper nouns & verbs
              if (!/(NNP.?|VB.?)/.test(tag) && /\w+/.test(word)) {
                // if the tag doesn't have it's own array - make it
                if (! tracery[tag] ) {
                  tracery[tag] = [];
                }
                if (tracery[tag].indexOf(word) === -1 ) {
                  // if the word isn't in the tag array, put it there.
                  if (word === "I") {
                    tracery[tag].push(word);
                  } else {
                    tracery[tag].push(word.toLowerCase());
                  }
                }
                if (tracery[tag].indexOf(word) > -1 ) {
                  openTimer.text = "Tagging: " + word + " as " + tag;
                  // if the word is found in the tag replace every instance in the sentence.
                  var rex = new RegExp('\\b(?!#)' + RegExp.quote(word) + '(?!#)\\b', 'g');
                  tracery.paragraphs[i] = tracery.paragraphs[i].replace(rex, '#' + tag + '#');
                }
                // split sentences by punctuation
                  var sentences = tracery.paragraphs[i].split(new RegExp('[?\.!]', 'g'));
                  for (var k in sentences) {
                    var chars = sentences[k].split('');
                    // capitalize first word (by replacing the 2nd # with .capitalize#)
                    chars[chars.indexOf('#', chars.indexOf('#') + 1)] = ".capitalize#";
                    sentences[k] = chars.join('');
                  }
              }
            }
          }
        }
      }


      // remove blanks & duplicates
      tracery.paragraphs = tracery.paragraphs.filter(function(e, i, self) {
        return e !== "" && i === self.indexOf(e);
      });

      // create an "origin"
      tracery.origin = ['#paragraphs#'];

      // prettify output
      var grammar = JSON.stringify(tracery).replace(new RegExp('","', 'g'), '",\n    "').replace(new RegExp('],"', 'g'),'],\n"');

      openTimer.text = ("Grammar generated");
      openTimer.text = "Writing grammar to " + corpusOutputLocation;

      fs.writeFile(corpusOutputLocation,
        grammar,
        function (err) {
          if (err) {return console.error('everything sucks because: ', err);}

          openTimer.text = ("Grammar Written to file.");
          callback();
        });
    }
  });

}




if( fs.existsSync(corpusOutputLocation) ) {
  generateBook();
} else {
  generateGrammar(generateBook);
}

