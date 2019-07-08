const fetch = require('node-fetch')
const path = require('path')
const hasha = require('hasha')
const fs = require('fs')
const promisify = require('util').promisify

const LOCATION = 'https://raw.githubusercontent.com/WebAssembly/wabt/master/demo/libwabt.js'
const LIBWABT_PATH = path.resolve(__dirname, 'libwabt.js')

async function fetchLibwabt () {
  const res = await fetch(LOCATION)
  if (!res.ok) throw new Error(`Error fetching libwabt (${res.status}): ${res.statusText}`)
  return res.text()
}

async function downloadAndCompare () {
  const newLibwabt = await fetchLibwabt()
  const newHash = hasha(newLibwabt)
  const oldLibwabt = fs.readFileSync(LIBWABT_PATH, 'utf8')
  const oldHash = hasha(oldLibwabt)

  if (newHash === oldHash) {
    console.log('The latest libwabt.js matches the current libwabt.js. No changes needed.')
    return
  }

  console.log('The latest libwabt.js differs from the existing libwabt.js')

  return promisify(fs.writeFile)(LIBWABT_PATH, newLibwabt)
}

downloadAndCompare().then(() => console.log('done'))
