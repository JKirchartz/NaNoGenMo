#
# publish.makefile
# jkirchartz, 2019-11-29 22:33
#

DEST_DIR ?= dist
ISSUES != find . -path "./issues/*" -type d
DEST_PDF_FILES := $(ISSUES:./issues/%=$(DEST_DIR)/book-%.pdf)

pdf: $(DEST_PDF_FILES)

$(DEST_DIR)/book-%.pdf: output/%
	$(info building $@)
	pandoc -s \
	--from markdown \
	--toc \
	--smart \
	--wrap=preserve \
	--latex-engine=xelatex \
	--template=layout.tex \
	-o $@ \
	$</*.md

.PHONY: pdf

# vim:ft=make
#
