'use strict'

const assert = require('assert')
const validate = require('validate.js')
const occupy = require('./occupy-window')

module.exports = function chooseLocation (prevRepresentation, window) {
  // TODO: optimize along with occupy window (with Array.some etc.)
  assert(validate.isObject(prevRepresentation))
  assert(validate.isObject(window))
  let representation = prevRepresentation.map(r => r.slice())
  const gridHeight = representation.length - 1
  const gridWidth = representation[0].length - 1
  for (let y = 0; y < gridHeight; y += 1) {
    for (let x = 0; x < gridWidth; x += 1) {
      if (representation[y][x] === 0) {
        try {
          occupy(prevRepresentation, Object.assign({}, window, {x, y}))
          return ({x, y})
        } catch (e) {
          // no-op
        }
      }
    }
  }
  throw new Error('no space for new window')
}
