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

async function phrases(text) {

   const patterns = [
     {
            name: 'phrases',
            patterns: [ '[|DET] [|ADV|ADJ] [ADJ] [|NOUN|PROPN|PRON] [NOUN|PROPN|PRON] [|ADJ|ADV|VERB] [|VERB]' ]
      }
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
   case 'first':
      first( fs.readFileSync(0, 'utf-8') );
      break;;
}
