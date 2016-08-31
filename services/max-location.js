'use strict'

const assert = require('assert')
const validate = require('validate.js')
const findObstruction = require('./find-obstruction')

module.exports = maxLocation

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

function maxLocation (pane, direction) {
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
