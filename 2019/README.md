NaNoGenMo 2019
==============


Sherlock Shuffle 4.0: Sinclair Lewis Caroll
------------


Combine Sinclair Lewis's "Fresh Air" with Lewis Caroll's "Alices' Adventures in Wonderland"

This modifies the Shecklock Shuffle algorithm from last year to utilize my
[pos2tracery][1] package/tool in some more creative ways than just parsing pos
tags to keys.

The publishing mechanism attempted this year has been modified from [Ben
Harris's Tildeverse Zine][2]

[books][3]


Triptograph
-------

Inspired by surrealism and dadaism, Triptograph combines a variant of [my
image-generator of the same name][4] replicating a [surrealist photography
technique][5], combined with pos2tracery generating text and de-attributed "quotes" about dreams, and a
poetry generator written entirely in bash script that I've named ["T.T(Y)zara"][6] after [Tristan Tzara][7] for his cut-up technique.
I have hopes of improving this after NaNoGenMo to generate zines, but for now GNU Make is frustrating me.

[issues][8]

Other
--------

There were a few other things I was playing with:

1. [a bash script that puts you in the drivers seat of bigram Markov text generation][9] which I've decided would be better as a vim plugin (sorry EMACS fans, you probably already have this functionality)
2. the very beginnings of [a more analytical sort of pos2tracery][10] made with a node.js nlp library called [compromise][11] with a unique pos tagger and some interesting functions

[1]: https://www.npmjs.com/package/pos2tracery
[2]: https://tildegit.org/tildeverse/zine/src/branch/master/Makefile
[3]: https://github.com/JKirchartz/NaNoGenMo/tree/master/2019/SinclairLewisCarroll/books/
[4]: https://triptograph.glitch.me/
[5]: https://en.wikipedia.org/wiki/Surrealist_techniques#Triptography
[6]: https://github.com/JKirchartz/NaNoGenMo/tree/master/2019/triptograph/TTYzara.sh
[7]: https://en.wikipedia.org/wiki/Tristan_Tzara
[8]: https://github.com/JKirchartz/NaNoGenMo/tree/master/2019/triptograph/dist/
[9]: https://github.com/JKirchartz/NaNoGenMo/tree/master/2019/BashBigramKeyboard/
[10]: https://github.com/JKirchartz/NaNoGenMo/tree/master/2019/megatagger
[11]: https://github.com/spencermountain/compromise
