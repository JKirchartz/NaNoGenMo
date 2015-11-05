#! /usr/bin/env python
# -*- coding: utf-8 -*-
# vim:fenc=utf-8
#
# Copyleft (ↄ) 2015 kirch <kirch@arp>
#
# Distributed under terms of the NPL (Necessary Public License) license.

"""
Shuffle Sherlock
"""
import re, os, sys

def bookslicer(files):
    chapterlist=[]
    for book in files:
        txt = open(book, 'r')
        title = re.split(r'[\/\.]', txt.name)[1]
        print "slicing " + title
        chapters = re.split(r'\s(?:Chapter|Adventure)\s+(?:\d+|[MXCLVI]+)',
                            txt.read(),
                            flags=re.IGNORECASE)
        os.mkdir('./tmp/'+title)
        for i in range(len(chapters)):
            filename = './tmp/'+title+'/'+str(i)+'.txt'
            chapterlist.append(filename)
            f = open(filename, 'w')
            content = chapters[i]
            # TODO: clean up content
            f.write(content)
            f.close()
        txt.close()
    return chapterlist

# TODO: figure out how I'm gonna shuffle this....
# initial idea: open book files 0.txt at random and take a sentence or paragraph 
# and compile into new chapters after the segments have been exhausted
# problems with this idea: characters, continuity

if __name__ == '__main__':
    files = sys.argv
    files.pop(0)
    chapter_files = bookslicer(files)



