const test = require('tape')
const testWasm = require('./test-wasm')

test('loading wasm module', t => {
  let mod

  t.doesNotThrow(() => { mod = testWasm() }, 'Module loades sync')

  t.equal(mod.exports['test'], 10, 'global wasm exports')

  t.equal(mod.exports['add'](5, 5), 10, 'function that uses local variables works')

  t.end()
})
