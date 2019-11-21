#! /bin/bash
#
# download.sh
#
# Copyleft (ↄ) 2019 jkirchartz <me@jkirchartz.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.
#


wget -i dreams.list -P ./tmp/ -c

for FILE in ./tmp/*.txt; do
  ./BBK_corpus.sh "$FILE"
done
