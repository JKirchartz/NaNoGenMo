#
# Makefile
# jkirchartz, 2020-11-27 09:18
#

.ONESHELL:

.PHONY: all

install:
	source ./venv/bin/activate
	pip install -r requirements.txt
	mkdir -p tmp
	mkdir -p output

setup:
	./get_stories.sh

generate:
	./generate.sh

all: setup generate

# vim:ft=make
#
