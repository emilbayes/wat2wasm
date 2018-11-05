# `wat2wasm`

> WASM/JS clone of wabt's wat2wasm

## Usage

```man
usage: wat2wasm [options] filename

read a file in the wasm text format, check it for errors, and
convert it to the wasm binary format.

NOTE: This is WASM/JS clone of wabt's wat2wasm command

examples:
# parse and typecheck test.wat and write to test.wasm
$ wat2wasm test.wat

# parse test.wat and write to binary file test.wasm
$ wat2wasm test.wat -o test.wasm

# Read from stdin and write to stdout
$ cat test.wat | wat2wasm - -output=- > test.wasm

options:
-h, --help                                  Print this help message
-d, --dump-module                           Print a hexdump of the module to stdout
-o, --output=FILE                           output wasm binary file
    --debug-names                           Write debug names to the generated binary file
```

## Install

```sh
npm install -g wat2wasm
```

## License

[ISC](LICENSE)
