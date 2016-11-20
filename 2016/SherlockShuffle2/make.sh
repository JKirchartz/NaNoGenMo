#! /bin/sh
#
# make.sh
#
# Copyleft (ↄ) 2015 kirch <kirch@arp>
#
# Distributed under terms of the NPL (Necessary Public License) license.
#


if [ ! -f ./corpora/complete.corpus ]; then
	mkdir corpora
	mkdir sources
	mkdir tmp
	echo "downloading..."
	wget -nc -i doyle.list -P ./sources

	echo "converting...."
	for file in ./sources/*.txt; do
		title=$(grep Title: "$file" | head | cut -d' ' -f2- | sed -e 's|[^A-Za-z]||g')
		stripgutenberg.pl < "$file" > "./corpora/$title.txt"
	done

	echo "compiling corpora....."
	cat ./corpora/*.txt > ./corpora/complete.corpus
	echo "cleaning corpora....."
	vim -c "source cleanGcorpora.keys | wqa" ./corpora/complete.corpus
fi

if [ -z "$@" ]; then
	echo "shuffling...."
	# python shuffle.py ./corpora/complete.corpus
	phrasechain.sh < ./corpora/complete.corpus > "$@"

	echo "cleaning output..."
	vim -c "norm gggqG|wqa" "$@"

else
	echo "Usage:"
	echo "make.sh /path/to/output.txt"
fi
