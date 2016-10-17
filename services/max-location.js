'use strict'

const assert = require('assert')
const validate = require('validate.js')
const findObstruction = require('./find-obstruction')
const chooseLocation = require('../services/choose-location')

module.exports = { mLoc, maxOrSkipLocation }

function buildRetParams (pane, grid, obstruction, direction) {
  if (obstruction) {
    const y = direction === 'up' ? obstruction : obstruction - pane.height
    const x = direction === 'left' ? obstruction : obstruction - pane.width
    return {y, x}
  } else {
    const y = direction === 'up' ? 0 : grid.height - pane.height
    const x = direction === 'left' ? 0 : grid.width - pane.width
    return {y, x}
  }
}

function mLoc (pane, direction) {
  assert(validate.isObject(pane), `${pane} must be an object`)
  const grid = pane.grid
  const obstruction = grid.panes
    .filter(p => p.id !== pane.id)
    .map((sibling) => findObstruction(pane, sibling, direction))
    .filter(o => o)
    .sort((a, b) => {
      if (direction === 'up' || direction === 'left') {
        return (a < b ? 1 : -1)
      } else {
        return (a > b ? 1 : -1)
      }
    })[0]
  return buildRetParams(pane, grid, obstruction, direction)
}

function maxOrSkipLocation (state, d) {
  try {
    const { x, y } = mLoc(state, d)
    const skippedLocation = movedInDirection(d, x, y, state)
      ? false
      : chooseLocation(state.grid, state, d)
    if (skippedLocation) return skippedLocation
    if (d === 'up' || d === 'down') return {y, x: state.x}
    if (d === 'left' || d === 'right') return {x, y: state.y}
  } catch (e) {
    throw new Error('location blocked')
  }
}

function movedInDirection (d, x, y, state) {
  if ((d === 'up' || d === 'down') && (state.y === y)) return false
  if ((d === 'left' || d === 'right') && (state.x === x)) return false
  return true
}

