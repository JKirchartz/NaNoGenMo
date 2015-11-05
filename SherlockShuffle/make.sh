#! /bin/sh
#
# make.sh
#
# Copyleft (ↄ) 2015 kirch <kirch@arp>
#
# Distributed under terms of the NPL (Necessary Public License) license.
#

mkdir corpora
mkdir sources
mkdir tmp

echo "downloading..."
./download.sh

echo "converting...."
./convert.sh

echo "shuffling...."
./python shuffle.py ./corpora/*.txt

