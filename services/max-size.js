'use strict'

const assert = require('assert')
const validate = require('validate.js')
const findObstruction = require('./find-obstruction')

module.exports = maxSize

function buildRetParams (pane, grid, obstruction, direction) {
  if (obstruction) {
    const width = direction === 'left'
      ? pane.width + pane.x - obstruction
      : obstruction - pane.x
    const height = direction === 'up'
      ? pane.height + pane.y - obstruction
      : obstruction - pane.y
    const y = direction === 'up' ? obstruction : pane.y
    const x = direction === 'left' ? obstruction : pane.x
    return {width, height, y, x}
  } else {
    const width = direction === 'left'
      ? pane.width + pane.x
      : grid.width - pane.x
    const height = direction === 'up'
      ? pane.height + pane.y
      : grid.height - pane.y
    const y = direction === 'up' ? 0 : pane.y
    const x = direction === 'left' ? 0 : pane.x
    return {width, height, y, x}
  }
}

function maxSize (pane, direction) {
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
