#
# makefile
# jkirchartz, 2019-11-03 21:44
#

# customizable output dir & FILENAME
DEST_DIR ?= dist
IGNOREPOS ?= IN VBP DT JJ

# find all issues and determine required output files
# DEST_PDF_FILES := $(ISSUES:./issues/%=$(DEST_DIR)/issue-%.pdf)
# DEST_EPUB_FILES := $(ISSUES:./issues/%=$(DEST_DIR)/issue-%.epub)

SHELL := /bin/bash
corpus = tmp/corpus.txt
defs = tmp/defs.txt

tracery = tmp/corpus.json
quote = tmp/dreams.json
soundextracery = tmp/soundex.corpus.json
defstracery = tmp/defs.corpus.json
mergedtracery = tmp/merged.corpus.json

ISSUE := $(shell echo $(($(find . -path "./issues/*" -type d | sed -e 's/[^0-9]*//g' | sort -n | tail -n1) + 1)))
ifndef ISSUE
  ISSUE = 0
endif

FILENAME := issues/$(ISSUE)/book-$(ISSUE).md
outputfile := $(DEST_DIR)/book-$(ISSUE).pdf

all: setup dldata dlimages gentracery generate publish
write: setup generate publish

help:
	$(info make all     - download data, generate tracery files, and publish)
	$(info make write   - write a new book with existing data)

setup:
	$(info Generating Triptograph)
	$(info $(FILENAME) to $(outputfile))
	mkdir -p ./tmp/images $(DEST_DIR) ./issues/$(ISSUE)
	touch ./tmp/image.cache

dlimages:
	if [ $(shell wc -l ./tmp/image.cache | cut -d' ' -f1) -lt 5 ]; then \
	echo "caching images"; \
	./list-images.js >> tmp/img.cache; \
	sort -u tmp/img.cache > tmp/image.cache; \
	fi
	$(info fetch 15 images from cache)
	sort -R ./tmp/image.cache | head -n 15 > ./tmp/image.set
	wget -nv -i ./tmp/image.set -P ./tmp/images/
	$(info remove 15 DL\'d images from cache)
	diff ./tmp/image.set ./tmp/image.cache | grep "^>" | cut -c3- > ./tmp/image.cache

dldata:
	$(info downloading corpus)
	-wget http://www.gutenberg.org/cache/epub/926/pg926.txt -P tmp/ --no-clobber
	-wget https://www.gutenberg.org/files/60045/60045-0.txt  -P tmp/ --no-clobber
	@tail -n 25469 tmp/pg926.txt | head -n 24777 > $(corpus)
	@tail -n 23297 $(corpus) > $(defs)
	@tail -n 13962 tmp/60045-0.txt | head -n 320 >> $(corpus)
	@tail -n 13029 tmp/60045-0.txt | head -n 7647 >> $(defs)

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
