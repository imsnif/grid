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

module.exports = function occupy (grid, candidate, getAllColliders) {
  // TODO: remove the ugly getAllColliders hack
  assert(validate.isObject(grid), `${grid} is not an object`)
  assert(validate.isObject(candidate), `${candidate} is not an object`)
  assert(candidate.x + candidate.width <= grid.width, 'size exceeds grid')
  assert(candidate.y + candidate.height <= grid.height, 'size exceeds grid')
  assert(candidate.x >= 0, 'size exceeds grid')
  assert(candidate.y >= 0, 'size exceeds grid')
  const colliders = grid.panes
    .filter(p => validate.isDefined(candidate.id) && validate.isDefined(p.id)
      ? p.id !== candidate.id
      : true
    )
    .filter((pane) => detectCollision(pane, candidate))
    .sort(widthOffsetOrder)
  if (colliders.length > 0) {
    const err = new Error('space is occupied')
    if (getAllColliders) {
      err.coords = colliders.map(c => ({
        id: c.id,
        x: c.x,
        y: c.y,
        width: c.width,
        height: c.height
      }))
    } else {
      err.coords = {
        id: colliders[0].id,
        x: colliders[0].x,
        y: colliders[0].y,
        width: colliders[0].width,
        height: colliders[0].height
      }
    }
    throw err
  }
  return candidate
}
