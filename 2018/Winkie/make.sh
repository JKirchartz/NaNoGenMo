#! /bin/sh
#
# make.sh
#
# Copyleft (ↄ) 2018 kirch <kirch@arp>
#
# Distributed under terms of the NPL (Necessary Public License) license.
#

mkdir corpora
mkdir sources
mkdir output

echo "downloading..."
wget -nc -i baum.list -P ./sources

echo "converting...."
for file in ./sources/*.txt; do
  title=$(grep Title: "$file" | head | cut -d' ' -f2- | sed -e 's|[^A-Za-z]||g')
  ./stripgutenberg.pl < "$file" > "./corpora/$title.txt"
done

cat ./corpora/*.txt > ./corpora/complete.corpus

sed -i '/HTML/d' ./corpora/complete.corpus
sed -i 's/--/ -- /g' ./corpora/complete.corpus

npm install

echo "Generating Text from Tracery Grammar..."
node index.js
