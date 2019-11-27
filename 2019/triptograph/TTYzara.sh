#! /bin/sh
#
# TT(Y)zara, a Tristan Tzara-style dadaist poetry generator.
#
# Copyleft (ↄ) 2019 jkirchartz <me@jkirchartz.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.
#

# grab an article from:
num=$(shuf -i1-10 -n1)
echo $num
case "$num" in
  [1][0])
    # 391.org dada manifestos
    url=$(lynx -dump https://391.org/manifestos/page/$(shuf -i1-7 -n1)/ | grep manifestos/[0-9] | grep -v page | rev | cut -d' ' -f1 | rev | shuf -n1)
    ;;
  [9])
    # Textfiles.com
    url=$(lynx -dump "https://github.com/opsxcq/mirror-textfiles.com/search?l=Text&p=$(shuf -i1-100 -n1)" | grep blob | shuf -n1 | sed -e 's/.*textfiles\.com/http:\/\/textfiles\.com/')
    ;;
  [8])
    # Wikipedia
    url="https://en.wikipedia.org/wiki/Special:Random"
    ;;
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
    linepattern='n;n;n;n;n;G;'
    ;;
  [3])
    linepattern='n;n;n;G;'
    ;;
  [2])
    linepattern='n;n;G;'
    ;;
  *)
    linepattern='n;n;n;n;G;'
    ;;
esac;

# generate poem
lynx -dump -nolist ${url} | awk 'NF>=10' | sed -e "s/\[[^\]]*\]//g" | sed -e "/^[ \t]*\*/d" | grep -o -E "[A-Za-z\'-]+" |\
  shuf | tr '\n' ' ' | fold -sw $(shuf -i 60-100 -n1) |\
  shuf -n $(shuf -i 3-10 -n1) | fold -sw $(shuf -i 13-30 -n1) |\
  sed "${linepattern}"

# pipe-by-by rundown:
# Fetch & Clean Article
# 1: lynx: dump contents of URL
# 2: awk: clear all lines less than 10 words long (assume shorter lines are links/navigation/etc, and longer lines are content)
# 3: sed: remove lynx-syntax images
# 4: sed: normalize multiple whitespace characters
# 5: grep: only keep letters ' and -
# Put in bag & Shake
# 6: snuf: shuffle lines
# Pull out words (not quite one-at-a-time, but forced into the shape of a poem)
# 7: tr: convert to one long line
# 8: fold: fold text into lines 60-100 characters long (mindful not to split words)
# 9: shuf: shuffle lines, only return 3-10 of them
# 10: fold: fold text into lines 13-30 characters long (mindful not to split words)
# 11: sed: split text into stanzas 3-6 lines long

echo "\n\n	by T.T(Y)zara\n	(from ${url})"

