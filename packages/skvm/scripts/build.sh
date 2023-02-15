#!/bin/bash

wasm-pack build --target web --out-dir pkg/web 

rm ./pkg/web/package.json
rm ./pkg/web/README.md
rm ./pkg/web/.gitignore


wasm-pack build --out-dir pkg/node

rm ./pkg/node/package.json
rm ./pkg/node/README.md
rm ./pkg/node/.gitignore
