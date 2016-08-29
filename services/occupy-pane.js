'use strict'

const assert = require('assert')
const validate = require('validate.js')

function detectCollision (pane, candidate) {
  if (
    candidate.x < pane.x + pane.width &&
    candidate.x + candidate.width > pane.x &&
    candidate.y < pane.y + pane.height &&
    candidate.height + candidate.y > pane.y
  ) {
    return true
  }
}

function heightOffsetOrder (a, b) {
  return (a.y + a.height <= b.y + b.height ? -1 : 1)
}

module.exports = function occupy (grid, candidate) {
  assert(validate.isObject(grid), `${grid} is not an object`)
  assert(validate.isObject(candidate), `${candidate} is not an object`)
  assert(candidate.x + candidate.width <= grid.width, 'size exceeds grid')
  assert(candidate.y + candidate.height <= grid.height, 'size exceeds grid')
  const colliders = grid.panes
    .filter(p => p.id !== candidate.id)
    .filter((pane) => detectCollision(pane, candidate))
    .sort(heightOffsetOrder)
  if (colliders.length > 0) {
    const err = new Error('space is occupied')
    err.coords = {
      x: colliders[0].x + colliders[0].width,
      y: colliders[0].y + colliders[0].height
    }
    throw err
  }
  return candidate
}
