#! /bin/bash
#
# BBK_corpus.sh
#
# Copyleft (ↄ) 2019 jkirchartz <me@jkirchartz.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.
#

URL="$1"
FILE="${URL##*/}"
EXT="${URL##*.}"
FILE=$(basename -s "$EXT" $FILE | cut -d'.' -f 1)
FILENAME="./tmp/${FILE}.${EXT}"
BASENAME="./tmp/${FILE}"
CORPUS="./tmp/${FILE}.corpora"

wget "$URL" -P ./tmp/ --no-clobber

if [[ "$URL" == *"gutenberg"* ]]; then
  echo "Project Gutenberg detected... stripping headers";
  ./stripgutenberg.pl < "${FILENAME}" > "$CORPUS"
fi

echo "generating bigrams";
# ala "Unix for Poets"
# tr -sc ’[A-Z][a-z]’ ’[\012*]’ < "${CORPUS}" > "${BASENAME}.words"
awk '{for (i=1; i<NF; i++) print $i, $(i+1)}' "${CORPUS}" | tr '' '\n' | sort -f | uniq -uic | sort -n  | sed -e 's/^[ \t]*//' -e 's/[ \t]/ /' > "${BASENAME}.bigrams"
# tail +2 "${BASENAME}.words" > "${BASENAME}.nextwords"
# paste "${BASENAME}.words" > "${BASENAME}.nextwords" | sort | uniq -c > "${BASENAME}.bigrams"
