#! /usr/bin/env python
# -*- coding: utf-8 -*-
# vim:fenc=utf-8
#
# Copyleft (ↄ) 2020 jkirchartz <me@jkirchartz.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.

"""

"""

import sys
import re
from googletrans import Translator

translator = Translator()
rex = re.compile('[^a-zA-Z]')

with open(sys.argv[1], 'r') as r:
    title = r.readline()
    output_file = "_".join(title.split())
    story = r.read()

    with open(output_file, 'a') as w:

        w.write("{}: in English, then in French, and then Clawed Back into a Civilized Language Once More by Patient, Unrenumerated Toil, done by a Robot".format(title))
        w.write(story + '\n\n\n\n')

        french = translator.translate(story, src='en', dest='fr').text

        w.write(french + '\n\n\n\n')

        french_words = list(set(re.sub('', french).split())) # is this too much?

        dic = translator.translate(french_words, src='fr', dest='en')

        for word in dic:
            french=french.replace(word.original, word.text)

        w.write(french + '\n\n\n\n')

