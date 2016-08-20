'use strict'

const assert = require('assert')
const validate = require('validate.js')
const findSequence = require('find-sequence')
const occupy = require('./occupy-pane')

function occupySpace (seq, pane, representation, y) {
  try {
    occupy(representation, Object.assign({}, pane, {x: seq.start, y}))
    return ({x: seq.start, y})
  } catch (e) {
    if (
      !e.coords ||
      typeof e.coords.x === 'undefined' ||
      e.coords.x > seq.end - pane.width + 1
    ) {
      return false
    }
    if (e.coords.x === seq.start) {
      return occupySpace(Object.assign({}, seq, {start: e.coords.x + 1}), pane, representation, y)
    }
    return occupySpace(Object.assign({}, seq, {start: e.coords.x}), pane, representation, y)
  }
}

module.exports = function chooseLocation (prevRepresentation, pane) {
  assert(validate.isObject(prevRepresentation))
  assert(validate.isObject(pane))
  let representation = prevRepresentation.map(r => r.slice())
  const gridHeight = representation.length
  let occupied
  for (let y = 0; y < gridHeight - pane.height; y += 1) {
    const emptySequences = findSequence(representation[y], 0)
    emptySequences.filter(s => s.end - s.start + 1 >= pane.width).some(s => {
      occupied = occupySpace(s, pane, representation, y)
      return occupied
    })
    if (occupied) return occupied
  }
  throw new Error('no space for new pane')
}
