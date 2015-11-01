#! /usr/bin/env python
# -*- coding: utf-8 -*-
# vim:fenc=utf-8
#
# Copyleft (ↄ) 2015 jkirchartz<jkirchartz@jkirchartz0.pit.corp.google.com>
# modifications by Jermey on #botALLY
# Distributed under terms of the NPL (Necessary Public License) license.

from __future__ import print_function
from pyquery import PyQuery as pq

BASE_URL = "http://www.pbs.org"
LIST_URL = "%s/wgbh/nova/transcripts/year_" % BASE_URL
START_DATE = 1995
END_DATE = 2010
DELIMITER = "nevergonnaletyoudownnevergonnagiveyouup"


def grabber():
    for year in range(START_DATE, END_DATE):
        print(year)
        year_archive_url = "%s%s.html" % (LIST_URL, year)
        html = pq(year_archive_url)
        episode_links = html("#d_feature_copy p")
        for episode_link in episode_links.children("a"):
            transcript_url = pq(episode_link).attr('href')
            print(transcript_url)

            transcript_html = pq(BASE_URL + transcript_url)

            transcript_copy = transcript_html('#d_feature_copy')
            print("\n\n")
            print(transcript_copy.find('h1').text())

            for p in transcript_copy.find("p"):
                print(p.text + "\n")
            print(DELIMITER, "\n", "="*150)

if __name__ == '__main__':
    grabber()
    print(DELIMITER)
