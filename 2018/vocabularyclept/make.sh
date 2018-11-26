#! /usr/bin/env bash
#
# make.sh
#
# Copyleft (ↄ) 2018 jkirchartz <me@jkirchartz.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.
#

book=`node index.js`

pandoc "$book" -s --toc --smart --latex-engine=xelatex -V geometry:margin=1cm -o "${book/%.md/.pdf}"
