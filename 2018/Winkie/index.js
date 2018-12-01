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

let file = fs.readdirSync('corpora').filter((f) => f.indexOf('.txt') > -1);
file = file[Math.floor(Math.random() * file.length)];

// regex helper to escape strings
RegExp.quote = function(str) {
  return (str+'').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
};

const shuffle = function (a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

const filename = (str) => {
  if (!str){ return file.replace('.txt', ''); }
  return str.replace(/[^a-z0-9]/gi, '');
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
  taggedSentence = taggedSentence.filter((obj, index) => {
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

let keepNextLine = false;
const extractChapters = (sentence) => {
  sentence = sentence.replace(/\n/, '');
  if ( sentence == '') {
    return false;
  } else if (keepNextLine) {
    keepNextLine = false;
    return true;
  } else {
    if ( RegExp('^[0-9]', 'gi').test(sentence)  && sentence.split(' ').length < 10) {
      return true;
    }
    if (RegExp('^chapter', 'gi').test(sentence) ) {
      keepNextLine = true;
      return false;
    }
  }
  keepNextLine = false;
  return false;
};

const parseCorpus = (file) => {
  // get contents of book
  fs.readFile('corpora/' + file, (err, data) => {
    if (err) {
      console.error("Can't read file", err);
      process.exit(2);
    }
    let corpus = data.toString();
    // tidy newlines
    corpus = corpus.replace(/\r\n/g, '\n');

    // get chapters
    let chapters = corpus.split('\n').filter(extractChapters);
    chapters = chapters.map((str) => str.replace(/\d+\./g, '').trim());
    traceryOutput['chapters'] = chapters;

    // try to fix quotes missing the endquote
    corpus = corpus.split(/\n\n+/);
    corpus.forEach((para, index) => {
      let match = para.match(/"/g);
        if(match && match.length % 2 == 1 && (para.slice(1) === "\"" && para.slice(-1) !== "\"")){
          para = para + "\"";
        }
    });

    // get sentences
    let sentences = util.string.sentences(corpus.join("\n\n"));
    delete chapters;
    sentences = sentences.map(parseSentence);
    traceryOutput['sentences'] = sentences;
    delete sentences;

    fs.writeFile('corpora/' + file.replace('.txt', '.json'), JSON.stringify(traceryOutput, null, 2), (err) => {
      if (err) {return console.err('error: ', err);}
      console.error('JSON written');
    });
    writeBook(traceryOutput);
  });
};

const writeBook = (traceryOutput) => {
  let file = null;
  if (typeof traceyOutput === "string") {
    file = traceryOutput;
    traceryOutput = null;
  }
  traceryOutput = !!traceryOutput ? traceryOutput : fs.readFileSync('corpora/' + file.replace('.txt', '.json'));

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
  let chapters = shuffle(traceryOutput.chapters);
  let title = chapters[Math.floor(Math.random() * chapters.length)] || null;
  let chapterIndex = Math.abs(50000 / chapters.length);
  let chI = 0;
  while(bookLength < 50000) {
    if ( chapters.length && bookLength >= chI) {
      bookText += "\n\\hfill\n\\pagebreak\n\n## " + chapters.pop() + "\n\n"
      chI += chapterIndex;
    }
    bookText += grammar.flatten('#sentences#') + "\n";
    // add in random paragraph breaks ~30% of the time
    if (Math.round(Math.random() * 100) < 30 ) {
      bookText += "\n\n";
    }
    bookLength = bookText.split(" ").length;
  }
  // determine filename for book
  let bookOutputLocation = 'output/' + filename(title) + '.md';
  while (fs.existsSync(bookOutputLocation)) {
    if ( /\d+/.test(bookOutputLocation) ) {
      let bookNum = bookOutputLocation.match(/\d+/)[0];
      bookOutputLocation = bookOutputLocation.split(bookNum);
      bookNum = parseInt(bookNum, 10) + 1;
      bookOutputLocation = bookOutputLocation[0] + (bookNum) + ".md";
    } else {
      bookOutputLocation = bookOutputLocation.split('.');
      bookOutputLocation = bookOutputLocation[0] + "_1.md";
    }
  }
  bookText = "---\n" +
    "title: '" + title + "'\n" +
    'documentclass: "book"\n' +
    'author: "JKirchartz\'s Winkie"\n' +
    "---\n\n" +
    bookText;
  // write book
  fs.writeFile(bookOutputLocation, bookText, (err) => {
    if (err) {return console.err('error: ', err);}
    console.log(bookOutputLocation);
  });
};

console.error('reading: ' + file);
// read corpus & write grammar
if (fs.existsSync(file.replace('.txt', '.json'))) {
  writeBook(file);
} else {
  parseCorpus(file);
}

