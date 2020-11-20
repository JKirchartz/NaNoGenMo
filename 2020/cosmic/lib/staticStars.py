#! /usr/bin/env python
# -*- coding: utf-8 -*-
# vim:fenc=utf-8
#
# Copyleft (ↄ) 2020 jkirchartz <me@jkirchartz.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.

"""
 modified animation-less version of https://github.com/peterbrittain/asciimatics/blob/master/asciimatics/effects.py
"""
from asciimatics.effects import Effect
from random import randint


class _SStar(object):
    """
    Simple class to represent a single star for the Stars special effect.
    """

    def __init__(self, screen, pattern):
        """
        :param screen: The Screen being used for the Scene.
        :param pattern: All possible stars
        """
        self._screen = screen
        self._star_chars = pattern
        self._cycle = True
        self._old_char = None
        self._respawn()

    def _respawn(self):
        """
        Pick a random location for the star making sure it does
        not overwrite an existing piece of text.
        """
        self._cycle = randint(0, len(self._star_chars))
        (height, width) = self._screen.dimensions
        while True:
            self._x = randint(0, width - 1)
            self._y = self._screen.start_line + randint(0, height - 1)
            if self._screen.get_from(self._x, self._y)[0] == 32:
                break

    def update(self):
        """
        Draw the star.
        """
        if not self._screen.is_visible(self._x, self._y):
            self._respawn()

        if self._cycle:
            self._cycle = False
            new_char = self._star_chars[randint(0, len(self._star_chars) -1)]
            self._screen.print_at(new_char, self._x, self._y)


class StaticStars(Effect):
    """
    Add random stars to the screen and make them twinkle.
    """

    def __init__(self, screen, count, pattern="......++xx********   ", **kwargs):
        """
        :param screen: The Screen being used for the Scene.
        :param count: The number of starts to create.
        :param pattern: The string pattern for the stars to loop through
        Also see the common keyword arguments in :py:obj:`.Effect`.
        """
        super(StaticStars, self).__init__(screen, **kwargs)
        self._pattern = pattern
        self._max = count
        self._stars = []
        self._donce = 0

    def reset(self):
        self._stars = [_SStar(self._screen, self._pattern) for _ in range(self._max)]

    def _update(self, frame_no):
        if self._donce == 0:
            self._donce += 1
            for star in self._stars:
                star.update()
        else:
            self.reset()

    @property
    def stop_frame(self):
        return 0
