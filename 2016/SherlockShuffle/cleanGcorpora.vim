g/^Produced by/norm jdd
g/^Produced by/d
g/Original Transcriber's Note/norm 2vapdd
g/\v\c^\s+contents$/d
g/\v\c^(\s+)?by$/d
g/\v\c^(\s+)?(Sir )?a(rthur|\.) conan doyle$/d
g/\v\c^(\s+)?table of contents$/d
g/\v\c^(\s+)?chapter$/d
g/\v\c^(\s+)?(IV)+/d
g/\v\c^(\s+)?chapter/d
g/\v\c^(\s+)?part\s/d
g/\v\c^(\s+)?\*(\s+)?\*/d
g/\v\coriginal transcriber's notes:/d
%s/\v\[([^\]]|\r?\n)+\]//g
wqa
