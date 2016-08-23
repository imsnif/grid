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
    if (!e.coords || typeof e.coords.x === 'undefined') return false
    if (e.coords.x > seq.end - pane.width + 1) throw e
    const nextColumn = e.coords.x === seq.start ? e.coords.x + 1 : e.coords.x
    return occupySpace(Object.assign({}, seq, {start: nextColumn}), pane, representation, y)
  }
}

function occupyLine (representation, pane, lineIndex) {
  const gridHeight = representation.length
  if (lineIndex > gridHeight - pane.height) return false
  let blockedLines = []
  let occupied
  findSequence(representation[lineIndex], 0)
  .filter(s => s.end - s.start + 1 >= pane.width)
  .some(s => {
    try {
      occupied = occupySpace(s, pane, representation, lineIndex)
      return occupied
    } catch (e) {
      blockedLines.push(e.coords.y)
      return false
    }
  })
  if (occupied) return occupied
  const nextLine = blockedLines.length > 0 ? Math.min(blockedLines) : lineIndex + 1
  return occupyLine(representation, pane, nextLine)
}

module.exports = function chooseLocation (representation, pane) {
  assert(validate.isObject(representation))
  assert(validate.isObject(pane))
  let occupied = occupyLine(representation, pane, 0)
  if (!occupied) throw new Error('no space for new pane')
  return occupied
}
