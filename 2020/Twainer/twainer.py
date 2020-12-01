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
import textwrap
from google_trans_new import google_translator

translator = google_translator()
rex = re.compile(r'[^a-zA-Z\d\s:]')

with open(sys.argv[1], 'r') as r:
    title = r.readline()
    output_file = "_".join(title.split())
    story = r.read()

    with open(''.join(["output/", output_file, '.txt']), 'w+') as w:

        w.write("{}: in English, then in French, and then Clawed Back into a Civilized Language Once More by Patient, Unrenumerated Toil, done by a Robot".format(title))
        w.write(story + '\n\n\n\n')


        lines = textwrap.wrap(story, 5000, break_long_words=False)
        french=""
        for line in lines:
            french += translator.translate(line, 'fr', 'en')

        w.write(french + '\n\n\n\n')

        french_words = list(set(french.split())) # is this too much?

        lines = textwrap.wrap(". ".join(french_words), 5000,
                break_long_words=False)
        for line in lines:
            dic = translator.translate(line, 'en', 'fr')

        for word,key in dic.split(". "):
            french += french.replace(french_words[key], word)

        w.write(french + '\n\n\n\n')

