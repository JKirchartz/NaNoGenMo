#
# makefile
# jkirchartz, 2019-11-03 21:44
#

corpus := "./tmp/corpus.txt"

all:
	@echo "makefile needs your attention"

dlcorpus:
	wget http://www.gutenberg.org/cache/epub/926/pg926.txt -P tmp/ --no-clobber
	tail -n 25469 tmp/pg926.txt | head -n 24777 > tmp/corpus.txt


dlimages:
	@echo "fetching images"
	mkdir -p tmp/
	./list-images.js >> tmp/img.cache
	sort -u tmp/img.cache > tmp/image.cache
	rm -rf tmp/img.cache


fetch:
	sort -R ./tmp/image.cache | head -n 5 > ./image.set
	wget -i ./tmp/image.set -P ./tmp/images/
	grep -v -x -f ./tmp/image.cache ./tmp/image.set

pos:
	pos2tracery pos /tmp/corpus.txt /tmp/corpus.json

publish:
	pandoc -o dist/book.epub tmp/*.md

clean:
	rm -rf tmp/

.PHONY: dlcorpus pos dlimages fetch publish clean
# vim:ft=make
#
