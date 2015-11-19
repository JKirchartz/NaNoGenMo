#! /usr/bin/env python
# -*- coding: utf-8 -*-
# vim:fenc=utf-8
#
# Copyleft (ↄ) 2015 kirch <kirch@arp>
#
# Distributed under terms of the NPL (Necessary Public License) license.

"""
Create a simple reference for preaching song lyrics
"""

from pyquery import PyQuery as pq
import simplejson as json
import re, urllib, time, random


def get_discog(band):
    """
    get band's discography
    """
    url = 'http://lyrics.wikia.com/api.php?action=lyrics&fmt=json&artist='
    url += band
    response = urllib.urlopen(url)
    return json.loads(response.read())

def get_song(band, song):
    """
    get band's song
    """
    url = 'http://lyrics.wikia.com/api.php?action=lyrics&fmt=json&artist='
    url += band
    url += '&song=' + song
    response = urllib.urlopen(url)
    song = response.read().replace("'", '"')[7:]
    new_url = json.loads(song)['url']
    page = pq(new_url)
    lyrics = page('.lyricbox').remove('script').html()
    lyrics = re.sub(r'(<br\/?><br\/?>|<[^>]+>)', '\n', lyrics)
    lyrics = lyrics.split('NewPP limit report')[0]
    return lyrics

def msg():
    waiting = ["...man, I need a nap!",
               "maybe I'll go for a walk",
               "let's meditate on that...",
               "coffee break!",
               "...aaaargh, writer's block!",
               "oh shoot, lost my train of thought",
               "bedtime, already!?",
               "hand cramp!!"]
    return random.choice(waiting)

def gospel(band):
    """
    create gospels from songs
    """
    discog = get_discog(band)
    output = "#The Gospel of " + discog['artist']
    albums = discog['albums']
    for album in albums:
        output += "\n##Book of" + album['album']
        chapter_count = 0
        print "Writing: " + album['album']
        for song in album['songs']:
            verse_count = 0
            chapter_count += 1
            output += "\n###" + song
            # use song variable to get lyrics
            lyrics = get_song(band, song)
            # verses = split on <p> or \n or whatever
            verses = lyrics.split('\n')
            for verse in verses:
                if len(verse):
                    verse_count += 1
                    tmp = "%s:%s %s\n" % (chapter_count, verse_count, verse)
                    output += tmp
            # wait a minute between songs to avoid clumping
            msg()
            time.sleep(60)
        msg()
        time.sleep(60)

    return output

if __name__ == '__main__':
    """
    write the book
    """
    BANDS = ['Cake', 'The Beatles', 'Devo', 'Oingo Boingo']
    for name in BANDS:
        fname = re.sub(r'[^A-Za-z_]+', '_', name)
        content = gospel(name)
        f = open(fname + "_Bible.md", 'w')
        f.write(content)
        f.close()
        msg()
        time.sleep(60) #wait a minute between bands


