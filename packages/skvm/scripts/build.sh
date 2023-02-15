#!/bin/bash

wasm-pack build --target web --out-dir pkg/web
#
wasm-pack build --out-dir pkg/node

rm -rf ./npm

#如果文件夹不存在，创建文件夹
if [ ! -d "./npm" ]; then
  mkdir npm
fi

cp -r ./pkg/web ./npm/web
cp -r ./pkg/node ./npm/node

rm ./npm/node/package.json
rm ./npm/node/README.md
rm ./npm/node/.gitignore

rm ./npm/web/package.json
rm ./npm/web/README.md
rm ./npm/web/.gitignore


cp ./package.json ./npm/package.json
