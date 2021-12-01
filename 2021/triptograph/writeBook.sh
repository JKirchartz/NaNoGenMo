#! /bin/bash
#
# writeBook.sh
#
# Copyleft (ↄ) 2021 jkirchartz <me@jkirchartz.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.
#

# defs=./tmp/defs.txt
# defstracery=./tmp/defs.corpus.json
dreams=./tmp/dreams.json
FILE="$1"

tracery () {
  rand=$((RANDOM % 4))
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

function endlines () {
  read -r f
  sed -e 's/$/\\/' -e 's/[\]//' <<< "$f"
}

imgdir="$(dirname "$FILE")/images/"
booktitle=$(title)
mkdir -p "$imgdir"
cat <<- EOF > "$FILE"
---
title: "Triptograph: Dreams of ${booktitle}"
documentclass: "book"
author: "Triptography by JKirchartz"
date: "$(date +"%F")"
graphics: "true"
---


EOF
WORDCOUNT=0;
echo "writing to file: $FILE"
while [ $WORDCOUNT -le 10000 ]; do
  cat <<- EOF >> "$FILE"
\\pagebreak
\\begin{center}
\\includegraphics[width=\\textwidth,height=\\textheight,keepaspectratio]{$(./imagegen.js "$imgdir")}
\\end{center}
\\pagebreak
\\begin{center}

\\chapter*{$(title)}

$(pos2tracery generate $dreams -m | endlines)


$(tracery | endlines)
$(tracery | endlines)

\\end{center}

\\rule{\\textwidth}{0.4pt}

$(./TTYzara.sh | endlines)

\\rule{\\textwidth}{0.4pt}

$(./Blackout.sh | endlines)

\\begin{center}

\\chapter*{$(title)}

\\end{center}

\\rule{\\textwidth}{0.4pt}

$(./TTYzara.sh | endlines)

\\rule{\\textwidth}{0.4pt}

$(./Blackout.sh | endlines)

\\hfill
\\pagebreak
\\begin{center}
\\includegraphics[width=\\textwidth,height=\\textheight,keepaspectratio]{$(./imagegen.js "$imgdir")}
\\includegraphics[width=\\textwidth,height=\\textheight,keepaspectratio]{$(./imagegen.js "$imgdir")}
\\end{center}
\\pagebreak
\\begin{center}

\\chapter*{$(title)}

$(pos2tracery generate $dreams -m | endlines)

\\end{center}

\\rule{\\textwidth}{0.4pt}

$(./Blackout.sh | endlines)

\\rule{\\textwidth}{0.4pt}

$(./TTYzara.sh | endlines)

\\hfill
\\pagebreak
EOF
WORDCOUNT=$(wc -w "$FILE" | cut -d' ' -f1)
  echo -e "\\r\\e[K... $WORDCOUNT words";
done

sed -i 's/\s+$//g' "$FILE"


