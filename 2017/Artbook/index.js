#!/usr/bin/env node

'use strict';

const fs = require('fs');
const MarkovGen = require('markov-chain-generator');
const Flickr = require('flickr-sdk');
const gleech = require('gleech');
const tracery = require('tracery-grammar');

var pages = 10;
var corpus = [];
let flickr = new Flickr('7056f4a1b07b1729131ef16cab7f24c1');
var corpus = fs.readFileSync('corpus.txt').toString();
let markov = new MarkovGen(corpus);
var grammar = fs.readFileSync('grammar.json');
grammar = tracery.createGrammar(JSON.parse(grammar));
var html = '<!doctype html><link rel="stylesheet" href="style.css" />';

function generateText() {
	var sentence = '';
	if (Math.random() > 0.5) {
		console.log('generating markov sentence...');
		sentence = markov.generate(null, 100);
		sentence = sentence.split('.');
		sentence = sentence[Math.floor(sentence.length * Math.random())].trim() + '.';
	} else {
		console.log('generating tracery sentence...');
		sentence = grammar.flatten('#origin#');
	}
	return sentence;
}

function generatePage() {
	console.log('Generating Page...');
	function freakOut (err) {
		console.error('Fate decided that page sucked because:', err);
		generatePage();
	}

  // put a page of text between each page with a picture
	html += '<figure><div class="content">' + generateText() + ' ' + generateText() + '</div></figure>';

	let sentence = generateText();
	let word = sentence.trim().split(' ');
	word = word[Math.floor(Math.random() * word.length)];

	console.log('generated text: \n\n%s\n', sentence);
	if (sentence.length && word.length) {
		console.log('Fetching Image from search term "%s"...', word);
		flickr.photos.search({
			text: word.trim(),
			license: '7,9,10'
		}).then(function (res) {
			var photo = res.body.photos.photo[Math.floor(Math.random() * res.body.photos.photo.length)];
			var url = 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_b.jpg';
			var source = 'https://www.flickr.com/' + photo.owner + '/' + photo.id;
			console.log('Glitching Image from %s ...', url);
			console.log(photo);
			gleech.read(url).then( function (image) {
				switch (Math.floor(Math.random() * 3)) {
					case 0:
						image.randomGlitch();
						break;
					case 1:
						image.glitch();
						break;
					default:
						image.preset(Math.floor(Math.random() * 5));
						break;
				}
				// make a black outline
				gleech.loadFont(gleech.FONT_SANS_32_BLACK).then(function (font) {
					image.print(font, 8, 8, sentence.trim(), image.bitmap.width - 20);
					image.print(font, 8, 10, sentence.trim(), image.bitmap.width - 20);
					image.print(font, 8, 12, sentence.trim(), image.bitmap.width - 20);
					image.print(font, 10, 8, sentence.trim(), image.bitmap.width - 20);
					image.print(font, 12, 8, sentence.trim(), image.bitmap.width - 20);
					image.print(font, 12, 10, sentence.trim(), image.bitmap.width - 20);
					image.print(font, 12, 12, sentence.trim(), image.bitmap.width - 20);
					// around white text
					gleech.loadFont(gleech.FONT_SANS_32_WHITE).then(function (font) {
						image.print(font, 10, 10, sentence.trim(), image.bitmap.width - 20);
						console.log('writing page...');
						var filename = 'page_' + pages + '.jpg';
						html += '<figure><img src="' + filename + '" ><div class="contents"><p>' + sentence + '</p><cite><a href="' + source + '">origin image: ' + source + '</a></figure></div>';
						image.write(filename);
						if (pages >= 0) {
							pages -= 1;
							generatePage();
						}
					}).catch(freakOut);
				}).catch(freakOut);
			}).catch(freakOut);
		}).catch(freakOut);
	}
	fs.writeFile('index.html', html, 'utf8');
}


generatePage();
