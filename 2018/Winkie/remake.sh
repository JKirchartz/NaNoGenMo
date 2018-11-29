#! /usr/bin/env bash
#
# remake.sh
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

pandoc "$1" -s --toc --smart --wrap=preserve --latex-engine=xelatex --template=layout.tex -o "${1/%.md/.pdf}"
