'use strict'

const assert = require('assert')
const validate = require('validate.js')
const findSequence = require('find-sequence')
const occupy = require('./occupy-window')

function occupySpace (seq, window, representation, y) {
  try {
    occupy(representation, Object.assign({}, window, {x: seq.start, y}))
    return ({x: seq.start, y})
  } catch (e) {
    if (
      !e.coords ||
      typeof e.coords.x === 'undefined' ||
      e.coords.x > seq.end - window.width + 1
    ) {
      return false
    }
    if (e.coords.x === seq.start) {
      return occupySpace(Object.assign({}, seq, {start: e.coords.x + 1}), window, representation, y)
    }
    return occupySpace(Object.assign({}, seq, {start: e.coords.x}), window, representation, y)
  }
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
  const gridHeight = representation.length
  let occupied
  for (let y = 0; y < gridHeight - window.height; y += 1) {
    const emptySequences = findSequence(representation[y], 0)
    emptySequences.filter(s => s.end - s.start + 1 >= window.width).some(s => {
      occupied = occupySpace(s, window, representation, y)
      return occupied
    })
    if (occupied) return occupied
  }
  throw new Error('no space for new window')
}
