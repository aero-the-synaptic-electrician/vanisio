emcc core.c --no-entry -O3 -s WASM=1 -s STANDALONE_WASM=1 -s ALLOW_MEMORY_GROWTH=1 -o ./module.wasm -s EXPORTED_FUNCTIONS="['_deserialize', '_malloc', '_free']" -s ERROR_ON_UNDEFINED_SYMBOLS=0
