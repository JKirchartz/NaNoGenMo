#! /bin/sh
#
# convert.sh
#
# Copyleft (ↄ) 2015 jkirchartz <jkirchartz@gmail.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.
#

for file in ./sources/*.txt; do
  title=$(grep Title: $file | cut -d' ' -f2- | tr ' ' '_' | tr '' '' | head)
  stripgutenberg.pl < $file > ./corpora/$title.txt
done

cat ./corpora/*.txt > ./corpora/complete.corpus
