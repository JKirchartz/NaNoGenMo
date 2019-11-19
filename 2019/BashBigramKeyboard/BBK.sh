#! /bin/bash

shopt -s nocasematch

BIGRAMFILE=$1
OUTPUTFILE=$2

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
    \#[0-9]*)
      i=$(echo $1 | sed 's/#//')
      LASTWORD=$(grep "^[[:digit:]]* $LASTWORD\b" "$BIGRAMFILE" | head -n 10 | cut -d' ' -f3 | sed -n "${i}p")
      echo -n "$LASTWORD " >> $OUTPUTFILE
      SUGGESTIONS=$(grep "^[[:digit:]]* $LASTWORD\b" "$BIGRAMFILE" | head -n 10 | cut -d' ' -f3)
      NEWSUGGESTIONS=""
      for S in $SUGGESTIONS; do
        NEWSUGGESTIONS="${NEWSUGGESTIONS}    ${COUNT}: ${S}"
        COUNT=$(($COUNT + 1))
      done
      ;;
    !fetch*)
      i=$(echo "$i" | cut -d' ' -f2)
      ./BBK_corpus.sh "$i"
      ;;
    !ls*|!list*)
      for i in ./tmp/*.bigrams; do
        NAME=$(basename -s .bigrams $i)
        SUGGESTIONS="${SUGGESTIONS}${NAME}  "
      done
      SUGGESTIONS="Available corpora:\n${SUGGESTIONS}"
      ;;
    !load*)
      i=$(echo "$i" | cut -d' ' -f2)
      BIGRAMFILE="./tmp/${i}.bigrams";
      SUGGESTIONS=$(head -n 10 $BIGRAMFILE | cut -d' ' -f3);
      NEWSUGGESTIONS=""
      for S in $SUGGESTIONS; do
        NEWSUGGESTIONS="${NEWSUGGESTIONS}    ${COUNT}: ${S}"
        COUNT=$(($COUNT + 1))
      done
      ;;
    *)
      LASTWORD=$(echo "$i" | awk '{print $NF}')
      SUGGESTIONS=$(grep "^[[:digit:]]* $LASTWORD\b" "$BIGRAMFILE" | head -n 10 | cut -d' ' -f3)
      COUNT=0
      NEWSUGGESTIONS=""
      for S in $SUGGESTIONS; do
        NEWSUGGESTIONS="${NEWSUGGESTIONS}    ${COUNT}: ${S}"
        COUNT=$(($COUNT + 1))
      done
      SUGGESTIONS="$NEWSUGGESTIONS"
      echo -n "$i " >> $OUTPUTFILE
      ;;
  esac
  # print TUI
  clear;
  echo $(cat $OUTPUTFILE)
  echo -e "\n===\n"
  [[ "$BIGRAMFILE" == "" ]] && echo "please load a corpus";
  echo -e "$SUGGESTIONS"
done
