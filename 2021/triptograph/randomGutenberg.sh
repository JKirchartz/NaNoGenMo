#! /bin/bash
# return the text of a random Project Gutenberg ebook

book=$(lynx -dump --listonly https://www.gutenberg.org/ebooks/search/?sort_order=random | grep "\\/ebooks\\/[0-9]" | rev | cut -d' ' -f1 | rev | shuf -n1)
url=$(lynx -dump --listonly "$book" | grep ".txt" | rev | cut -d' ' -f1 | rev)

lynx -dump --nolist "$url"

