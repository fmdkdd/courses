#!/usr/bin/fish

set orig $argv[1]

function list
  for f in (ls 'students/')
    echo $orig $f (git diff --no-index --shortstat -- (./ast.js $orig | psub) (./ast.js 'students/'$f | psub))
  end
end

list | sort --numeric-sort --key=6
