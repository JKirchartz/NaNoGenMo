#! /usr/bin/env bash
#
# make.sh
#
# Copyleft (ↄ) 2018 kirch <kirch@arp>
#
# Distributed under terms of the NPL (Necessary Public License) license.
#


echo "Generating Text from Tracery Grammar..."

book=`node generate.js`

pandoc "$book" -s --toc --smart --wrap=preserve --latex-engine=xelatex --template=layout.tex -o "${book/%.md/.pdf}"

