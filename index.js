#!/usr/bin/env node
const libwabt = require('./libwabt.js')
const fs = require('fs')
const path = require('path')
const concat = require('concat-stream')

const args = require('minimist')(process.argv.slice(2), {
  boolean: ['d', 'h'],
  string: ['o', 'f'],
  default: {
    f: ''
  },
  alias: {
    d: 'dump-module',
    f: 'features',
    o: 'output',
    h: 'help'
  }
})

if (args.h) {
  console.log(`usage: wat2wasm [options] filename

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
  -f, --features                              Comma separated list of feature flags to enable
  -d, --dump-module                           Print a hexdump of the module to stdout
  -o, --output=FILE                           output wasm binary file
      --debug-names                           Write debug names to the generated binary file`)
  process.exit(0)
}

libwabt().then(wabt => {
  const features = args.f.split(',').reduce((o, f) => {
    o[f] = true
    return o
  }, {})
  var fileName = args._[0]
  var fileStream
  var filePath
  if (fileName === '-') {
    fileStream = process.stdin
    fileName = 'stdin'
    filePath = fileName
  } else {
    try {
      filePath = path.isAbsolute(fileName) ? fileName : path.join(process.cwd(), fileName)
      fileStream = fs.createReadStream(filePath)
    } catch (ex) {
      console.error(ex.message)
      process.exit(1)
    }
  }

  fileStream.pipe(concat(function (source) {
    var module
    try {
      module = wabt.parseWat(fileName, source.toString(), features)
    } catch (ex) {
      process.stderr.write(ex.message.replace('parseWat failed:\n', ''))
      process.exit(1)
    }
    module.resolveNames()
    module.validate(features)

    var binary = module.toBinary({
      log: true,
      write_debug_names: args['debug-names']
    })

    if (args.d) {
      process.stdout.write(binary.log)
      return
    }

    if (args.o === '-') return process.stdout.write(binary.buffer)
    if (args.o) return fs.writeFileSync(args.o, binary.buffer)
    else {
      fs.writeFileSync(path.join(
        path.dirname(filePath),
        path.basename(filePath, path.extname(filePath)) + '.wasm'
      ), binary.buffer)
    }
  })).on('error', function (err) {
    console.error(err)
    process.exit(1)
  })
})
