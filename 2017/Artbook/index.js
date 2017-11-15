#!/usr/bin/env node

'use strict';

const request = require('request')
.defaults({ headers: {'User-agent':
	'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML,' +
			' like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19'}});
const cheerio = require('cheerio');
// const gleech = require('gleech');
const fs = require('fs');
const MarkovGen = require('markov-generator');

console.log('Generate Corpus');
var corpus = [];

// get/parse texts

function getLinks(url, callback) {
	var links = [];
	request(url, (error, response, body) => {
		if (!error && response.statusCode === 200) {
			var $ = cheerio.load(body);
			console.log('finding manifestos...');
			$('.itemmanifesto a').each((i, el) => {
				var link = $(el).attr('href');
				links.push(link);
			});
			if (!links.length) {
				console.log('Links not found at url:\n', url);
			} else {
				if(typeof callback === 'function') {
					callback(links);
				} else {
					return links;
				}
			}
		} else if (error) {
			console.log('ERROR: cannot get url:\n', error);
		} else {
			console.log('ERROR: http response:\n', response.statusCode);
		}
	});
}

function parseCorpus (error, response, body) {
	if (!error && response.statusCode === 200) {
		var $ = cheerio.load(body);
		corpus.push($('p').text());
	}
}

function getCorpus(links, callback) {
	if (corpus.length) {
		return corpus;
	}
	if (!!links || links.length === 0) {
		links = getLinks('http://www.391.org/dada-manifestos.html');
	}
	var i = links.length;
	while (i > 0) {
		var link = links.pop();
		if (link.indexOf('jpg') === -1 &&
				link.indexOf('png') === -1 &&
				link.indexOf('gif') === -1 &&
				link.indexOf('swf') === -1 &&
				link.indexOf('pdf') === -1
			 ) {
			request(link, parseCorpus);
		}
		i -= 1;
	}
	return corpus;
}

getCorpus();
