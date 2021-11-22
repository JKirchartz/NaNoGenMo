#! /bin/bash
#
# writeBook.sh
#
# Copyleft (ↄ) 2021 jkirchartz <me@jkirchartz.com>
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
  echo "${word^} ${second^}" | sed -e 's!/.!\U&!g'
}

endlines () {
  sed -e 's/$/\\/' -e 's/[\]//' <<< "$@"
}
imgdir="$(dirname $FILE)/images/"
booktitle=$(title)
mkdir -p "$imgdir"
echo -e "---\ntitle: \"Triptograph: Dreams of ${booktitle}\"\ndocumentclass: \"book\"\nauthor: \"Triptography by JKirchartz\"\ndate: \"$(date +"%D %T")\"\n---\n\n" > $FILE
WORDCOUNT=0;
echo "writing to file: $FILE"
while [ $WORDCOUNT -le 10000 ]; do
  cat <<- EOF >> $FILE
\hfill
\\pagebreak
\\begin{center}

![$(title)]($(./imagegen.js "$imgdir")){max-width=90% height=auto} \\

\\end{center}
\\hfill
\\pagebreak
\\begin{center}

\\Large $(title)

$(pos2tracery generate $dreams -m | endlines)

\\end{center}

$(tracery | endlines)
$(tracery | endlines)

\\hfill
\\pagebreak
\\begin{center}

\\Large $(title)

$(pos2tracery generate $dreams -m | endlines)

\\end{center}

\\begin{poem}
$(./TTYzara.sh | sed -e 's/$/\\verseline/' | sed -e 's/^\\verseline$/\n/' | awk -v RS='\n\n+' -vORS='\n\n+' '{print "\\begin{stanza}\n"$0"\n\end{stanza}"}')
\\end{poem}

\\hfill
\\pagebreak
\\begin{center}

\\Large $(title)

$(pos2tracery generate $dreams -m | endlines)

\\end{center}

\\begin{poem}
$(./TTYzara.sh | sed -e 's/$/\\verseline/' | sed -e 's/^\\verseline$/\n\n/' | awk -v RS='\n\n+' -vORS='\n\n+' '{print "\\begin{stanza}\n"$0"\n\end{stanza}"}')
\\end{poem}

\\hfill
\\pagebreak
EOF
WORDCOUNT=$(wc -w $FILE | cut -d' ' -f1)
  echo -e "\r\e[K... $WORDCOUNT words";
done
