#! /usr/bin/env python
# -*- coding: utf-8 -*-
# vim:fenc=utf-8
#
# Copyleft (ↄ) 2020 jkirchartz <me@jkirchartz.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.

"""
Correct spelling and grammar of provided file
"""

import sys
import language_tool_python
tool = language_tool_python.LanguageTool('en-US')
textfile = open(sys.argv[1], 'w')
text = textfile.read()
tool.correct(text)
textfile.write(text)
textfile.close()
