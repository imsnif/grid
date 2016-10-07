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

function widthOffsetOrder (a, b) {
  return (a.x + a.width <= b.x + b.width ? -1 : 1)
}

module.exports = function occupy (grid, candidate, baseCoords) {
  // baseCoords means the error coordinates will be given as the base values (x, y) of the collider, rather than the end values (x + width, y + height)
  // this is an ugly ugly and very temporary hack, TODO: fix this
  assert(validate.isObject(grid), `${grid} is not an object`)
  assert(validate.isObject(candidate), `${candidate} is not an object`)
  assert(candidate.x + candidate.width <= grid.width, 'size exceeds grid')
  assert(candidate.y + candidate.height <= grid.height, 'size exceeds grid')
  assert(candidate.x >= 0, 'size exceeds grid')
  assert(candidate.y >= 0, 'size exceeds grid')
  const colliders = grid.panes
    .filter(p => p.id !== candidate.id)
    .filter((pane) => detectCollision(pane, candidate))
    .sort(widthOffsetOrder)
  if (colliders.length > 0) {
    const err = new Error('space is occupied')
    err.coords = {
      x: baseCoords ? colliders[0].x : colliders[0].x + colliders[0].width,
      y: baseCoords ? colliders[0].y : colliders[0].y + colliders[0].height,
      width: colliders[0].width,
      height: colliders[0].height
    }
    throw err
  }
  return candidate
}
