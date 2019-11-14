#! /bin/sh
#
# TT(Y)zara, a Tristan Tzara-style dadaist poetry generator.
#
# Copyleft (ↄ) 2019 jkirchartz <me@jkirchartz.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.
#

# default to NPR
url=$(lynx -dump https://text.npr.org/ | grep "=[7-9][7-9]" | rev | cut -d' ' -f1 | rev | shuf | head -n 1);
# grab an article from:
case $(( ( RANDOM % 5 )  + 1 )) in
  5)
    # Lobsters
    url=$(lynx -dump https://lobste.rs/newest | grep -v "lobste" | grep [[:digit:]] | rev | cut -d' ' -f1 | rev | grep http | shuf -n1)
    ;;
  4)
    # Reuters
    url=$(lynx -dump https://www.reuters.com/commentary | grep article | rev | cut -d' ' -f1 | rev | shuf -n1);
    ;;
  3)
    # NPR
    url=$(lynx -dump https://text.npr.org/ | grep "=[7-9][7-9]" | rev | cut -d' ' -f1 | rev | shuf -n 1);
    ;;
  2)
    # Christian Science Monitor
    url=$(lynx -dump https://www.csmonitor.com/layout/set/text/textedition | grep \/20 | rev | cut -d' ' -f1 | rev | shuf -n1);
    ;;
  1)
    # CNN
    url=$(lynx -dump https://lite.cnn.io/en | grep article | rev | cut -d' ' -f1 | rev | shuf -n1);
    ;;
esac;

# generate poem
lynx -dump -nolist ${url} | grep -o -E "[A-Za-z\'-]+" |\
  shuf | tr '\n' ' ' | fold -sw $(shuf -i 40-200 -n1) |\
  shuf -n $(shuf -i 3-10 -n1) | fold -sw $(shuf -i 10-60 -n1) |\
  sed 'n;n;n;n;G;'

echo "\n\n   by T.T(Y)zara.sh\n   (from ${url})"

