#! /usr/bin/env bash
#
# make.sh
#
# Copyleft (ↄ) 2018 jkirchartz <me@jkirchartz.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.
#

BOOK=${1?Error: no output file given}

node index.js 2>/dev/null > "$BOOK"
