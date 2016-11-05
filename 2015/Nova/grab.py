#! /usr/bin/env python
# -*- coding: utf-8 -*-
# vim:fenc=utf-8
#
# Copyleft (ↄ) 2015 jkirchartz <jkirchartz@jkirchartz0.pit.corp.google.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.

from pyquery import PyQuery

base_url = "http://www.pbs.org"
list_url = "%s/wgbh/nova/transcripts/year_" % base_url
start_date = 1995
end_date = 2010

def grabber(year=start_date):
    url = "%s%s.html" % (list_url, year)
    PQ = PyQuery(url)
    BQ = PQ("#d_feature_copy p")
    for x in BQ.children("a"):
        transcript_url = PyQuery(x).attr('href')
        TQ = PyQuery(base_url + transcript_url)
        TS = TQ('#feature_copy, .twiddle-body .transcript')
        print "\n\n"
        print TS.find('h1').eq(0).text() #headings/titles
        for p in TS.children("p"):
            print p.content + "\n"

    if year < end_date:
        grabber(year+1)

grabber()

