#! /bin/sh
#
# make.sh
#
# Copyleft (ↄ) 2015 kirch <kirch@arp>
#
# Distributed under terms of the NPL (Necessary Public License) license.
#

mkdir corpora
mkdir sources
mkdir tmp

echo "downloading..."
wget -nc -i doyle.list -P ./sources

echo "converting...."
for file in ./sources/*.txt; do
  title=$(grep Title: "$file" | head | cut -d' ' -f2- | sed -e 's|[^A-Za-z]||g')
  stripgutenberg.pl < "$file" > "./corpora/$title.txt"
done

cat ./corpora/*.txt > ./corpora/complete.corpus

echo "shuffling...."
python shuffle.py ./corpora/*.txt

