#!/usr/bin/env node

'use strict';

const request = require('request');
const cheerio = require('cheerio');
// const gleech = require('gleech');


console.log('Generate Artbook');


// get/parse texts
request('http://www.391.org/dada_manifestos.html', (error, response, body) => {
		console.log('getting list...');
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(body);
			console.log('finding links:');
			$('.itemmanifesto a').each((i, el) => {
				var link = $(el).href(); // attr('href');
				console.log(i, ':', link);
			});
		} else if (error) {
			console.log('\n\nERROR\n\n', error);
		} else {
			console.log('response', response.statusCode);
		}
	});


// Generate images & text

