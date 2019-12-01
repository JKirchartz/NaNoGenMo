/*
 * soundex.js
 * Copyleft (ↄ) 2019 jkirchartz <me@jkirchartz.com>
 *
 * Distributed under terms of the NPL (Necessary Public License) license.
 */

const fs = require('fs');
const nlp = require('compromise');
const util = require('wink-nlp-utils');

function parseSentence(sentence) {
  let doc = nlp(sentence);
  return docs.out('json');
}

function readFile(args) {
  let corpus = fs.readFileSync(args[2]).toString();
  var splitting = "";
  switch (args[3] || "p") {
    case "l": // line
      corpus = corpus.split(/\n+/);
      splitting = "line";
      break;
    case "p": // paragraph
      corpus = corpus.split(/\n\n+/);
      splitting = "paragraph";
      break;
    default: // sentence
      corpus = util.string.sentences(corpus.replace(/\n+/, ' ').replace(/\s+/, ' '));
      splitting = "sentence";
  }
  // parse sentences, remove one-character sentences
  return corpus.map(parseSentence).filter((s) => s.length > 1);
}

function main(args) {
  let corpus = readFile(args);
  console.log(corpus);
}

main(process.argv);
