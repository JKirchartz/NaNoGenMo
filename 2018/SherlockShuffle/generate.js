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
      openTimer.fail("Corpus can't be opened!");
      generateGrammar();
      return;
    }

    openTimer.succeed("Corpus read");
    var genTimer = ora("Generating text").start();

    var tracery = require('tracery-grammar');
    var grammar = tracery.createGrammar(JSON.parse(data));
    var bookText = "";
    var bookLength = 0;
    var chapters = 0;
    var chapterNumbers = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X" , "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX"];

    grammar.addModifiers(tracery.baseEngModifiers);


    while(bookLength < 50000) {
      if ( ! bookLength % 2500 ) {
        bookText += "CHAPTER " + chapterNumbers[chapters] + "\n\n\n";
        chapters++;
      }
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

function generateGrammar(callback) {
  openTimer.text = ('Reading corpus...');
  fs.readFile(corpusLocation, function(err, corpusfile) {
    if (err) {
      openTimer.fail("Can't read file");
    }
    var tracery = { 'paragraphs' : [] };
    openTimer.succeed("Corpus opened");

    corpusfile = corpusfile.toString();

    if (corpusfile.length) {
      // split into "paragraphs"
      var corpus = corpusfile.split(/[\n\r]{3,}/);
      // loop through corpus
      var tagTimer = ora("Tagging...").start();
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
            tagTimer.render();
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
                  tracery[tag].push(word);
                }
                if (tracery[tag].indexOf(word) > -1 ) {
                  tagTimer.text = "Tagging: " + word + " as " + tag;
                  // if the word is found in the tag replace every instance in the sentence.
                  var rex = new RegExp('\\b(?!#)' + RegExp.quote(word) + '(?!#)\\b', 'g');
                  tracery.paragraphs[i] = tracery.paragraphs[i].replace(rex, '#' + tag + '#');
                }
                // split sentences by punctuation
                  var sentences = tracery.paragraphs[i].split(/([\?\.\!]/g);
                  for (var k in sentences) {
                    var chars = sentences[k].split('');
                    // capitalize first word (by replacing the 2nd # with .capitalize#)
                    chars[chars.indexOf('#', chars.indexOf('#'))] = ".capitalize#";
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

      tagTimer.succeed("Grammar generated");
      var writeTimer = ora("Writing grammar to " + corpusOutputLocation).start();

      fs.writeFile(corpusOutputLocation,
        grammar,
        function (err) {
          if (err) {return console.log('everything sucks because: ', err);}

          writeTimer.succeed("Grammar Written to file.");
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

