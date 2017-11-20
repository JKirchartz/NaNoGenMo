#!/usr/bin/env node

'use strict';

const cheerio = require('cheerio');
const fs = require('fs');
const MarkovGen = require('markov-generator');
const Flickr = require('flickr-sdk');
const gleech = require('gleech');

console.log('Generate Corpus');
var pages = 20;
var corpus = [];
var dir = 'www.391.org/manifestos/';

// get/parse texts

function freakOut (err) {
	console.error('Something went wrong: ', err);
	process.exit(1);
}

function generatePage(markov) {
	console.log('Generating Page...');
	let flickr = new Flickr('7056f4a1b07b1729131ef16cab7f24c1');
	let sentence = markov.makeChain();
	sentence = sentence.split('.');
	sentence = sentence[Math.floor(sentence.length * Math.random())].trim();

	let word = sentence.trim().split(' ');
	word = word[Math.floor(Math.random() * word.length)];

	console.log('generate text: \n\n%s\n', sentence);
	if (sentence.length && word.length) {
		console.log('Fetching Image from search term "%s"...', word);
		flickr.photos.search({
			text: word.trim(),
			license: '7,9,10'
		}).then(function (res) {
			var photo = res.body.photos.photo[Math.floor(Math.random() * res.body.photos.photo.length)];
			var url = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_b.jpg';
			gleech.read(url).then( function (image) {
				console.log('Glitching Image from %s ...', url);
				image.preset(Math.floor(Math.random() * 5));
				// make a black outline
				gleech.loadFont(gleech.FONT_SANS_32_BLACK).then(function (font) {
					image.print(font, 9, 9, sentence.trim(), image.bitmap.width - 20);
					image.print(font, 9, 11, sentence.trim(), image.bitmap.width - 20);
					image.print(font, 11, 9, sentence.trim(), image.bitmap.width - 20);
					image.print(font, 11, 11, sentence.trim(), image.bitmap.width - 20);
					// around white text
					gleech.loadFont(gleech.FONT_SANS_32_WHITE).then(function (font) {
						image.print(font, 10, 10, sentence.trim(), image.bitmap.width - 20);
						console.log('writing page...');
						image.write('page_' + word.trim() + '.jpg');
						if (pages >= 0) {
							generatePage(markov);
							pages -= 1;
						}
					}).catch(function (err) {
						console.error('gleech.print error:', err);
					});
				}).catch(function (err) {
					console.error('gleech.print error:', err);
				});
			}).catch(function (err) {
				console.error('gleech.read error:', err);
			});
		}).catch(function (err) {
			console.error('flickr error:', err);
		});
	}
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
			var text = $('p').text();
			corpus.push(text);
		}
	});
	if (corpus.length) {
		console.log('building markov tree');
		let markov = new MarkovGen({
			input: corpus
		});
		generatePage(markov);
	}
});
