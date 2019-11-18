#
# makefile
# jkirchartz, 2019-11-03 21:44
#

dirs := $(shell mkdir -p tmp dist)
filename := $(shell mktemp ./tmp/book.XXX.md)
outputfile := $(shell mktemp ./dist/book.XXX.epub)
corpus = ./tmp/corpus.txt
defs = ./tmp/defs.txt
tracery = ./tmp/corpus.json
soundextracery = ./tmp/soundex.corpus.json
defstracery = ./tmp/defs.corpus.json
mergedtracery = ./tmp/merged.corpus.json

all: msg dldata gentracery generate publish

msg:
	@echo "Generating Triptograph"

define dlimages =
	if [ $(shell wc -l ./tmp/image.cache | cut -d' ' -f 1) -lt 5 ]; then\
	  echo "downloading images";\
	  ./list-images.js >> tmp/img.cache;\
	  sort -u tmp/img.cache > tmp/image.cache;\
	fi
	@echo "fetch 5 images from cache"
	sort -R ./tmp/image.cache | head -n 5 > ./tmp/image.set
	-wget -nv -i ./tmp/image.set -P ./tmp/images/
	@echo "remove 5 DL'd images from cache"
	diff ./tmp/image.set ./tmp/image.cache | grep "^>" | cut -c3- > ./tmp/image.cache
endef

define imagegen =
	$(shell ./imagegen.js)
endef

dldata:
	@echo "downloading corpus"
	-wget http://www.gutenberg.org/cache/epub/926/pg926.txt -P tmp/ --no-clobber
	@tail -n 25469 tmp/pg926.txt | head -n 24777 > $(corpus)
	@tail -n 23297 $(corpus) > $(defs)
	$(dlimages)

gentracery:
	@echo "generating tracery"
	pos2tracery pos $(corpus) $(tracery) -m
	pos2tracery pos $(defs) $(defstracery) -m -s p
	pos2tracery merge $(defstracery) $(tracery) $(mergedtracery)
	pos2tracery soundex $(corpus) $(soundextracery)


generate:
	@echo "generating segments"
	@echo "\#Triptograph: $(shuf -n1 /usr/share/dict/words)" >> $(filename)
	@echo "\#\#$(shuf -n1 /usr/share/dict/words)" >> $(filename)
	@echo -n "![]($(value imagegen))" >> $(filename)
	$(dlimages)
	@pos2tracery generate $(corpus) -m >> $(filename)
	@echo "\#\#$(shuf -n1 /usr/share/dict/words)" >> $(filename)
	@echo -n "![]($(value imagegen))" >> $(filename)
	$(dlimages)
	@./TTYzara.sh >> $(filename)
	@echo "\#\#$(shuf -n1 /usr/share/dict/words)" >> $(filename)
	@echo -n "![]($(value imagename))" >> $(filename)
	@$(dlimages)
	@pos2tracery generate $(mergedtracery) -m >> $(filename)
	@echo "\#\#$(shuf -n1 /usr/share/dict/words)" >> $(filename)
	@echo -n "![]($(value imagegen))" >> $(filename)
	@$(dlimages)
	@./TTYzara.sh >> $(filename)
	@echo "\#\#$(shuf -n1 /usr/share/dict/words)" >> $(filename)
	@echo -n "![]($(value imagegen))" >> $(filename)
	@$(dlimages)
	@pos2tracery generate $(soundextracery) >> $(filename)
	@echo "\#\#$(shuf -n1 /usr/share/dict/words)" >> $(filename)
	@echo -n "![]($(value imagegen))" >> $(filename)
	@$(dlimages)
	@./TTYzara.sh >> $(filename)

publish:
	@echo "publishing book"
	@mkdir -p dist
	# @pandoc $(filename) -s --toc --smart --wrap=preserve --latex-engine=xelatex --template=layout.tex -o $(outputfile)
	# @pandoc $(filename) --toc --wrap=preserve -o $(outputfile)
	@pandoc $(filename) --toc -o $(outputfile)

clean:
	@echo "cleaning up tmp files"
	@rm -rf tmp/

# vim:ft=make
#
