#!/bin/bash

wasm-pack build --target web --out-dir pkg/web

rm ./pkg/web/package.json
rm ./pkg/web/README.md
rm ./pkg/web/.gitignore
