#
# publish.makefile
# jkirchartz, 2019-11-29 22:33
#

DEST_DIR ?= dist
ISSUES != find ./issues/* -type d | grep -v images
DEST_PDF_FILES := $(ISSUES:./issues/%=$(DEST_DIR)/issue-%.pdf)

$(DEST_DIR)/issue-%.pdf: issues/%
	$(info building $@)
	pandoc -s \
	--from markdown-smart \
	--toc \
	--wrap=preserve \
	--pdf-engine=xelatex \
	--template=layout.tex \
	-o $@ \
	$</*.md

pdf: $(DEST_PDF_FILES)

clean:
	$(info removing build artifacts)
	@rm $(DEST_DIR)/issue-*

.PHONY: clean pdf

# vim:ft=make
#
