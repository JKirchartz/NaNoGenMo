#! /usr/bin/env python
# -*- coding: utf-8 -*-
# vim:fenc=utf-8
#
# Copyleft (ↄ) 2015 kirch <kirch@arp>
#
# Distributed under terms of the NPL (Necessary Public License) license.

"""
Music is a religious experience, let's treat it like one.
"""

from pyquery import PyQuery as pq
import simplejson as json
import re, urllib, time, random, os, sys, codecs

def output_file(directory, filename, output):
    """write a file (increment to avoid clobbering)"""
    output = re.sub(",\n", ", ", output)
    if not os.path.exists(directory):
        os.mkdir(directory)
    filename = directory + '/' + filename
    if not os.path.exists(filename):
        f = codecs.open(filename, 'w', 'utf-8')
    else:
        i = 0
        while os.path.exists(filename + "." + str(i)):
            i += 1
        f = codecs.open(filename + "." + str(i), 'w', 'utf-8')
    f.write(output)
    f.close()


def get_discog(band):
    """
    get band's discography
    """
    filename = re.sub(r'[^A-Za-z_]+', '_', band) + ".json"
    if os.path.exists('tmp/' + filename):
        f = open('tmp/' + filename, 'r')
        output = f.read()
        f.close()
    else:
        url = 'http://lyrics.wikia.com/api.php?action=lyrics&fmt=json&artist='
        url += band
        response = urllib.urlopen(url)
        output = response.read()
        output_file('tmp', filename, output)
        # wait a minute between songs to avoid clumping
        msg()

    return json.loads(output)

def get_song(band, song):
    """
    get band's song
    """
    filename = re.sub(r'[^A-Za-z_-]+', '_', "-".join([band, song]))
    if os.path.exists('tmp/' + filename):
        f = open('tmp/' + filename, 'r')
        lyrics = f.read()
        f.close()
    else:
        url = 'http://lyrics.wikia.com/api.php?action=lyrics&fmt=json&artist='
        url += band
        url += '&song=' + song
        response = urllib.urlopen(url)
        song = response.read()[7:].replace('"', '%').replace("'", '"').replace('%', "'")
        reply = json.loads(song)
        new_url = reply['url']
        page = pq(new_url)
        lyrics = page('.lyricbox').remove('script').html()
        lyrics = re.sub(r'(<br\/?><br\/?>|<[^>]+>|<!--[^-]+-->)',
                        '\n',
                        lyrics.decode('utf-8'),
                        re.MULTILINE)
        output_file('tmp', filename, lyrics)
        # wait a minute between songs to avoid clumping
        msg()

    return lyrics


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
        print ""
        print "Writing: " + album['album']
        for song in album['songs']:
            verse_count = 0
            chapter_count += 1
            output += "\n###" + song
            # use song variable to get lyrics
            lyrics = get_song(band, song)
            verses = lyrics.split('\n')
            for verse in verses:
                if len(verse):
                    verse_count += 1
                    tmp = "%s:%s %s\n" % (chapter_count, verse_count, verse)
                    output += tmp.decode('utf-8')

    return output

def msg():
    sys.stdout.write(".")
    time.sleep(30) # wait 30 seconds

if __name__ == '__main__':
    """
    write the book
    """
    BANDS = ['The Beatles', 'Devo', 'Oingo Boingo', 'Cake']
    for name in BANDS:
        fname = re.sub(r'[^A-Za-z_]+', '_', name)
        content = gospel(name)
        output_file('output', fname + "_Bible.md", content)
        msg()


