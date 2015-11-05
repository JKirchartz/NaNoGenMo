#! /usr/bin/env python
# -*- coding: utf-8 -*-
# vim:fenc=utf-8
#
# Copyleft (ↄ) 2015 kirch <kirch@arp>
#
# Distributed under terms of the NPL (Necessary Public License) license.

"""
Pseudocode:
book = band.name
chapter_count = 0
for song in band.songs:
  chapter = song.name
  chapter_count+=1
  verses = split("\n\n", song.lyrics)
  verse_count = 0
  for verse in verses:
      verse_count+=1
      print "%s:%s %s" % (chapter_count, verse_count, verse)
"""


from pyquery import PyQuery as pq
import urllib, json

bands = ['The Beatles', 'Devo', 'Oingo Boingo']

"""
get band's discography
"""
def get_discog(name):
    url = 'http://lyrics.wikia.com/api.php?action=lyrics&fmt=json&artist='
    url += name
    response = urllib.urlopen(url)
    return json.loads(response.read())

"""
get band's song
"""
def get_song(band, name):
    url = 'http://lyrics.wikia.com/api.php?action=lyrics&fmt=json&artist='
    url += band
    url += '&song=' + name
    response = urllib.urlopen(url)
    new_url = json.loads(response.read())['url']
    page = pq(new_url)
    return page('.lyricsbox').text()

"""
create gospels from songs
"""
def gospel(band):
    discog = get_discog(band)
    output = "<h1>The Gospel of " + discog['artist'] +  "</h1>"
    albums = discog['albums']
    for album in albums:
        output += "<h2>Book of" + album['album'] + "</h2>"
        chapter_count = 1
        for song in album['songs']:
            verse_count=1
            chapter_count += 1
            output += "<h3>" + song + "</h3>"
            # use song variable to get lyrics
            lyrics = get_song(band, song)
            # verses = split on <p> or \n or whatever
            verses = lyrics.split('')
            for verse in verses:
                verse_count += 1
                output += "<i>%s:%s<i> %s" % (chapter_count, verse_count, verse)

    return output

"""
write the book to terminal
"""
def write():
    f = open("BeatlesBible.html", 'w')
    content = ""
    for band in bands:
        content += gospel(band)

    f.write(content)
    f.close()

if __name__ == '__main__':
    write()
