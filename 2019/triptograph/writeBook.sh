#! /bin/bash
#
# writeBook.sh
#
# Copyleft (ↄ) 2019 jkirchartz <me@jkirchartz.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.
#

defs=./tmp/defs.txt
defstracery=./tmp/defs.corpus.json
dreams=./tmp/dreams.json
FILE="$1"

tracery () {
  rand=$(($RANDOM % 4))
  quote=./tmp/dreams.json
  corpus=./tmp/corpus.json
  soundextracery=./tmp/soundex.corpus.json
  mergedtracery=./tmp/merged.corpus.json
  length=10
  case $rand in
    0)
      pos2tracery generate $quote -m -r $length | sed -e 's/\n+/\n/'
      ;;
    1)
      pos2tracery generate $corpus -m -r $length | sed -e 's/\n+/\n/'
      ;;
    2)
      pos2tracery generate $mergedtracery -m -r $length | sed -e 's/\n+/\n/'
      ;;
    3)
      pos2tracery generate $soundextracery -r $length | sed -e 's/\n+/\n/'
      ;;
  esac
}

title () {
  word=$(shuf -n1 /usr/share/dict/words)
  second=$({ cat /usr/share/dict/words; printf %s\\n "$word"; } | rev | sort | rev | grep -FxC15 -e "${word?}" | grep -Fxve "$word" | shuf -n1)
  echo "${word} ${second}" | sed 's!/.!\U&!g'
}

echo "\# Triptograph: Dreams of $(title)" >> $FILE
WORDCOUNT=0;
echo "writing to file: $FILE"
while [ $WORDCOUNT -le 50000 ]; do
  echo "writing..."
  cat << EOF >> $FILE
\hfill
\\pagebreak
\\begin{center}
![]($(./imagegen.js "./$(dirname $FILE)/"))
\\hfill
\\pagebreak
\#\# $(title)
$(pos2tracery generate $dreams -m)
\\end{center}
$(tracery)
$(tracery)
$(tracery)
$(tracery)
$(tracery)
\\hfill
\\pagebreak
\#\# $(title)
$(./TTYzara.sh | sed -e 's/^/>/')
\\hfill
\\pagebreak
EOF
WORDCOUNT=$(wc -w $FILE | cut -d' ' -f1)
  echo "... $WORDCOUNT words";
done
