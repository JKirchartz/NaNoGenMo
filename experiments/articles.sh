#! /bin/sh
#
# articles.sh
#
# Copyleft (ↄ) 2020 jkirchartz <me@jkirchartz.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.
#



# grab an article from:
num=$(shuf -i1-10 -n1)
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
    url=$(lynx -dump https://www.reuters.com/ | grep article | rev | cut -d' ' -f1 | rev | shuf -n1);
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

lynx --dump -nolist "${url}"
