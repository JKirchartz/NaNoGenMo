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
import re, os, sys, random, markovgen
from cStringIO import StringIO
from collections import defaultdict

def clean_content(content):
    """tidy up"""
    # white space
    content = re.sub(r'([\n\r]|\s+)', ' ', content)
    # punctuation
    content = re.sub(r'([,\.?!][\"\']?)',
                     lambda m: m.group(0) + '\n',
                     content)
    return content

def preparebooks(files):
    """Slice Book into Chapters
    won't clobber existing files, `rm -rf tmp` for that"""
    books = {}
    shorts = []
    if not os.path.exists('tmp'):
        os.mkdir('tmp')
    for book in files:
        txt = open(book, 'r')
        title = re.split(r'\.', os.path.basename(txt.name))[0]
        title = re.sub(r'(\n|\r)', '', title)
        chapters = re.split(r'\s(?:Chapter|Adventure)\s+(?:\d+|[MXCLVI]+)',
                            txt.read(),
                            flags=re.IGNORECASE)
        title = re.sub(' ', '_', title)
        dir = 'tmp/' +title
        if len(chapters) is 1:
            filename = dir +'.txt'
            shorts.append(filename)
            content = clean_content(chapters[0])
            if not os.path.isfile(filename):
                f = open(filename, 'w')
                f.write(content)
                f.close()
        else:
            if not os.path.exists(dir):
                os.mkdir(dir)
            books[title] = {}
            books[title]['len'] = len(chapters)
            books[title]['chapters'] = []
            for i in range(len(chapters)):
                filename = dir + '/'+str(i)+'.txt'
                books[title]['chapters'].append(filename)
                content = clean_content(chapters[i])
                if not os.path.isfile(filename):
                    f = open(filename, 'w')
                    f.write(content)
                    f.close()
        txt.close()
    return shorts, books


def output_txt(filename, output):
    """Actually write a file (increment to avoid clobbering)"""
    output = re.sub(",\n", ", ", output)
    if not os.path.exists("output"):
        os.mkdir("output")
    filename = "output/" + filename
    if not os.path.exists(filename):
        f = open(filename, 'w')
    else:
        i = 0
        while os.path.exists(filename + "." + str(i)):
            i += 1
        f = open(filename + "." + str(i), 'w')
    f.write(output)
    f.close()


def shufflebooks(books):
    """Mix Books Together"""
    books = sorted(books.iteritems(), key=lambda (x, y): y['len'])
    avg = books[0][1]['len'] + books[-1][1]['len'] / 2
    output = ""
    chapters = defaultdict(list)
    for book in books:
        chapter_count = 0
        for chapter in book[1]['chapters']:
            f = open(chapter, 'r')
            text = f.read().split('\n')
            if len(text) > 3:
                chapters[chapter_count].append(text[3:])
                chapter_count += 1
            f.close()

    for chapter in chapters:
        text = chapters[chapter]
        text_len = len(text)
        if text_len > 1:
            for i in range(1, text_len):
                choice = random.choice(text)
                if len(choice) >= 1:
                    line = choice[i % len(choice)]
                    output += line + '\n'
                    if random.choice([True, False]):
                        output += "\n"

    output_txt('shuf_book.txt', output)


def shuffleshorts(shorts):
    """Mix Shorts Together"""
    text = []
    line_count = 0
    for short in shorts:
        f = open(short, 'r')
        content = f.read()
        lines = content.split('\n')[3:]
        line_count += len(lines)
        text.append(lines)
        f.close()

    avg = line_count / len(shorts)
    output = ""
    for i in range(1, avg):
        r = random.randint(0, i) % len(text)
        line = random.choice(text)[i % len(text)].strip()
        output += line + '\n'
        if random.choice([True, False]):
            output += "\n"

    output_txt('shuf_short.txt', output)


def markovbooks(books):
    """Mix Books Together"""
    books = sorted(books.iteritems(), key=lambda (x, y): y['len'])
    max_len = books[-1][1]['len']
    avg = books[0][1]['len'] + max_len / 2
    output = ""
    chapters = ["" for i in range(max_len)]
    word_count = 0
    chapters_count = 0
    for book in books:
        chapter_count = 0
        for chapter in book[1]['chapters']:
            f = open(chapter, 'r')
            content = f.read()
            if len(content) > 0:
                words = content[3:].split(' ')
                word_count += len(words)
                chapters[chapter_count] += " ".join(words)
                chapter_count += 1
            f.close()
        chapters_count += chapter_count


    avg = (word_count / len(books)) / chapters_count
    for chapter in chapters:
        print chapter
        print "##########"
        markov = markovgen.Markov(StringIO(re.sub(r'\n', '', chapter)))
        output += "\n\n\n\n"
        output += markov.generate_markov_text(avg)
    output_txt('mark_book.txt', output.strip())


def markovshorts(shorts):
    """Mix Shorts Together"""
    text = ""
    word_count = 0
    for short in shorts:
        f = open(short, 'r')
        content = f.read()
        words = content.split(' ')
        word_count += len(words)
        text += " ".join(words)
        f.close()

    avg = word_count / len(shorts)
    markov = markovgen.Markov(StringIO(text))
    output = markov.generate_markov_text(avg)
    output_txt('mark_short.txt', output)


if __name__ == '__main__':
    ORIGINALS = sys.argv
    ORIGINALS.pop(0)
    if ORIGINALS == "":
        print "please specify files (i.e. corpora/*.txt)"
    else:
        print "Preparing..."
        SHORTS, BOOKS = preparebooks(ORIGINALS)
        print "Shuffling short..."
        shuffleshorts(SHORTS)
        print "Markoving short..."
        markovshorts(SHORTS)
        print "Shuffling Books..."
        shufflebooks(BOOKS)
        print "Markoving Books..."
        markovbooks(BOOKS)



