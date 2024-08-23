export WASM_PACKAGE="./node_modules/@dojoengine/torii-client//node_modules/@dojoengine/torii-wasm/package.json"
ls -l $WASM_PACKAGE
sed -i '' -e 's/node/web/' $WASM_PACKAGE
ls -l $WASM_PACKAGE
