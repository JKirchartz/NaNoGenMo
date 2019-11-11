#! /bin/sh
#
# TT(Y)zara, a Tristan Tzara-style dadaist poetry generator.
#
# Copyleft (ↄ) 2019 jkirchartz <me@jkirchartz.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.
#

# I only made an article parser for NPR - should I modularize this a bit more I could do parsers for each site we've a case for.
# grab an article from:
# case $(( ( RANDOM % 4 )  + 1 )) in
#   4)
#       # Reuters
#       url=$(lynx -dump https://www.reuters.com/commentary | grep article | rev | cut -d' ' -f1 | rev | shuf | head -1);
#       ;;
#   3)
#       # NPR
#       url=$(lynx -dump https://text.npr.org/ | grep "=[7-9][7-9]" | rev | cut -d' ' -f1 | rev | shuf | head -n 1);
#       ;;
#   2)
#       # Christian Science Monitor
#       url=$(lynx -dump https://www.csmonitor.com/layout/set/text/textedition | grep \/20 | rev | cut -d' ' -f1 | rev | shuf | head -1);
#       ;;
#   1)
#       # CNN
#       url=$(lynx -dump https://lite.cnn.io/en | grep article | rev | cut -d' ' -f1 | rev | shuf | head -1);
#       ;;
# esac;


url=$(lynx -dump https://text.npr.org/ | grep "=[7-9][7-9]" | rev | cut -d' ' -f1 | rev | shuf | head -n 1);

# generate poem
lynx -dump ${url} | sed -ne '/·/,/©/p' | head -n -6 | grep -o -E "[A-Za-z\'-]+" |\
  shuf | tr '\n' ' ' | fold -sw 50 |\
  shuf | head -n 5 | fold -sw 20 |\
  sed 'n;n;n;n;G;'

echo "\n\n   by T.T(Y)zara.sh\n   (from ${url})"

