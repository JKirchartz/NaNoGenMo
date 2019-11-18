#! /bin/bash

shopt -s nocasematch

OUTPUTFILE=$1
BIGRAMFILE=$2

[[ "$OUTPUTFILE" == "" ]] && OUTPUTFILE=$(mktemp ./tmp/output.XXX.md);

clear;
echo "Welcome to the Bash Bigram Keyboard, please !load a set of bigrams to get started, or enter !help";
# fake a shell
while read -p "BBK > " i; do
  SUGGESTIONS=""
  case "$i" in
    !exit*) exit 0 ;;
    !help*)
      SUGGESTIONS="commands:"
      SUGGESTIONS="${SUGGESTIONS}\n    #[1-10]: choose suggestion by number"
      SUGGESTIONS="${SUGGESTIONS}\n    !help: show this message"
      SUGGESTIONS="${SUGGESTIONS}\n    !fetch: process a link to a text file"
      SUGGESTIONS="${SUGGESTIONS}\n    !list : list all available corpora"
      SUGGESTIONS="${SUGGESTIONS}\n    !load : load named corpus"
      SUGGESTIONS="${SUGGESTIONS}\n    !exit : close program"
      ;;
    \#*)
      i=$(echo "$i" | cut -d' ' -f2)
      SUGGECTIONS="$i"
      ;;
    !fetch*)
      i=$(echo "$i" | cut -d' ' -f2)
      ./BBK_corpus.sh "$i"
      ;;
    !ls*|!list*)
      TMP=""
      for i in ./tmp/*.bigrams; do
        NAME=$(basename -s .bigrams $i)
        SUGGESTIONS="${SUGGESTIONS}${NAME}  "
      done
      SUGGESTIONS="Available corpora:\n${SUGGESTIONS}"
      ;;
    !load*)
      i=$(echo "$i" | cut -d' ' -f2)
      BIGRAMFILE="./tmp/${i}.bigrams";
      SUGGESTIONS=$(head -n 10 $BIGRAMFILE);
      ;;
    *)
      LASTWORD=$(echo "$i" | awk '{print $NF}')
      SUGGESTIONS=$(grep "^$LASTWORD" "$BIGRAMFILE" | head -n 10)
      echo "$i" >> $OUTPUTFILE
      ;;
  esac
  # print TUI
  clear;
  < $OUTPUTFILE
  echo -e "\n===\n"
  [[ "$BIGRAMFILE" == "" ]] && echo "please load a corpus";
  echo -e $SUGGESTIONS
done
