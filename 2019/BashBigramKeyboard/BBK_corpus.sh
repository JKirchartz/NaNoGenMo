#! /bin/bash
#
# BBK_corpus.sh
# add a link (or file from the tmp directory) to the corpus.
#
# Copyleft (ↄ) 2019 jkirchartz <me@jkirchartz.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.
#

URL="$1"
if [ ! -f "$URL" ]; then
  FILE="${URL##*/}"
else
  FILE="$URL"
fi
EXT="${URL##*.}"
FILE=$(basename -s "$EXT" $FILE | cut -d'.' -f 1)
FILENAME="./tmp/${FILE}.${EXT}"

if [ ! -f "$URL" ]; then
  wget -c "$URL" -P ./tmp/
fi

# assume gutenberg, but I don't think it'll hurt anything
./stripgutenberg.pl < "${FILENAME}" > "${FILENAME}.tmp"


echo "generating bigrams";
awk '{for (i=1; i<NF; i++) print $i, $(i+1)}' "$FILENAME.tmp" | tr -sc '[A-Z][a-z]' '[\012*]' | sed -e 's/^[ \t]*//' -e 's/[ \t]/ /' >> "./tmp/BIGRAMS.tmp"

echo "cleaning bigrams"
if [ -f "$BIGRAMS" ]; then
  cut -d' ' -f2- "./tmp/BIGRAMS" >> ./tmp/BIGRAMS.tmp
fi
sort -f  "./tmp/BIGRAMS.tmp" | uniq -uic | sort -n > "./tmp/BIGRAMS"
