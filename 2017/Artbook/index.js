#!/usr/bin/env node

'use strict';

const cheerio = require('cheerio');
// const gleech = require('gleech');
const fs = require('fs');
const MarkovGen = require('markov-generator');

console.log('Generate Corpus');
var corpus = [];
var dir = './www.391.org/manifestos/';

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
				file.indexOf('.pdf') === -1
			 ) {
			console.log('reading: ', file);
			fs.readFile(dir + file, function (err, data) {
				if (err) {
					console.error('this happened: ', err);
					return;
				}
				var text = cheerio.load(data);
				text = text.text();
				console.log(text);
				corpus.push(text);
			});
		}
	});
	if (corpus) {
		let markov = new MarkovGen({
			input: corpus,
			minLength: 10
		});
		let sentence = markov.makeChain();
		console.log(sentence);
	}
});
