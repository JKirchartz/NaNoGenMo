#! /bin/sh
#
# init.sh
#
# Copyleft (ↄ) 2018 jkirchartz <me@jkirchartz.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.
#

echo downloading
wget -nc https://www.gutenberg.org/files/11/11-0.txt -P ./sources
wget -nc http://www.gutenberg.org/cache/epub/26732/pg26732.txt -P ./sources

echo converting
head -n 3369 ./sources/11-0.txt | tail -n 3339 > ./corpora/11-0.txt
head -n 9840 ./sources/pg26732.txt | tail -n 9730 > ./corpora/pg26732.txt

if [ ! -d "./node_modules/" ]; then
  npm install
fi
