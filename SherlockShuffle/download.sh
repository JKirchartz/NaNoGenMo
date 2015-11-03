#! /bin/sh
#
# download.sh
# download everything in ./doyle.list
# Copyleft (ↄ) 2015 jkirchartz <jkirchartz@gmail.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.
#
# Project Gutenberg doesn't really like this, so you only have 1 shot before you get 403'd
#

wget -i doyle.list -P ./sources
