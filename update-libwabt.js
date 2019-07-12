const stream = require('stream')
const fs = require('fs')
const https = require('https')
const path = require('path')

const FILE_PATH = path.resolve(__dirname, 'libwabt.js')
const FILE_URL = 'https://raw.githubusercontent.com/WebAssembly/wabt/master/demo/libwabt.js'

https.get(FILE_URL, onresponse).on('error', (err) => { throw err })

function onresponse (res) {
  stream.pipeline(
    res,
    fs.createWriteStream(FILE_PATH),
    onhttphash
  )
}

function onhttphash (err) {
  if (err) throw err
  console.log('libwabt.js has been updated')
  process.exit()
}
