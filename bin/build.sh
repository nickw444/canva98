#!/usr/bin/env bash

set -euo pipefail

main(){
  mkdir -p target/
  closure-compiler \
    --js m.js \
    --js_output_file target/m.js \
    --compilation_level ADVANCED_OPTIMIZATIONS \
    --externs externs/dom-to-image.js \
    --language_out ECMASCRIPT_2018
  cp -r index.html i.css favicon.ico l i target/
  wc -c m.js target/m.js
}

main
