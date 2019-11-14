#! /bin/bash
#
# headings.sh
#
# Copyleft (ↄ) 2019 jkirchartz <me@jkirchartz.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.
#



for FILE in ./tmp/*.md; do
  [[ "$(head -c 1 $FILE)" = "\#" ]] && sed -i '1i\# $(shuf -n1 /usr/share/dict/words)' $FILE;
done;
# [ head -c $$FILE -neq "\#" ] && sed -i '1i\# $(pos2tracery generate $(corpus))' $$FILE
