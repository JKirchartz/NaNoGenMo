#! /usr/bin/env bash
#
# make.sh
#
# Copyleft (ↄ) 2018 jkirchartz <me@jkirchartz.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.
#

if [[ "$#" == "0" ]]; then
  echo "usage:"
  echo "remake.sh /path/to/file.md"
  exit 0;
fi

book=$1

pandoc "$book" -s --toc --smart --latex-engine=xelatex --template=layout.tex -o "${book/%.md/.pdf}"
