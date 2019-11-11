#
# makefile
# jkirchartz, 2019-11-03 21:44
#

filename := $(shell mktemp ./tmp/tmp.XXX.md)
corpus = ./tmp/corpus.txt
tracery = ./tmp/corpus.json

all: msg dldata gentracery dlimages pos poem pos poem pos poem pos poem pos poem pos poem publish

msg:
	@echo "Generating Triptograph"

dldata:
	@echo "downloading corpus"
	-wget http://www.gutenberg.org/cache/epub/926/pg926.txt -P tmp/ --no-clobber
	@tail -n 25469 tmp/pg926.txt | head -n 24777 > $(corpus)
	@echo "downloading images"
	@./list-images.js >> tmp/img.cache
	@sort -u tmp/img.cache > tmp/image.cache

gentracery:
	@echo "generating tracery"
	@pos2tracery pos $(corpus) $(tracery) -m

dlimages:
	@sort -R ./tmp/image.cache | head -n 5 > ./tmp/image.set
	-wget -i ./tmp/image.set -P ./tmp/images/
	# @grep -v -x -f ./tmp/image.cache ./tmp/image.set
	diff ./tmp/image.cache ./tmp/image.set | grep "^>" | cut -c3- > ./tmp/image.cache

pos:
	@echo "generating from grammar"
	@pos2tracery generate ./tmp/corpus.json -m > $(filename)

poem:
	@echo "generating from TTYzara"
	@./TTYzara.sh > $(filename)

publish:
	@echo "publishing book"
	@mkdir -p dist
	@pandoc -o dist/book.epub --toc tmp/*.md

clean:
	@echo "cleaning up tmp files"
	@rm -rf tmp/

# vim:ft=make
#
