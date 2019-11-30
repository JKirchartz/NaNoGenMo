#
# publish.makefile
#

DEST_DIR ?= books
ISSUES != find . -path "./output/*" -type d
DEST_PDF_FILES := $(ISSUES:./output/%=$(DEST_DIR)/book-%.pdf)

pdf: $(DEST_PDF_FILES)

$(DEST_DIR)/book-%.pdf: output/%
	$(info building $@)
	@pandoc \
	--standalone \
	--file-scope \
	--from markdown \
	--toc \
	--smart \
	--wrap=preserve \
	--latex-engine=xelatex \
	-o $@ \
	$</*.md


.PHONY: pdf

# vim:ft=make
#
