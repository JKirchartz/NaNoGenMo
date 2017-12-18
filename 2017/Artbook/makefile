#
# makefile
# jkirchartz, 2017-11-12 21:45
#

all: get clean corpora book

js: corpora book

get:
	wget -c --no-parent -r -l 1 -A '*manifesto*' http://www.391.org/manifestos/ || true && \
	wget -c -r -A '*manifesto*' http://www.textfiles.com/ || true && \

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
