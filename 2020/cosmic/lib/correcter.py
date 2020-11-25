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
textcontents = open(sys.argv[1], 'r', encoding='unicode_escape')
text = textcontents.read()
textcontents.close()
tool.correct(text)
textfile = open(sys.argv[1], 'w', encoding='utf-8', newline='\n')
textfile.write(text)
textfile.truncate()
textfile.close()
