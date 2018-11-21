NaNoGenMo 2018
==============


Sherlock Shuffle 3.0
------------

Using [pos2tracery][1] to tag parts of speech to create a tracery grammar which is then used to reconstruct Sherlock Holmes novels, one sentence at a time.
(This actually forks and modifies the pos2tracery code, but has resulted in me discovering and fixxing a bug in that codebase)

[output(s)][2]


Winkie
-------

Take the same basic concept as Sherlock Shuffle, rewrite it with [winkjs][3] and improve upon it as much as I can - then use it to reconstruct Frank L Baum's Oz novels.

(Get it? Winkjs? Winkies? Oz?)

[output(s)][4]


Vocabularyclept
-------

According to [wikipedia][5]:

> A vocabularyclept poem is a poem which is formed by taking the words of an existing poem and rearranging them into a new work of literature.

This script grabs 10 random poems from [poetrydb.org][6]'s API, and replaces each word in every line with another word with the same [syllable][7] count

[output(s)][8]



[1]: https://www.npmjs.com/package/pos2tracery
[2]: javascript:alert('Coming+Soon!')
[3]: https://winkjs.org/
[4]: https://github.com/JKirchartz/NaNoGenMo/tree/master/2018/Winkie/output
[5]: https://en.wikipedia.org/wiki/Vocabularyclept_poem
[6]: http://poetrydb.org
[7]: https://github.com/words/syllable
[8]: https://github.com/JKirchartz/NaNoGenMo/tree/master/2018/vocabularyclept/output
