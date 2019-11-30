#
# makefile
# jkirchartz, 2019-11-27 21:32
#


ISSUE := $(shell echo $$(($$(find . -path "./output/*" -type d | sed -e 's/[^0-9]*//g' | sort -n | tail -n1) + 1)))
ifndef ISSUE
  ISSUE = 0
endif

new: init generate publish

init:
	mkdir -p books corpora output/$(ISSUE) sources
	./init.sh

generate:
	node ./generate.js $(ISSUE)

publish:
	$(MAKE) -f ./publish.makefile

clean:
	rm -rf ./sources ./corpora ./books ./output

.PHONY: new init generate publish clean

# vim:ft=make
#
