#!/usr/bin/env node
// Load wink-pos-tagger.
const fs = require('fs');
const posTagger = require( 'wink-pos-tagger' );
const winkNLP = require( 'wink-nlp' );
const util = require('util');
// Load english language model — light version.
const model = require( 'wink-eng-lite-model' );
// Instantiate winkNLP.
const nlp = winkNLP( model );
// Create an instance of the pos tagger.
const tagger = posTagger();
const rhymes = require('rhymes')

async function rhyme(text) {
   const doc = nlp.readDoc(text);
   const tokens = doc.tokens();
   const matches = tokens.out().map((e) => {
      const R = rhymes(e)
         // .filter(e => e.score >= 2)
         .map(e => e.word)
         .filter(e => text.indexOf(e) > -1);
      console.log(e, R);
      return { word: e, rhymes: R };
   });
   matches.filter(e => e.rhymes.length > 0).forEach(console.log);
}

async function phrases(text) {

   const file = JSON.parse(fs.readFileSync('./tmp/sentences.tracery.json', 'utf-8'));
   const sentence_patterns = file.sentences.map((e) => {
      const words = e.split(' ');
      for (w in words) {
         words[w].replace("^#", "[").replace("#$", "]");
      }
      return words.join(" ");
   });
   const patterns = [
      {
            name: 'phrases',
            patterns: [
               '[|THE|DET] [|ADV|ADJ] [ADJ] [|NOUN|PROPN|PRON] [|ADJ|ADV|VERB] [|VERB]',
            ]
      },
      { name: 'adverbSentences', patterns: ['[ADV]'] },
      { name: 'tracery', patterns: sentence_patterns }
   ];

   nlp.learnCustomEntities(patterns);

   const doc = nlp.readDoc( text )

   // print one per line
   doc.customEntities().out().forEach((c) => c.charAt(0) !== "\\" && c.charAt(0) !== "#" ? console.log(c) : false );

};

async function first(text) {

   const doc = nlp.readDoc( text )

   // Tag the sentence using the tag sentence api.
   let sentences = doc.sentences().out();

   // remove the first sentence
   text = text.replace(sentences.shift(), "");

   // print content, remove non-printable ascii characters
   console.log(text.replace(/[^ -~\n]+/g, " "));

};

async function tidy(text) {

   const doc = nlp.readDoc( text )

   // Tag the sentence using the tag sentence api.
   let sentences = doc.sentences().out();

   // remove the last sentence, it's usually a fragment
   text = text.replace(new RegExp(`${sentences.pop()}$`, "gm"), "");

   // print content, remove non-printable ascii characters
   console.log(text.replace(/[^ -~\n]+/g, " "));

};

// send stdin to apropriate function
switch (process.argv[2]) {
   case 'phrases':
      phrases( fs.readFileSync(0, 'utf-8') );
      break;;
   case 'tidy':
      tidy( fs.readFileSync(0, 'utf-8') );
      break;;
   case 'rhymes':
      rhymes( fs.readFileSync(0, 'utf-8') );
      break;;
   case 'first':
      first( fs.readFileSync(0, 'utf-8') );
      break;;
}
