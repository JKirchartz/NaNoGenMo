// Load wink-pos-tagger.
const fs = require('fs');
const posTagger = require( 'wink-pos-tagger' );
const winkNLP = require( 'wink-nlp' );
const util = require('util');
const exec = util.promisify(require('child_process').execFileSync);
const execute = (command, callback) => exec(command, (err, stdout, stderr) => { callback(stdout); });
// Load english language model — light version.
const model = require( 'wink-eng-lite-model' );
// Instantiate winkNLP.
const nlp = winkNLP( model );
// Create an instance of the pos tagger.
const tagger = posTagger();

async function finder(text) {

   const doc = nlp.readDoc( text )

   // Tag the sentence using the tag sentence api.
   let sentences = [];
   doc.sentences().each(( sentence ) => {
      const tags = tagger.tagSentence( sentence.out() );
      // find continual adjective/noun/noun-phrase chain(s?)
      const filter = ['JJ', 'JJR', 'JJS', 'NN', 'NNP', 'NNS', 'NNPS', 'PRP'];
      const phrase = tags.filter((el, i, arr) => {
         if (filter.includes(el.pos)) {
            if ( (arr[i-1] && filter.includes(arr[i-1].pos)) ||
                 (arr[i+1] && filter.includes(arr[i+1].pos))) {
               return true;
            }
         }
         return false;
      });
      sentences.push({ sentence: sentence.out(), phrase, tags } );
   });

   // find phrases, convert them back to strings
   const choices = (sentences.filter((el) => el.phrase.length)).map((el) => el.phrase.map((el) => el.value).join(' '));

   // print one per line
   choices.forEach((c) => console.log(c));

};

// send stdin to main function
finder( fs.readFileSync(0, 'utf-8') );
