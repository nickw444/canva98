#!/usr/bin/env bash

set -euo pipefail

main(){
  mkdir -p target/
  closure-compiler \
    --js main.js \
    --js_output_file target/main.js \
    --compilation_level ADVANCED_OPTIMIZATIONS \
    --externs externs/dom-to-image.js \
    --language_out ECMASCRIPT_2018
  cp -r index.html index.css favicon.ico lib img target/
  wc -c main.js target/main.js
}

main
