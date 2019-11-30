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
  doc.contractions().expand();
  // grab people-specific nouns
  let people = doc.people();
  // grab all nouns
  let topics = doc.topics()
  // grab all titlecased words
  let capitals = doc.clauses().match('#TitleCase+')
  let output = {
    sentence: doc.out('json'),
    topics: topics.out('array'),
    people: people.out('array'),
    capitals: capitals.out('array'),
    doc: doc.out('array')
  }
  console.log(output);
  return output;
}

function readFile(args) {
  let corpus = fs.readFileSync(args[2]).toString();
  var splitting = "";
  switch (args[3] || "p") {
    case "none": // line
      corpus = [corpus];
      splitting = "none";
      break;
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

function askForTag(data) {
  // Prompt user to input data in console.
  console.log(data);
  console.log("");
  console.log("");
  return data;
}

function main(args) {
  let corpus = readFile(args);
  console.log(corpus);
}

main(process.argv);
