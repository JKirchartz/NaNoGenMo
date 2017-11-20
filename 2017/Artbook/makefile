#
# makefile
# jkirchartz, 2017-11-12 21:45
#

all:
	wget --no-parent -r -l 1 -p http://www.391.org/manifestos/
	node tagger.js
	node index.js

get:
	wget --no-parent -r -l 1 -p http://www.391.org/manifestos/

corpora:
	node tagger.js

book:
	node index.js

# vim:ft=make
#
