#! /bin/bash
#
# get_stories.sh
#
# Copyleft (ↄ) 2020 jkirchartz <me@jkirchartz.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.
#

echo "Grabbing Joyce's 'The Dubliners' from Project Gutenberg"
mkdir -p tmp
curl -sN http://www.gutenberg.org/files/2814/2814-0.txt | tail -n +59 | head -n 7877 | sed -e 's/\r//' > tmp/complete.txt
echo "Splitting 'The Dubliners' into individual short stories"
awk -v RS='\n\n\n\n\n' '{print > ("tmp/story-" NR ".txt")}' tmp/complete.txt



