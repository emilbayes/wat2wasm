const stream = require('stream')
const fs = require('fs')
const crypto = require('crypto')
const https = require('https')
const path = require('path')

const FILE_PATH = path.resolve(__dirname, 'libwabt.js')
const FILE_URL = 'https://raw.githubusercontent.com/WebAssembly/wabt/master/demo/libwabt.js'

var httpHash
var fileHash

stream.pipeline(
  fs.createReadStream(FILE_PATH),
  crypto.createHash('sha256').on('data', (hash) => { fileHash = hash }),
  onfilehash
)

function onfilehash (err) {
  if (err) throw err

  https.get(FILE_URL, onresponse)
    .on('error', (err) => { throw err })
}

function onresponse (res) {
  stream.pipeline(
    res,
    crypto.createHash('sha256').on('data', (hash) => { httpHash = hash }),
    onhttphash
  )
}

function onhttphash (err) {
  if (err) throw err
  const isUpToDate = httpHash.compare(fileHash)
  isUpToDate === 0 ? console.log('libwabt.js is up to date') : console.log('libwabt.js is outdated')
  process.exit(httpHash.compare(fileHash))
}
