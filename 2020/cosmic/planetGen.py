#! /usr/bin/env python
# -*- coding: utf-8 -*-
# vim:fenc=utf-8
#
# Copyleft (ↄ) 2020 jkirchartz <me@jkirchartz.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.

"""

"""

from math import sin, pi as PI
from time import time
import random, sys
import numpy as np
from asciimatics.screen import Screen
from asciimatics.scene import Scene
from asciimatics.effects import Effect
from asciimatics.renderers import ImageFile
from PIL import ImageDraw, Image, ImageOps
from opensimplex import OpenSimplex
from random import randint

class PrintInSpace(Effect):
    """
    Special effect that simply prints the specified text (from a Renderer) at
    the required location.
    """

    def __init__(self, screen, renderer, count, pattern="......++**** ", y=None,
            x=None, colour=7, attr=0, bg=0, clear=False, transparent=True, speed=4, **kwargs):
        """
        :param screen: The Screen being used for the Scene.
        :param renderer: The renderer to be printed.
        :param x: The column (x coordinate) for the start of the text.
            If not specified, defaults to centring the text on screen.
        :param count: The number of Stars to draw
        :param y: The line (y coordinate) for the start of the text.
        :param pattern: All possible Stars
        :param colour: The foreground colour to use for the text.
        :param attr: The colour attribute to use for the text.
        :param bg: The background colour to use for the text.
        :param clear: Whether to clear the text before stopping.
        :param transparent: Whether to print spaces (and so be able to overlay other Effects).
            If False, this will redraw all characters and so replace any Effect underneath it.
        :param speed: The refresh rate in frames between refreshes.
        Note that a speed of 1 will force the Screen to redraw the Effect every frame update, while a value
        of 0 will redraw on demand - i.e. will redraw every time that an update is required by another Effect.
        Also see the common keyword arguments in :py:obj:`.Effect`.
        """
        super(PrintInSpace, self).__init__(screen, **kwargs)
        self._screen = screen
        self._pattern = pattern
        self._max = count
        self._renderer = renderer
        self._transparent = transparent
        self._y = ((self._screen.height - renderer.max_width) // 2 if y is None
                else y)
        self._x = ((self._screen.width - renderer.max_width) // 2 if x is None
                   else x)
        self._colour = colour
        self._attr = attr
        self._bg = bg
        self._clear = clear
        self._speed = speed
        self._frame_no = 0
        self._stars = []

    def reset(self):
        self._stars = [_SStar(self._screen, self._pattern) for _ in range(self._max)]

    def _update(self, frame_no):
        self._frame_no = frame_no
        if self._clear and \
                (frame_no == self._stop_frame - 1) or (self._delete_count == 1):
            self.reset()
            for star in self._stars:
                star.update()
            for i in range(0, self._renderer.max_height):
                self._screen.print_at(" " * self._renderer.max_width,
                                      self._x,
                                      self._y + i,
                                      bg=self._bg)
        elif self._speed == 0 or frame_no % self._speed == 0:
            image, colours = self._renderer.rendered_text
            for star in self._stars:
                star.update()
            for (i, line) in enumerate(image):
                self._screen.paint(line, self._x, self._y + i, self._colour,
                                   attr=self._attr,
                                   bg=self._bg,
                                   transparent=self._transparent,
                                   colour_map=colours[i])


    @property
    def stop_frame(self):
        return self._stop_frame

    @property
    def frame_update_count(self):
        # Only demand update for next update frame.
        return self._speed - (self._frame_no % self._speed) if self._speed > 0 else 1000000

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

class Biome:
    which = 0 # random.randint(0,1)
    numlist= [0.1, 0.2, 0.3, 0.4, 0.5, 0.7, 0.9]
    palette = "default - colorful"
    ## COLORS
    WATER=[0,0,255,255]
    LAND=[0,255,0,255]
    BEACH=[255,400,175,255]
    FOREST=[50,255,50,255]
    JUNGLE=[80,255,80,255]
    SAVANNAH=[150,100,20,255]
    DESERT=[255,170,150,255]
    SNOW=[255,255,255,255]

    def __init__(self):
        self.which = random.randint(0,5) # make sure to keep this in-line with the number of generate options
        self.numlist= sorted([x/100 for x in random.sample(range(0, 100), 7)])
        paletteRand=random.randint(0,2)
        if paletteRand == 1:
            self.palette = "grayscale - dark"
            self.WATER=[255,255,255,255]
            self.LAND=[223,223,223,255]
            self.BEACH=[191,191,191,255]
            self.FOREST=[159,159,159,255]
            self.JUNGLE=[127,127,127,255]
            self.SAVANNAH=[95,95,95,255]
            self.DESERT=[63,63,63,255]
            self.SNOW=[31,31,31,255]
        elif paletteRand == 2:
            self.palette = "grayscale - light"
            self.WATER=[255,255,255,255]
            self.LAND=[239,239,239,255]
            self.BEACH=[223,223,223,255]
            self.FOREST=[207,207,207,255]
            self.JUNGLE=[191,191,191,255]
            self.SAVANNAH=[175,175,175,255]
            self.DESERT=[159,159,159,255]
            self.SNOW=[143,143,143,255]

    """ return a string of details about a certain biome """
    def style(self):
        return format("%s | %s | %s" % (self.which, self.numlist, self.palette))

    """ color a biome """
    def generate(self, e, m):
        if self.which == 0:
            if (e < self.numlist[4]):
                return self.WATER
            else:
                if (m < self.numlist[4]):
                    return self.LAND
                return self.DESERT
        elif self.which == 1:
            if (e < self.numlist[0]):
                return self.WATER
            elif (e < self.numlist[1]):
                return self.BEACH
            elif (e < self.numlist[2]):
                return self.FOREST
            elif (e < self.numlist[3]):
                return self.JUNGLE
            elif (e < self.numlist[4]):
                return self.SAVANNAH
            elif (e < self.numlist[6]):
                return self.DESERT
            return self.SNOW
        elif self.which == 2:
            if (e < self.numlist[1]):
                return self.SNOW
            elif (e < self.numlist[3]):
                if (m < self.numlist[4]):
                    return self.BEACH
                return self.DESERT
            elif (e < self.numlist[5]):
                if (m < self.numlist[4]):
                    return self.JUNGLE
                return self.FOREST
            return self.WATER
        elif self.which == 3:
            if (e < self.numlist[0]):
                return self.WATER
            elif (e < self.numlist[1]):
                return self.BEACH
            elif (e < self.numlist[3]):
                if (m < self.numlist[4]):
                    return self.FOREST
                return self.JUNGLE
            elif (e < self.numlist[6]):
                if (m < self.numlist[3]):
                    return self.DESERT
                elif (m > self.numlist[5]):
                    return self.SAVANNAH
                return self.SNOW
            return self.LAND
        if self.which == 4:
            if (e < self.numlist[4]):
                return self.WATER
            else:
                if (m < self.numlist[4]):
                    return self.SNOW
                return self.FOREST
        if self.which == 5:
            if (e < m):
                return self.WATER
            return self.SNOW

""" draw an image containing a biome """
def makeMap(height, width):
    # ideas from https://www.redblobgames.com/maps/terrain-from-noise/
    gen = OpenSimplex(random.randint(0,99999999))
    gen2 = OpenSimplex(int(time()))
    def noise(nx, ny):
        # Rescale from -1.0:+1.0 to 0.0:1.0
        return gen.noise2d(nx, ny) / 2.0 + 0.5
    def noise2(nx, ny):
        # Rescale from -1.0:+1.0 to 0.0:1.0
        return gen2.noise2d(nx, ny) / 2.0 + 0.5

    poles = random.random() / 2
    equator = (random.random() / 2) + 0.5
    value = []
    bio = Biome()
    island=random.randint(0,2)
    print("# island? %s | style? %s" % (island, bio.style()))

    for y in range(height):
        value.append([0] * width)
        for x in range(width):
            nx = x/width - 0.5
            ny = y/height - 0.5
            e = noise(nx, ny)
            m = noise2(nx, ny)
            if island == 1:
                e = 10*e*e + poles + (equator-poles) * sin(PI * (y / height))
            elif island == 2:
                d = abs(nx) + abs(ny)
                e = (1 + e - d) / 2
            value[y][x] = bio.generate(e , m)

    return np.array(value, dtype=np.uint8)

""" draw a planet graphic containing a biome """
def planet():
    surface=Image.fromarray(makeMap(400,400), mode="RGBA")
    pl=Image.new("RGBA", (400, 400), "#000000")
    draw=ImageDraw.Draw(pl)
    draw.ellipse((0, 0, 400, 400), fill="#FFFFFF")
    pl=pl.convert("L")
    output=ImageOps.fit(surface, pl.size, centering=(0.5, 0.5))
    output.putalpha(pl)
    output=output.convert("RGBA")
    output.save("./tmp/planet.png") # asciimatics seems to only take image files, not blobs


""" make ascii art """
def art():
    # generate a planet graphic
    planet()
    size=random.randint(10,20)
    screen=Screen.open(None)
    effects= [
        PrintInSpace(screen, ImageFile('./tmp/planet.png', size,
            screen.height/2 - size/2),
            (screen.width + screen.height) // 4),
        ]
    screen.set_scenes([Scene(effects , 500)])
    for i in range(0,10):
        screen.draw_next_frame()
    # screen.play([Scene(effects, duration=5, clear=False)], repeat=False)
    # print(screen)
    # print(screen.dimensions)
    doc = ""
    for y in range(0, screen.dimensions[0]):
        doc += "\n"
        for x in range(0, screen.dimensions[1]):
            code=screen.get_from(x, y) # returns a tuple, ascii = 0
            # if code is not None:
            doc += chr(code[0])
    f = open("./tmp/planet.txt", "w")
    f.write(doc)
    screen.close(True)
    f.close()

""" show ascii animation """
def animation(screen):
    # generate a planet graphic
    planet()
    size=random.randint(10,20)
    effects= [
        PrintInSpace(screen, ImageFile('./tmp/planet.png', size), (screen.width + screen.height) // 4),
        ]
    screen.play([Scene(effects , 500)])

if __name__ == "__main__":
    if len(sys.argv) > 1:
        art()
    else:
        Screen.wrapper(animation)
