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
from asciimatics.effects import Stars, Print
from asciimatics.renderers import ImageFile
from PIL import ImageDraw, Image, ImageOps
from opensimplex import OpenSimplex

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

size=random.randint(10,20)

""" make ascii art """
def art():
    # generate a planet graphic
    planet()
    screen=Screen.open(30)
    effects= [
        Stars(screen, (screen.width + screen.height) // 4),
        Print(screen, ImageFile('./tmp/planet.png', size), 0)
        ]
    # screen.play([Scene(effects , 500)])
    screen.set_scenes([Scene(effects, 500)])
    screen.draw_next_frame()
    # print(screen.dimensions)
    doc = ""
    for x in range(0, screen.dimensions[0]):
        doc += "\n"
        for y in range(0, screen.dimensions[1]):
            code=screen.get_from(x % 30, y % 68) # returns a tuple, ascii = 0
            if code is not None:
                doc += chr(code[0])
    f = open("./tmp/planet.txt", "w")
    f.write(doc)
    f.close()
    screen.close(restore)

""" show ascii animation """
def animation(screen):
    # generate a planet graphic
    planet()
    effects= [
        Stars(screen, (screen.width + screen.height) // 2),
        Print(screen, ImageFile('./tmp/planet.png', size), 2)
        ]
    screen.play([Scene(effects , 500)])

if __name__ == "__main__":
    if len(sys.argv) > 1:
        art()
    else:
        Screen.wrapper(animation)
