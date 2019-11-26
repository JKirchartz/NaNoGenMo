#! /bin/sh
#
# TT(Y)zara, a Tristan Tzara-style dadaist poetry generator.
#
# Copyleft (ↄ) 2019 jkirchartz <me@jkirchartz.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.
#

# grab an article from:
num=$(shuf -i1-8 -n1)
echo $num
case "$num" in
  [7])
    # NPR
    url=$(lynx -dump https://text.npr.org/ | grep "=[7-9][7-9]" | rev | cut -d' ' -f1 | rev | shuf -n 1);
    ;;
  [6])
    # Lobsters
    url=$(lynx -dump https://lobste.rs/newest | grep -v "lobste" | grep [[:digit:]] | rev | cut -d' ' -f1 | rev | grep http | shuf -n1)
    ;;
  [5])
    # Reuters
    url=$(lynx -dump https://www.reuters.com/commentary | grep article | rev | cut -d' ' -f1 | rev | shuf -n1);
    ;;
  [4])
    # Christian Science Monitor
    url=$(lynx -dump https://www.csmonitor.com/layout/set/text/textedition | grep \/20 | rev | cut -d' ' -f1 | rev | shuf -n1);
    ;;
  [3])
    # CNN
    url=$(lynx -dump https://lite.cnn.io/en | grep article | rev | cut -d' ' -f1 | rev | shuf -n1);
    ;;
  [2])
    # Folding Story
    url=$(lynx -dump http://foldingstory.com/read/ | grep http | tail -n 10 | rev | cut -d' ' -f1 | rev | shuf -n1)
    ;;
  *)
    # Dreams
    url=$(lynx -dump http://www.dreamjournal.net/main/dreams.cfm?timeframe=month | grep /journal/ | grep -v /user/ | shuf -n1 | rev | cut -d' ' -f1 | rev)
    ;;
esac;

case $(shuf -i1-4 -n1) in
  [4])
    linepattern='n;n;n;n;G;'
    ;;
  [3])
    linepattern='n;n;n;G;'
    ;;
  [2])
    linepattern='n;n;G;'
    ;;
  *)
    linepattern='n;n;n;n;n;G;'
    ;;
esac;

# generate poem
lynx -dump -nolist ${url} | awk 'NF>=10' | sed -e "s/\[[^\]]*\]//g" | sed -e "/^[ \t]*\*/d" | grep -o -E "[A-Za-z\'-]+" |\
  shuf | tr '\n' ' ' | fold -sw $(shuf -i 60-100 -n1) |\
  shuf -n $(shuf -i 3-10 -n1) | fold -sw $(shuf -i 13-30 -n1) |\
  sed "${linepattern}"

echo "\n\n   by T.T(Y)zara.sh\n   (from ${url})"

