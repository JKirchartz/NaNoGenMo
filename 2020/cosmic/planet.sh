#! /bin/bash
#
# planet.sh
#
# Copyleft (ↄ) 2020 jkirchartz <me@jkirchartz.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.
#

RANDOM=$(date +%N | cut -b4-9) # re-seed RANDOM

chars="@#::::::::::::::::::::...........                  "
stars="..*                                                                    "

space=$(cat <<'EOF'
yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
yyyyyyyyyyyyyyyyyyyyyyyy..----..yyyyyyyyyyyyyyyyyyyyyyyyyyyy
yyyyyyyyyyyyyyyyyyyyy.``xxxxxxxx``.yyyyyyyyyyyyyyyyyyyyyyyyy
yyyyyyyyyyyyyyyyyyy.`xxxxxxxxxxxxxx`.yyyyyyyyyyyyyyyyyyyyyyy
yyyyyyyyyyyyyyyyy.|xxxxxxxxxxxxxxxxxx|.yyyyyyyyyyyyyyyyyyyyy
yyyyyyyyyyyyyyyyy|xxxxxxxxxxxxxxxxxxxx|yyyyyyyyyyyyyyyyyyyyy
yyyyyyyyyyyyyyyyy|xxxxxxxxxxxxxxxxxxxx|yyyyyyyyyyyyyyyyyyyyy
yyyyyyyyyyyyyyyyy`|xxxxxxxxxxxxxxxxxx|'yyyyyyyyyyyyyyyyyyyyy
yyyyyyyyyyyyyyyyyyy`.xxxxxxxxxxxxxxx.'yyyyyyyyyyyyyyyyyyyyyy
yyyyyyyyyyyyyyyyyyyyy`..xxxxxxxxx..'yyyyyyyyyyyyyyyyyyyyyyyy
yyyyyyyyyyyyyyyyyyyyyyy`--____--'yyyyyyyyyyyyyyyyyyyyyyyyyyy
yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy

EOF
)

randomChar() {
  # RANDOM=$(date +%N | cut -b4-9) # re-seed RANDOM
  echo "${chars:RANDOM%${#chars}:1}"
}

randomStar() {
  # RANDOM=$(date +%N | cut -b4-9) # re-seed RANDOM
  echo "${stars:RANDOM%${#stars}:1}"
}

string="${space//[^y]/}"
count="${#string}"
while [ "$count" -gt 0 ]; do
  space=$(sed -e "1,/y/ s/y/$(randomStar)/" <<< "$space")
  space=$(sed -e "1,/x/ s/x/$(randomChar)/" <<< "$space")
  count=$((count - 1))
done

echo "$space"
