'use strict'

const assert = require('assert')
const validate = require('validate.js')
const occupy = require('./occupy-window')

function verticalSizeOfWindowIsFree (representation, coordinates, window) {
  const maxWindowYOnGrid = coordinates.y + window.height
  for (let y = coordinates.y; y < maxWindowYOnGrid; y += 1) {
    if (!Array.isArray(representation[y]) || representation[y][coordinates.x] !== 0) {
      return false
    }
  }
  return true
}

function horizontalSizeOfWindowIsFree (representation, coordinates, window) {
  const maxWindowXOnGrid = coordinates.x + window.width
  for (let x = coordinates.x; x < maxWindowXOnGrid; x += 1) {
    if (representation[coordinates.y][x] !== 0) {
      return false
    }
  }
  return true
}

module.exports = function chooseLocation (prevRepresentation, window) {
  assert(validate.isObject(prevRepresentation))
  assert(validate.isObject(window))
  let representation = prevRepresentation.map(r => r.slice())
  const gridHeight = representation.length - 1
  const gridWidth = representation[0].length - 1
  for (let y = 0; y < gridHeight; y += 1) {
    for (let x = 0; x < gridWidth; x += 1) {
      if (
        representation[y][x] === 0 &&
        horizontalSizeOfWindowIsFree(representation, {y, x}, window) &&
        verticalSizeOfWindowIsFree(representation, {y, x}, window)
       ) {
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
