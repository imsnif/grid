'use strict'

const assert = require('assert')
const validate = require('validate.js')
const findSequence = require('find-sequence')
const occupy = require('./occupy-window')

function verticalSizeOfWindowIsFree (representation, coordinates, window) {
  const maxWindowYOnGrid = coordinates.y + window.height
  if (maxWindowYOnGrid > representation.length) {
    return false
  }
  for (let y = coordinates.y; y < maxWindowYOnGrid; y += 1) {
    if (!Array.isArray(representation[y]) || representation[y][coordinates.x] !== 0) {
      return false
    }
  }
  return true
}

module.exports = function chooseLocation (prevRepresentation, window) {
  assert(validate.isObject(prevRepresentation))
  assert(validate.isObject(window))
  if (window.constructor && window.constructor.name === 'BrowserWindow') {
    const windowBounds = window.getBounds() // TODO: get wrapper object from grid
    window.width = windowBounds.width
    window.height = windowBounds.height
  }
  let representation = prevRepresentation.map(r => r.slice())
  const gridHeight = representation.length - 1
  let occupied
  for (let y = 0; y < gridHeight; y += 1) {
    const emptySequences = findSequence(representation[y], 0)
    emptySequences.some(s => {
      for (let x = s.start; x <= s.end - window.width + 1; x += 1) {
        if (x > s.end - window.width + 1) return false
        if (verticalSizeOfWindowIsFree(representation, {y, x}, window)) {
          try {
            occupy(prevRepresentation, Object.assign({}, window, {x, y})) // TODO: why prevRepresentation and not representation?
            occupied = {x, y}
            return true
          } catch (e) {
            return false
          }
        }
      }
    })
    if (occupied) return occupied
  }
  throw new Error('no space for new window')
}
