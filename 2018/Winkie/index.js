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
  // add sentence to grammar
  taggedSentence = taggedSentence.filter(tagifySentence);
  return tagsToSentence(taggedSentence);
};

const tagsToSentence = (arr) => {
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
    //capitalize first letter in a sentence
    if((i === 0 && obj.pos !== "\"") ||
      (i >= 1 && arr[i-1].pos === "\"")) {
      obj.value = '#' + key + '.capitalize#';
      // preserve "-ed" words
    } else if (obj.lemma && obj.normal.slice(-2) === 'ed' && obj.lemma.slice(-2) !== 'ed') {
      obj.value = '#' + key + '.ed#';
      // preserve "-ing" words
    } else if (obj.lemma && obj.normal.slice(-3) === 'ing' && obj.lemma.slice(-3) !== 'ing') {
      obj.value = '#' + key + '.ing#';
    } else if (was_a_or_an) {
      obj.value = '#' + key + '.a#';
    } else {
      obj.value = '#' + key + '#';
    }
  }
  if (word === "a" || word === "an") {
    was_a_or_an = true;
    return false;
  } else {
    was_a_or_an = false;
  }
  return obj;
};

// read corpus & write grammar
fs.readFile('corpus.txt', (err, data) => {
  if (err) {
    console.err("Can't read file", err);
    process.exit(2);
  }
  // get sentences
  let sentences = util.string.sentences(data.toString());
  sentences = sentences.map(parseSentence);
  traceryOutput['sentences'] = sentences;

  fs.writeFile('taggedSentences.json', JSON.stringify(traceryOutput, null, 2), (err) => {
    if (err) {return console.err('error: ', err);}
    console.log('JSON written');
  });

  let grammar = tracery.createGrammar(traceryOutput);
  console.log(tracery.baseEngModifiers);
  grammar.addModifiers(tracery.baseEngModifiers);
  grammar.addModifiers({ing: (str) => {
    if ( str.slice(-2) === 'ie') {
      str = str.slice(-2) + "ing";
    } else if ( str.slice(-1) === 'e') {
      str = str.slice(-1) + "ing";
    } else {
      str = str + "ing";
    }
  }});
  let bookText = "";
  let bookLength = 0;
  while(bookLength < 50000) {
    bookText += grammar.flatten('#sentences#') + "\n";
    bookLength = bookText.split(" ").length;
  }
  fs.writeFile('book.txt', bookText, (err) => {
    if (err) {return console.err('error: ', err);}
    console.log('Book written');
  });
});
