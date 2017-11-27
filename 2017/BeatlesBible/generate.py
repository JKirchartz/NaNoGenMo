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

print('<!doctype html><title>Beatles Bible</title><link href="style.css" rel="stylesheet" />')
book_count = 0
for album in discography:
  album = album.split('\n')
  book = album[0].strip()
  del album[0]
  chapter_number = 1
  print('\n\n\n\n<article class=\'book\'><h1>' + book + '</h1><div class=\'chapters\'>')
  for song in album:
    if len(song) > 1:
      bits = song.split('. ')
      chapter = bits[1].strip()
      filename = chapter.lower().replace(' ', '_')
      filename = re.sub(r'[\'\`\-()!?,\"\.]', '', filename)
      filename = './beatles-lyrics/the_beatles__' + filename + '.txt'
      lyrics = open(filename, 'r')
      verse_number = 1
      sections = lyrics.read().split('\n\n')
      verses = ""
      if len(sections):
        print('<div class=\'chapter\'><h2>' + chapter + '</h2>\n\n<i class=\'num\'>' + str(chapter_number) + '</i>')
        for section in sections:
          chunk = section.split('\n')
          print('<p>')
          for line in chunk:
            line = re.sub(r'^((\(|\[).*?$|$)', '', line)
            if len(line.strip()) >= 2:
              print('<sup>' + str(verse_number) + '</sup> ' + line.strip())
              verse_number = verse_number + 1
          print('</p>')
        print('</div>\n\n')
        chapter_number = chapter_number + 1
      lyrics.close()
  print('</div></article>\n\n')

