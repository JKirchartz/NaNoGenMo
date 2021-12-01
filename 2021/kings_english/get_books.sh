#! /bin/bash

# authors:
# 3026: Erasmus, Desiderius
# 65: Shakespeare, William
# 17: Milton, John
# 410: Christophe Marlowe
# 296: Francis Bacon
# 6596: Edward Moore
# 350: Izaak Walton
# 81: John Bunyan


authors=(3026 65 17 410 296 6596 350 81)

for a in "${authors[@]}"; do
 lynx -dump --listonly "https://gutenberg.org/ebooks/author/$a" | grep -e "ebooks\\/[0-9]" | rev | cut -d' ' -f1 | rev | while read -r book
 do
   lynx -dump --listonly "$book" | grep -e ".txt" | rev | cut -d' ' -f1 | rev
 done
done

# and the King James Bible
echo "https://www.gutenberg.org/files/10/10-0.txt";
