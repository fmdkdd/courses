#!/usr/bin/fish

git diff --no-index -- (./ast.js students/$argv[1].js | psub) (./ast.js students/$argv[2].js | psub)
