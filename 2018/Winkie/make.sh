#! /usr/bin/env bash
#
# make.sh
#
# Copyleft (ↄ) 2018 jkirchartz <me@jkirchartz.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.
#

book=`node index.js`

pandoc "$book" -s --toc --smart --wrap=preserve --latex-engine=xelatex --template=layout.tex -o "${book/%.md/.pdf}"
