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
  chapter_number = 1
  print('\n\n\n\n#', book)
  for song in album:
    if len(song) > 1:
      bits = song.split('. ')
      chapter = bits[1].strip()
      filename = chapter.lower().replace(' ', '_')
      filename = filename.translate(str.maketrans('','',string.punctuation.replace('-', '').replace('_','')))
      filename = './beatles-lyrics/the_beatles__' + filename + '.txt'
      lyrics = open(filename, 'r')
      verse_number = 1
      sections = lyrics.read().split('\n\n')
      verses = ""
      if len(sections):
        print('\n\n\n##', chapter_number, chapter, '\n')
        for section in sections:
          chunk = section.split('\n')
          for line in chunk:
            verses += re.sub(r'^((\(|\[).*?$|$)', ' ', line) + ' '
          verses += ' \n'
        for line in verses.split('\n'):
          if len(line.strip()) >= 1:
            print(''.join([str(chapter_number), ':', str(verse_number)]) + ' ' + line.strip())
            verse_number = verse_number + 1
        chapter_number = chapter_number + 1
      lyrics.close()
