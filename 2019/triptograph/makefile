#
# makefile
# jkirchartz, 2019-11-03 21:44
#

# customizable output dir & FILENAME
DEST_DIR ?= dist
FILENAME ?= $(shell mktemp ./tmp/book.XXX.md)
IGNOREPOS ?= IN,VBP,DT,JJ

# find all issues and determine required output files
# ISSUES != find . -path "./issues/*" -type d
# DEST_PDF_FILES := $(ISSUES:./issues/%=$(DEST_DIR)/issue-%.pdf)
# DEST_EPUB_FILES := $(ISSUES:./issues/%=$(DEST_DIR)/issue-%.epub)

SHELL := /bin/bash
dirs := $(shell mkdir -p tmp $(DEST_DIR))
outputfile := $(shell mktemp ./$(DEST_DIR)/book.XXX.pdf)
corpus = ./tmp/corpus.txt
defs = ./tmp/defs.txt

tracery = ./tmp/corpus.json
quote = ./tmp/dreams.json
soundextracery = ./tmp/soundex.corpus.json
defstracery = ./tmp/defs.corpus.json
mergedtracery = ./tmp/merged.corpus.json

define newfile =
	files=$(wildcard tmp/*.md)
endef

all: msg dldata gentracery generate publish
write: msg generate publish

help:
	$(info make all     - download data, generate tracery files, and publish)
	$(info make write   - write a new book with existing data)

msg:
	$(info Generating Triptograph)

dlimages:
	if [ $(shell wc -l ./tmp/image.cache | cut -d' ' -f 1) -lt 5 ]; then
	  $(info downloading images)
	  ./list-images.js >> tmp/img.cache;
	  sort -u tmp/img.cache > tmp/image.cache;
	fi
	$(info fetch 5 images from cache)
	sort -R ./tmp/image.cache | head -n 5 > ./tmp/image.set
	-wget -nv -i ./tmp/image.set -P ./tmp/images/
	$(info remove 5 DL\'d images from cache)
	diff ./tmp/image.set ./tmp/image.cache | grep "^>" | cut -c3- > ./tmp/image.cache

dldata:
	$(info downloading corpus)
	-wget http://www.gutenberg.org/cache/epub/926/pg926.txt -P tmp/ --no-clobber
	-wget https://www.gutenberg.org/files/60045/60045-0.txt  -P tmp/ --no-clobber
	@tail -n 25469 tmp/pg926.txt | head -n 24777 > $(corpus)
	@tail -n 23297 $(corpus) > $(defs)
	@tail -n 13962 tmp/60045-0.txt | head -n 320 >> $(corpus)
	@tail -n 13029 tmp/60045-0.txt | head -n 7647 >> $(defs)
	$(call dlimages)

gentracery:
	$(info generating tracery)
	pos2tracery pos ./dreams.corpus ./tmp/dreams.json -m -s l -i "$(IGNOREPOS)"
	pos2tracery pos $(corpus) $(tracery) -m -i "$(IGNOREPOS)"
	pos2tracery pos $(defs) $(defstracery) -m -s p -i "$(IGNOREPOS)"
	pos2tracery soundex $(corpus) $(soundextracery)
	pos2tracery merge $(defstracery) $(tracery) $(mergedtracery)

generate:
	$(info generating book)
	./writeBook.sh $(FILENAME)

publish:
	$(info publishing book)
	@mkdir -p dist
	@pandoc $(FILENAME) \
	  -s \
	  --table-of-contents \
	  --smart \
	  --wrap=preserve \
	  --latex-engine=xelatex \
	  --template=layout.tex \
	  -o $(outputfile)

clean:
	$(info cleaning up tmp files)
	@rm -rf tmp/

.PHONY: all

# vim:ft=make
