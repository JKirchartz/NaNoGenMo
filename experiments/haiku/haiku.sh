#! /bin/bash
#
# haiku.sh
#
# Copyleft (ↄ) 2020 jkirchartz <me@jkirchartz.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.
#


function syl() {
  awk '{gensub(/[^aeiouAEIOU]/," ", "g", $0); print NF $0}'
}

function syllables() {
  while IFS=$'\n' read -r line; do
    syls=$(sed -e 's/[^aeiouAEIOU]/ /g' <<< "$line" | awk '{print NF}')
    if [ "$syls" = "5" ] || [ "$syls" = "7" ]; then
      echo "$syls $line";
    fi;
  done
}


# input a file, get a list of sentences
function sentences () {
  # sed 's/[.!?]  */&\n/g' "$1";
  fmt -w20 "$1"
  fmt -w25 "$1"
  fmt -w30 "$1"
  fmt -w35 "$1"
  fmt -w40 "$1"
}

if grep GNU <<< "$(awk -Wversion 2>/dev/null || awk --version)" 1>/dev/null; then
  src=$(sentences "$@" | syl)
else
  src=$(sentences "$@" | syllables)
fi

cat <<< "$src" | grep ^5 | shuf -n 1 | sed -e 's/[^A-Za-z ]//g'
cat <<< "$src" | grep ^7 | shuf -n 1 | sed -e 's/[^A-Za-z ]//g'
cat <<< "$src" | grep ^5 | shuf -n 1 | sed -e 's/[^A-Za-z ]//g'

# echo "---"

# cat <<< $src | awk 'BEGIN{srand()} /^5/ {print rand() " " $0} /^7/ {print rand () " " $0}'

# echo "---"

# cat <<< $src | awk 'BEGIN{srand()} /^5/ (rand() * NR > 1: line1=$0} /^7/ {rand() * NR > 1: line2=$0} END {print line1 "|" line2}'
