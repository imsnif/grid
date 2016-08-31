'use strict'

const assert = require('assert')
const validate = require('validate.js')
const findObstruction = require('./find-obstruction')

module.exports = maxLocation

function buildRetParams (pane, grid, obstruction, direction) {
  if (obstruction) {
    if (direction === 'up') {
      return {y: obstruction}
    }
    if (direction === 'down') {
      return {y: obstruction - pane.height}
    }
    if (direction === 'left') {
      return {x: obstruction}
    }
    if (direction === 'right') {
      return {x: obstruction - pane.width}
    }
  } else {
    if (direction === 'up') {
      return {y: 0}
    }
    if (direction === 'down') {
      return {y: grid.height - pane.height}
    }
    if (direction === 'left') {
      return {x: 0}
    }
    if (direction === 'right') {
      return {x: grid.width - pane.width}
    }
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
