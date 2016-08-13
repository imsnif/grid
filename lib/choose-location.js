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

function horizontalSizeOfWindowIsFree (representation, coordinates, window) {
  const maxWindowXOnGrid = coordinates.x + window.width
  if (maxWindowXOnGrid > representation[0].length) {
    return false
  }
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
  let occupied
  for (let y = 0; y < gridHeight; y += 1) {
    const emptySequences = findSequence(representation[y], 0)
    emptySequences.some(s => {
      for (let x = s.start; x <= s.end - window.width + 1; x += 1) {
        if (!horizontalSizeOfWindowIsFree(representation, {y, x}, Object.assign({}, window, {width: s.end - window.width + 1}))) return false // TODO: fix this
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
