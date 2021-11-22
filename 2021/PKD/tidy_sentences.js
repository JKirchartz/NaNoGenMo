// Load wink-pos-tagger.
const fs = require('fs');
const winkNLP = require( 'wink-nlp' );
// Load english language model — light version.
const model = require( 'wink-eng-lite-model' );
// Instantiate winkNLP.
const nlp = winkNLP( model );

async function tidy(text) {

   const doc = nlp.readDoc( text )

   // Tag the sentence using the tag sentence api.
   let sentences = doc.sentences().out();

   // remove the first and last sentences
   sentences.shift();
   sentences.pop();

   // print one per line, remove non-printable ascii characters
   sentences.forEach((s) => console.log(s.replace(/[^ -~]+/g, " ")));

};

// send stdin to main function
tidy( fs.readFileSync(0, 'utf-8') );
