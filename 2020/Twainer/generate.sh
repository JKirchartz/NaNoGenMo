#! /bin/bash
#
# generate.sh
#
# Copyleft (ↄ) 2020 jkirchartz <me@jkirchartz.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.
#

source ./venv/bin/activate
echo "Picking a random story to use..."
filename=$(find tmp -type f -name story* | shuf -n 1)
head -n1 "$filename"
python twainer.py "$filename"
