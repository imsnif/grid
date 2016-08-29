'use strict'

const assert = require('assert')
const validate = require('validate.js')

module.exports = function occupy (grid, candidate) {
  assert(validate.isObject(grid))
  assert(validate.isObject(candidate))
  if (
    candidate.x + candidate.width > grid.width ||
    candidate.y + candidate.height > grid.height
  ) {
    throw new Error('size exceeds grid')
  }
  const colliders = grid.panes
    .filter(p => p.id !== candidate.id)
    .filter((pane) => {
      if (
        candidate.x < pane.x + pane.width &&
        candidate.x + candidate.width > pane.x &&
        candidate.y < pane.y + pane.height &&
        candidate.height + candidate.y > pane.y
      ) {
        return true
      }
    })
    .sort((a, b) => {
      if (a.y + a.height <= b.y + b.height) {
        return -1
      } else {
        return 1
      }
    })
  if (colliders.length > 0) {
    const err = new Error('space is occupied')
    err.coords = {x: colliders[0].x + colliders[0].width, y: colliders[0].y + colliders[0].height}
    throw err
  }
  return {x: candidate.x, y: candidate.y}
}
