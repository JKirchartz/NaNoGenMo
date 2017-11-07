#! /usr/bin/env python3
# -*- coding: utf-8 -*-
# vim:fenc=utf-8
#
# Copyright © 2017 jkirchartz <me@jkirchartz.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.

"""
Generate the Beatles Bible
"""
import re
import string

init_txt = open('./layout.txt', 'r')
layout = init_txt.read()
init_txt.close();
discography = layout.split('\n\n') # split on blank lines (and don't leave newlines)

book_count = 0
for album in discography:
  album = album.split('\n')
  book = album[0].strip()
  del album[0]
  for song in album:
    if len(song) > 1:
      bits = song.split('. ')
      filename = bits[1].lower().strip().replace(' ', '_')
      filename = filename.translate(str.maketrans('','',string.punctuation.replace('-', '').replace('_','')))
      filename = './beatles-lyrics/the_beatles__' + filename + '.txt'
      lyrics = open(filename, 'r')
      chapter_number = bits[0]
      verse_number = 1
      for line in lyrics:
        if re.match(r'^(\[|\n)', line) == None:
          print(chapter_number, ':', verse_number, line)
          verse_number = verse_number + 1
      lyrics.close()
