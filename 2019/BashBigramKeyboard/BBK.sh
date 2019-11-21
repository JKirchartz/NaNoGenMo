#! /bin/bash

shopt -s nocasematch

OUTPUTFILE=$1
BIGRAMFILE="./tmp/BIGRAMS"
SUGGESTIONS=""

[[ "$OUTPUTFILE" == "" ]] && OUTPUTFILE=$(mktemp ./tmp/output.XXX.md);

clear;
echo "Welcome to the Bash Bigram Keyboard, please hit [enter] to continue, or ask for !help";
# fake a shell
while read -p "BBK > " i; do
  case "$i" in
    !exit*) exit 0 ;;
    !help*)
      SUGGESTIONS="commands:"
      SUGGESTIONS="${SUGGESTIONS}\n    0-9: choose suggestion by number"
      SUGGESTIONS="${SUGGESTIONS}\n    !help: show this message"
      SUGGESTIONS="${SUGGESTIONS}\n    !open: open an existing file for writing"
      SUGGESTIONS="${SUGGESTIONS}\n    !fetch: process a link (or file in the ./tmp directory) and add it to the corpus"
      SUGGESTIONS="${SUGGESTIONS}\n    !exit : close program"
      ;;
    [0-9])
      i=$(echo $i | sed 's/[^0-9]//')
      LASTWORD=$(echo "$SUGGESTIONS" | sed -e "s/[^$i]*  $i: \([^ \t]*\).*/\1/")
      echo -n "$LASTWORD " >> $OUTPUTFILE
      SUGGESTIONS=$(grep "^[[:digit:]]* $LASTWORD\b" "$BIGRAMFILE" | head -n 10 | cut -d' ' -f3)
      COUNT=0
      NEWSUGGESTIONS=""
      for S in $SUGGESTIONS; do
        NEWSUGGESTIONS="${NEWSUGGESTIONS}    ${COUNT}: ${S}"
        COUNT=$(($COUNT + 1))
      done
      SUGGESTIONS="$NEWSUGGESTIONS"
      ;;
    !open*)
      OUTPUTFILE="$i"
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
      COUNT=0
      NEWSUGGESTIONS=""
      for S in $SUGGESTIONS; do
        NEWSUGGESTIONS="${NEWSUGGESTIONS}    ${COUNT}: ${S}"
        COUNT=$(($COUNT + 1))
      done
      SUGGESTIONS="$NEWSUGGESTIONS"
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
  # clear;
  echo -e "\n=== OUTPUT ===\n"
  echo $(cat $OUTPUTFILE)
  echo -e "\n=== OPTIONS ===\n"
  echo -e "$SUGGESTIONS"
done
