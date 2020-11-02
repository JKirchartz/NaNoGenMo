#! /usr/bin/env python
# -*- coding: utf-8 -*-
# vim:fenc=utf-8
#
# Copyleft (ↄ) 2020 jkirchartz <me@jkirchartz.com>
#
# Distributed under terms of the NPL (Necessary Public License) license.

"""

"""

from asciimatics.screen import Screen
from asciimatics.scene import Scene
from asciimatics.effects import Cycle, Stars
from asciimatics.renderers import ImageFile
from PIL import ImageDraw, Image
from opensimplex import OpenSimplex
import random

def makeMap(height, width):
    gen = OpenSimplex()
    def noise(nx, ny):
        # Rescale from -1.0:+1.0 to 0.0:1.0
        return gen.noise2d(nx, ny) / 2.0 + 0.5


    poles = random.random() / 2
    equator = (random.random() / 2) + 0.5
    value = []

    for y in range(height):
        value.append([0] * width)
        for x in range(width):
            nx = x/width - 0.5
            ny = y/height - 0.5
            e = noise(nx, ny)
            e = 10*e*e + poles + (equator-poles) * sin(PI * (y / height))
            value[y][x] = e

    return value

def planet():
    surface=Image.frombytes('L',(200,200),makeMap(200,200))
    pl=Image.new("RGB", (200, 200), "#000000")
    pla=ImageDraw.im(pl);
    pla.ellipse([(0, 0), (200, 200)], "#FF0000", "#000000", 0)
    draw=ImageDraw.im(im);
    draw.ellipse([(0, 0), (200, 200)], "#FF0000", "#000000", 0)
    img=Image.composite(surface,pla,draw);
    img.save("./planet.jpg")


# def art(screen):
#     planet()
#     effects = [
#       Stars(screen, (screen.width + screen.height) // 2),
#       Print(screen, ImageFile('./planet.jpg', 30, colours=2)
#     ]
#     screen.play([Scene(effects, 500)])

# Screen.wrapper(art)
planet()
