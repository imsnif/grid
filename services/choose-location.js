'use strict'

const assert = require('assert')
const validate = require('validate.js')
const findSequence = require('find-sequence')
const occupy = require('./occupy-pane')
const checkDiagonally = require('./check-diagonally')

function occupySpace (seq, pane, representation, y) {
  try {
    checkDiagonally(representation, Object.assign({}, pane, {x: seq.start, y}))
    occupy(representation, Object.assign({}, pane, {x: seq.start, y}))
    return ({x: seq.start, y})
  } catch (e) {
    if (
      !e.coords ||
      typeof e.coords.x === 'undefined' ||
      e.coords.x > seq.end - pane.width + 1
    ) {
      if (typeof e.coords !== 'undefined') {
        throw e
      }
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
  const gridHeight = representation.length - 1
  let occupied
  let y = 0
  while (y <= gridHeight - pane.height + 1) {
    const emptySequences = findSequence(representation[y], 0)
    let blockedYs = []
    emptySequences.filter(s => s.end - s.start + 1 >= pane.width).some(s => {
      try {
        occupied = occupySpace(s, pane, representation, y)
        return occupied
      } catch (e) {
        blockedYs.push(e.coords.y)
        return false
      }
    })
    if (occupied) return occupied
    y = blockedYs.length > 0 ? Math.min(blockedYs) : y + 1
  }
  throw new Error('no space for new pane')
}
