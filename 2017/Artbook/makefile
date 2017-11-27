#
# makefile
# jkirchartz, 2017-11-12 21:45
#

all: sources clean corpora book

get: sources clean

js: corpora book

sources:
	wget -c -r --no-clober -A '*manifesto*' http://www.textfiles.com/ || true && \
	wget -c --no-parent --no-clober -r -l 1 http://www.391.org/manifestos/ || true
	touch $@

clean:
	mkdir -p ./manifestos && \
	find www.textfiles.com -type f -name *.txt -exec mv '{}' ./manifestos/ \; &&\
	find www.391.org -type f -name *.html -exec mv '{}' ./manifestos/ \; &&\
	rm -rf www.textfiles.com www.391.org

corpora:
	node tagger.js

book:
	node index.js

# vim:ft=make
#
