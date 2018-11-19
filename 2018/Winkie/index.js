/*
 * index.js
 * Copyleft (ↄ) 2018 jkirchartz <me@jkirchartz.com>
 *
 * Distributed under terms of the NPL (Necessary Public License) license.
 */

const fs = require('fs');
const util = require('wink-nlp-utils');
const pos = require('wink-pos-tagger');
const contractions = require('expand-contractions');
const tracery = require('tracery-grammar');
const tagger = pos();

// regex helper to escape strings
RegExp.quote = function(str) {
  return (str+'').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
};

// generate tracery from POS
let traceryOutput = { };
const parseSentence = (str, index) => {
  // clean up sentence
  str = str.replace(/[\r\n\s]+/g, ' ');
  str = str.replace(/--/g, '-');
  str = contractions.expand(str);
  // tag sentence
  let taggedSentence = tagger.tagSentence(str);
  // fix peculiarity of wink-pos-tagger tagging sentences as NNP
  let scragglers = [];
  taggedSentence.filter((obj, index) => {
    if (obj.pos.slice(0,3) === "NPP" &&
       (obj.value.indexOf(" ") > -1 || obj.value.indexOf("\"") > -1)) {
      scragglers.push(tagger.tagSentence(obj.value));
      return false;
    }
    return true;
  });
  taggedSentence = taggedSentence.concat(scragglers);
  // munge sentences to create tracery
  taggedSentence = taggedSentence.filter(tagifySentence);
  return tidySentences(taggedSentence);
};

const tidySentences = (arr) => {
  // reduce array of objects to one object and return it's value
  return arr.reduce((a, b) => {
    // apply proper spacing, being mindful of punctuation
    if ( a.value === "#\"#" || b.tag === "punctuation" || b.pos === "POS" ) {
      return { value : a.value + "" + b.value };
    } else {
      return { value : a.value + " " + b.value };
    }
  }).value;
};

let was_a_or_an = false;
const tagifySentence = (obj, i, arr) => {
  let key = obj.pos === "." ? "ending" : obj.pos;
  let word = obj.normal;
  if ( ! traceryOutput[key] ) {
    traceryOutput[key] = [];
  }
  if (obj.lemma) {
    if ((obj.normal.slice(-2) === 'ed' && obj.lemma.slice(-2) !== 'ed') ||
      (obj.normal.slice(-3) === 'ing' && obj.lemma.slice(-3) !== 'ing')) {
      word = obj.lemma
    }
  }
  if ( traceryOutput[key].indexOf(word) === -1  && (word !== "a" || word !=="an")) {
    traceryOutput[key].push(word);
  }
  if (traceryOutput[key].indexOf(word) > -1 ) {
    obj.value = '#' + key + '#';
    if((i === 0 && obj.pos !== "\"") ||
      (i >= 1 && arr[i-1].pos === "\"")) {
      //capitalize first letter in a sentence
      obj.value = '#' + key + '.capitalize#';
    } else if (obj.pos.slice(0,3) === "NNP") {
      // capitalize all proper nouns
      obj.value = '#' + key + '.capitalizeAll#';
    }
    if (obj.lemma && obj.normal.slice(-2) === 'ed' && obj.lemma.slice(-2) !== 'ed') {
      // preserve "-ed" words
      obj.value = '#' + key + '.ed#';
    }
    if (obj.lemma && obj.normal.slice(-3) === 'ing' && obj.lemma.slice(-3) !== 'ing') {
      // preserve "-ing" words
      obj.value = '#' + key + '.ing#';
    }
    if (was_a_or_an) {
      // ensure correct "A" or "An" is used
      obj.value = '#' + key + '.a#';
    }
  }
  // don't save one-letter non-words
  if (obj.value.length === 1 &&
      (word !== "a" || word !=="o" || word !== "i")) {
      return false;
    }
  if (word === "a" || word === "an") {
    was_a_or_an = true;
    return false;
  } else {
    was_a_or_an = false;
  }
  return obj;
};

const parseCorpus = () => {
  fs.readFile('corpora/complete.corpus', (err, data) => {
    if (err) {
      console.err("Can't read file", err);
      process.exit(2);
    }
    let corpus = data.toString();
    corpus = corpus.split("\n\n");
    corpus.forEach((para, index) => {
      if(para.match(/"/g).length % 2 == 1 && (para.slice(1) === "\"" && para.slice(-1) !== "\"")){
        para = para + "\"";
      }
    });
    // get sentences
    let sentences = util.string.sentences(corpus.join("\n\n"));
    sentences = sentences.map(parseSentence);
    traceryOutput['sentences'] = sentences;

    fs.writeFile('corpora/corpus.json', JSON.stringify(traceryOutput, null, 2), (err) => {
      if (err) {return console.err('error: ', err);}
      console.log('JSON written');
    });
    writeBook(traceryOutput);
  });
};

const writeBook = (traceryOutput) => {
  traceryOutput = !!traceryOutput ? traceryOutput : fs.readFileSync('corpora/corpus.json');

  let grammar = tracery.createGrammar(traceryOutput);
  grammar.addModifiers(tracery.baseEngModifiers);
  grammar.addModifiers({
    ing: (str) => {
      // -inger -- won't properly double-letters with emphasis on ending consonant-vowel-consonant (e.g. will output "runing" instead of "running")
      if ( str.slice(-2) === 'ie') {
        str = str.slice(-2) + "ing";
      } else if ( str.slice(-1) === 'e') {
        str = str.slice(-1) + "ing";
      } else {
        str = str + "ing";
      }
      return str;
    }
  });
  let bookText = "";
  let bookLength = 0;
  while(bookLength < 50000) {
    bookText += grammar.flatten('#sentences#') + "\n";
    // add in random paragraph breaks
    if (Math.round(Math.random() * 100) < 10 ) {
      bookText += "\n\n";
    }
    bookLength = bookText.split(" ").length;
  }
  // determine filename for book
  let bookOutputLocation = 'output/book.txt';
  while (fs.existsSync(bookOutputLocation)) {
    if ( /\d+/.test(bookOutputLocation) ) {
      let bookNum = bookOutputLocation.match(/\d+/)[0];
      bookOutputLocation = bookOutputLocation.split(bookNum);
      bookNum = parseInt(bookNum, 10) + 1;
      bookOutputLocation = bookOutputLocation[0] + (bookNum) + ".txt";
    } else {
      bookOutputLocation = bookOutputLocation.split('.');
      bookOutputLocation = bookOutputLocation[0] + "_1.txt";
    }
  }
  // write book
  fs.writeFile(bookOutputLocation, bookText, (err) => {
    if (err) {return console.err('error: ', err);}
    console.log('Book written');
  });
};

// read corpus & write grammar
if (fs.existsSync('corpora/corpus.json')) {
  writeBook();
} else {
  parseCorpus();
}

