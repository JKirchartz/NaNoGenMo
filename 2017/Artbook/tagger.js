#!/usr/bin/env node
'use strict';

const pos = require('pos');

const cheerio = require('cheerio');
const fs = require('fs');
// const MarkovGen = require('markov-generator');
// const Flickr = require('flickr-sdk');
// const gleech = require('gleech');

console.log('Generate Corpus');
// var pages = 20;
var corpus = '';
var dir = 'www.391.org/manifestos/';
var tracery = { 'origin' : []};

// get/parse texts

function freakOut (err) {
	console.error('Something went wrong: ', err);
	process.exit(1);
}


fs.readdir(dir, function (err, files) {
	if ( err ) {
		freakOut(err);
	}
	console.log('read files');
	files.forEach( function (file, index) {
		if (file.indexOf('.jpg') === -1 &&
			file.indexOf('.png') === -1 &&
			file.indexOf('.gif') === -1 &&
			file.indexOf('.swf') === -1 &&
			file.indexOf('.txt') === -1 &&
			file.indexOf('.js') === -1 &&
			file.indexOf('.pdf') === -1 &&
			file.indexOf('.') > -1
		) {
			var data = fs.readFileSync(dir + file);
			var $ = cheerio.load(data);
			var text = $('p').text().replace(/\s+/g, ' ');
			corpus += text.trim();
		}
	});
	if (corpus.length) {
		corpus = corpus.split(/[!?.]+/);
		for (var i in corpus) {
			if (corpus.hasOwnProperty(i)) {
				tracery.origin[i] = corpus[i];
				var words = new pos.Lexer().lex(corpus[i]);
				var tagger = new pos.Tagger();
				var taggedWords = tagger.tag(words);
				for (var j in taggedWords) {
					if (taggedWords.hasOwnProperty(j)) {
						var taggedWord = taggedWords[j];
						var word = taggedWord[0];
						var tag = taggedWord[1];
						if (tag && tag.indexOf('#') === -1) {
							if (! tracery[tag] ) {
								tracery[tag] = [];
							}
							tracery[tag].push(word);
							tracery.origin[i] = tracery.origin[i].replace(word, '#' + tag + '#');
						}
					}
				}
			}
		}
		fs.writeFile('corpus.txt', corpus, function (err) {
			if (err) {return console.log('everything sucks because: ', err);}
			console.log('wrote corpus to corpus.txt');
		});
		fs.writeFile('grammar.json', JSON.stringify(tracery), function (err) {
			if (err) {return console.log('everything sucks because: ', err);}
			console.log('wrote grammar to grammar.json');
		});
	}
});
