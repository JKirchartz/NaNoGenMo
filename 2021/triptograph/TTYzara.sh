#! /bin/bash
#
# TT(Y)zara, a Tristan Tzara-style dadaist poetry generator.
#
# Copyleft (ↄ) 2019 jkirchartz <me@jkirchartz.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.
#

# set -o xtrace

# grab an article from:
content=""
while [ -z "$content" ]; do
  num=$(shuf -i0-11 -n1)
  case "$num" in
    [1][1])
      # Flowers of Evil
      url=$(lynx -dump https://fleursdumal.org/alphabetical-listing | grep https.*poem | rev | cut -d' ' -f1 | rev | shuf -n1)
      content=$(lynx -nolist -dump $url | sed -n '/Fleurs du mal/,/Navigation/{//!p}')
      ;;
    [1][0])
      # Public Domain Poetry
      url=$(lynx -dump https://www.public-domain-poetry.com/ | rev | cut -d' ' -f1 | rev | grep https://www.*[[:digit:]] | tail -n +2 | shuf -n1)
      content=$(lynx -dump $url | sed -n '/By \[/,/Extra Info:/{//!p}')
      ;;
    [9])
      # Textfiles.com
      url=$(lynx -dump "https://github.com/opsxcq/mirror-textfiles.com/search?l=Text&p=$(shuf -i1-100 -n1)" | grep blob | shuf -n1 | sed -e 's/.*textfiles\.com/http:\/\/textfiles\.com/')
      content=$(lynx -nolist -dump $url)
      ;;
    [8])
      # Wikipedia
      url=$(wget -qSO- https://en.wikipedia.org/wiki/Special:Random 2>&1 | grep Location | head -n1 | rev | cut -d' ' -f1 | rev)
      content=$(lynx -nolist -dump $url | sed -n '/Contents/,/Categories:/{//!p}')
      ;;
    [7])
      # NPR
      url=$(lynx -dump -listonly https://text.npr.org/ | grep [0-9][0-9][0-9][0-9][0-9] | rev | cut -d' ' -f1 | rev | shuf -n 1);
      content=$(lynx -nolist -dump $url |  sed -n '/_______/,/Topics\n/{//!p}')
      ;;
    # [6]) RETIRED: some pages return PDFs or other useless data
    #   # 391.org dada manifestos
    #   url=$(lynx -dump https://391.org/manifestos/page/$(shuf -i2-8 -n1)/ | grep manifestos/[0-9] | grep -v page | rev | cut -d' ' -f1 | rev | shuf -n1)
    #   content=$(lynx -nolist -dump $url | sed -n '/Manifesto\s+\n\s+by/,/Published in/{//!p}')
    #   ;;
    [6])
      # The Anarchist Library
      url=$(lynx -dump -listonly https://theanarchistlibrary.org/stats/popular/$(shuf -i1-638 -n1) | grep \/library\/ | rev | cut -d' ' -f1 | rev | shuf -n1);
      content=$(lynx -nolist -dump $url | sed -n '/* Add a new text/,/Random.*RSS feed.*Titles/{//!p}')
    ;;
    [5])
      # Reuters
      url=$(lynx -dump https://www.reuters.com/commentary | grep article | rev | cut -d' ' -f1 | rev | shuf -n1);
      content=$(lynx -nolist -dump $url | sed -n '/Slideshow/,/About the Author/{//!p}')
      ;;
    [4])
      # Christian Science Monitor
      url=$(lynx -dump https://www.csmonitor.com/layout/set/text/textedition | grep \/20 | rev | cut -d' ' -f1 | rev | shuf -n1);
      content=$(lynx -nolist -dump $url | sed -n '/By[^|]+\|/,/Full HTML version/{//!p}')
      ;;
    [3])
      # CNN
      url=$(lynx -dump https://lite.cnn.io/en | grep article | rev | cut -d' ' -f1 | rev | shuf -n1);
      content=$(lynx -nolist -dump $url | sed -n '/Source:/,/_____/{//!p}')
      ;;
    [2])
      # Folding Story
      url=$(lynx -dump http://foldingstory.com/read/ | grep http | tail -n 10 | rev | cut -d' ' -f1 | rev | shuf -n1)
      content=$(lynx -nolist -dump "${url}/full/" | sed -n '/Paragraph/,/\* Started by/{//!p}')
      ;;
    [1])
      # Popular Mechanics
      url=$(lynx -listonly -dump https://www.popularmechanics.com/ | grep [a-z][0-9][0-9][0-9][0-9][0-9] | rev | cut -d' ' -f1 | rev | sort -u | shuf -n 1)
      content=$(lynx -nolist -dump "${url}" | sed -n '/Type keyword(s)/,/(BUTTON)/{//!p}')
      ;;
    *)
      # Dreams
      url=$(lynx -dump http://www.dreamjournal.net/main/dreams.cfm?timeframe=month | grep /journal/ | grep -v /user/ | shuf -n1 | rev | cut -d' ' -f1 | rev)
      content=$(lynx -nolist -dump $url | sed -n '/Views:/,/Themes\n/{//!p}')
      ;;
  esac;
done;

linepattern=''
numpatterns=$(shuf -i2-5 -n1)
for i in {1..$numpatterns}; do
  pattern=$(shuf -i1-5 -n1)
  case $pattern in
    [5])
      linepattern="${linepattern}n;G;"
      ;;
    [4])
      linepattern="${linepattern}n;n;n;n;n;G;"
      ;;
    [3])
      linepattern="${linepattern}n;n;n;G;"
      ;;
    [2])
      linepattern="${linepattern}n;n;G;"
      ;;
    *)
      linepattern="${linepattern}n;n;n;n;G;"
      ;;
  esac;
done;

# generate poem
FLIP=$(($(($RANDOM%10))%2))
if [ $FLIP -eq 1 ];then
  echo -e "$content" | sed -e "s/\[[^\]]*\]//g" | sed -e "/^[ \t]*\*/d" | grep -o -E "[A-Za-z\'-]+" |\
    shuf | tr '\n' ' ' | fold -sw $(shuf -i 20-90 -n1) |\
    shuf -n $(shuf -i 3-20 -n1) | tr '\n' ' ' | fold -sw $(shuf -i 20-100 -n1) |\
    sed "${linepattern}"
else
  echo -e "$content" | sed -e "s/\[[^\]]*\]//g" | sed -e "/^[ \t]*\*/d" | grep -o -E "[A-Za-z\'-]+" |\
    shuf | tr '\n' ' ' | fold -sw $(shuf -i 60-100 -n1) |\
    shuf -n $(shuf -i 3-20 -n1) | tr '\n' ' ' | fold -sw $(shuf -i 20-50 -n1) |\
    sed "${linepattern}"
fi

# pipe-by-by rundown:
# Fetch & Clean Article
# 1: lynx: dump contents of URL
# 3: sed: remove lynx-syntax images
# 4: sed: normalize multiple whitespace characters
# 5: grep: only keep letters ' and -
# Put in bag & Shake
# 6: snuf: shuffle words
# Pull out words (not quite one-at-a-time, but forced into the shape of a poem)
# 7: tr: convert to one long line
# 8: fold: fold text into lines 60-100 characters long (mindful not to split words)
# 9: shuf: shuffle lines, only return 3-20 of them
# 10: fold: fold text into lines 13-50 characters long (mindful not to split words)
# 11: sed: split text into stanzas 3-6 lines long

echo -e "\n\n	by T.T(Y)zara\n	(from ${url})"

