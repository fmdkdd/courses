#!/bin/bash

echo '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'
echo ' ESLint '
echo -e '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n'

node_modules/.bin/eslint --quiet --config eslint-config.json $1

echo '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~'
echo ' Coverage '
echo -e '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n'

echo -e 'try {\n' > test.js
cat $1 >> test.js
echo -e '\n} catch(e) {}\n' >> test.js
cat test-base.js >> test.js
#cat $1 test-base.js > test.js
node_modules/.bin/istanbul cover node_modules/.bin/_mocha -- --ui tdd --require should --require mocha-clean --reporter dot
