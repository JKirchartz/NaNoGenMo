#! /bin/bash
#
# haiku.sh
#
# Copyleft (ↄ) 2020 jkirchartz <me@jkirchartz.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.
#


# function new_count(word) {
#   word = word.toLowerCase();                                     //word.downcase!
#   if(word.length <= 3) { return 1; }                             //return 1 if word.length <= 3
#   word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');   //word.sub!(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
#   word = word.replace(/^y/, '');                                 //word.sub!(/^y/, '')
#   return word.match(/[aeiouy]{1,2}/g).length;                    //word.scan(/[aeiouy]{1,2}/).size
# }

# input a file, get a list of sentences
function sentences () {
  sed 's/[.!?]  */&\n/g' $1;
}


# input a file containing a list of words
function wordListToSyllables () {
  # taken from: https://www.grant-trebbin.com/2012/07/sorting-word-list-by-syllable-with-awk.html
  # The next step is where we actually process each line and is reasonably
  # complicated.  In the "begin" part of the command we set the field separator
  # to 0xA5, this lets awk know how to separate the input.  The output record
  # separator is also set to nothing instead of the default new line character.
  # If this wasn't done a new line would be inserted after every print
  # statement.  The next part of the command prints NF followed by an
  # underscore, this is the number of fields in the input, which is the number
  # of syllables in the word.  A for loop is then run which prints each field
  # in the input. This prints the word, but removes the delimiting characters.
  # An underscore is then inserted.  Next another for loop is run which does
  # basically the same thing, except it prints and equals sign after each field
  # except the the last field.  A new line character is then printed to finish
  # off the line.

  awk 'BEGIN{FS="\xA5"; ORS="";}{print ((NF) "_");  for (i=1; i<=NF; i++) print $i; print "_"; for (i=1; i<NF; i++) print ($i "="); print(($NF) "\n"); }' $1
}


function syllables() {
  echo "syl $1"
  while IFS="$\n" read -r line; do
    syls=$(echo "$line" | sed -e 's/[^aeiouAEIOU]/ /g' | awk '{print NF}')
    if [ $syls = "5" ] || [ $syls = "7" ]; then
      echo "$syls $line";
    fi;
  done
}

source=$(sentences "$@" | syllables)
echo $source
