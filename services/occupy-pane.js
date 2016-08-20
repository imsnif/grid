'use strict'

const assert = require('assert')
const validate = require('validate.js')

const removePreviousLocation = (prevRepresentation, pane) => {
  // TODO: combine remove and add loop, no need to do this twice
  let representation = prevRepresentation.map(r => r.slice())
  const firstVerticalPoint = pane.y
  const firstHorizontalPoint = pane.x
  const lastVerticalPoint = pane.height + pane.y
  const lastHorizontalPoint = pane.width + pane.x
  for (let y = firstVerticalPoint; y < lastVerticalPoint; y += 1) {
    for (let x = firstHorizontalPoint; x < lastHorizontalPoint; x += 1) {
      if (prevRepresentation[y][x] !== pane.id) {
        throw new Error('representation is corrupt')
      }
      representation[y][x] = 0
    }
  }
  return representation
}

module.exports = function occupy (prevRepresentation, pane, panePrev) {
  assert(validate.isObject(prevRepresentation))
  assert(validate.isObject(pane))
  if (panePrev !== undefined) {
    assert(validate.isObject(panePrev))
  }
  let representation = panePrev
    ? removePreviousLocation(prevRepresentation, panePrev)
    : prevRepresentation.map(r => r.slice())
  const firstVerticalPoint = pane.y
  const firstHorizontalPoint = pane.x
  const lastVerticalPoint = pane.height + pane.y
  const lastHorizontalPoint = pane.width + pane.x - 1
  for (let y = firstVerticalPoint; y < lastVerticalPoint; y += 1) {
    for (let x = lastHorizontalPoint; x >= firstHorizontalPoint; x -= 1) {
      if (!Array.isArray(prevRepresentation[y]) || prevRepresentation[y][x] === undefined) {
        const err = new Error('size exceeds grid')
        err.coords = {x, y}
        throw err
      }
      if (prevRepresentation[y][x] !== 0 && prevRepresentation[y][x] !== pane.id) {
        const err = new Error('space is occupied')
        err.coords = {x, y}
        throw err
      }
      representation[y][x] = pane.id
    }
  }
  return representation
}
