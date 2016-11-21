#! /bin/sh
#
# eesmith.sh
# Usage:
#
# $>eesmith.sh output.txt [first|last|min|max|avg|avg2]
#
# will produce file ./output/output.txt
#
# arguments (listed within square brackets) specify phrasechain's various algorithms
# the default algorithm is "first", and it is the fastest
# see https://raw.githubusercontent.com/enkiv2/misc/master/phrasechain/README.md
# for more details
#
# Copyleft (ↄ) 2015 kirch <kirch@arp>
#
# Distributed under terms of the NPL (Necessary Public License) license.
#


if [ -z "$1" ]; then
	echo "Usage:"
	echo "eesmith.sh output.txt [first|last|min|max|avg|avg2]"
	echo "will produce file ./output/output.txt"
	echo "optional arguments set which of phrasechain's various algorithms should be used"
	echo "default setting is \"first\", and it is the fastest"
	echo "see https://raw.githubusercontent.com/enkiv2/misc/master/phrasechain/README.md for more details"
else
	mkdir -p corpora
	mkdir -p output
	if [ ! -f ./corpora/eesmith.corpus ]; then
		echo "downloading sources & generating corpora (this will only run once)"
		mkdir -p tmp
		wget -q -nc -i eesmith.list -P ./tmp

		echo "cleaning sources...."
		for file in ./tmp/*.txt; do
			title=$(grep Title: "$file" | head | cut -d' ' -f2- | sed -e 's|[^A-Za-z]||g')
			stripgutenberg.pl < "$file" > "./corpora/$title.txt"
		done

		echo "compiling corpora....."
		cat ./corpora/*.txt > ./corpora/eesmith.corpus
		echo "cleaning corpora....."
		vim ./corpora/eesmith.corpus -S cleanGcorpora.vim
		echo "cleaning temporary files...."
		rm -rf ./corpora/*.txt
		rm -rf ./tmp/
	fi

	echo "shuffling...."
	# python shuffle.py ./corpora/complete.corpus
	if [ -z "$2" ];then
		phrasechain.sh < ./corpora/eesmith.corpus > tmp.txt
	else
		phrasechain.sh "$2" < ./corpora/eesmith.corpus > tmp.txt
	fi

	echo "cleaning up..."
	fold -w 80 -s tmp.txt > output/"$1"
	rm -rf tmp.txt
	echo "generated ./output/$1"
	echo "word count:"
	wc -w output/"$1" | cut -d' ' -f1

fi
