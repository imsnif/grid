'use strict'

const assert = require('assert')
const validate = require('validate.js')

const removePreviousLocation = (prevRepresentation, window) => {
  // TODO: combine remove and add loop, no need to do this twice
  let representation = prevRepresentation.map(r => r.slice())
  const firstVerticalPoint = window.y
  const firstHorizontalPoint = window.x
  const lastVerticalPoint = window.height + window.y
  const lastHorizontalPoint = window.width + window.x
  for (let y = firstVerticalPoint; y < lastVerticalPoint; y += 1) {
    for (let x = firstHorizontalPoint; x < lastHorizontalPoint; x += 1) {
      if (prevRepresentation[y][x] !== window.id) {
        throw new Error('representation is corrupt')
      }
      representation[y][x] = 0
    }
  }
  return representation
}

module.exports = function occupy (prevRepresentation, window, windowPrev) {
  assert(validate.isObject(prevRepresentation))
  assert(validate.isObject(window))
  if (windowPrev !== undefined) {
    assert(validate.isObject(windowPrev))
  }
  let representation = windowPrev
    ? removePreviousLocation(prevRepresentation, windowPrev)
    : prevRepresentation.map(r => r.slice())
  const firstVerticalPoint = window.y
  const firstHorizontalPoint = window.x
  const lastVerticalPoint = window.height + window.y
  const lastHorizontalPoint = window.width + window.x
  for (let y = firstVerticalPoint; y < lastVerticalPoint; y += 1) {
    for (let x = firstHorizontalPoint; x < lastHorizontalPoint; x += 1) {
      if (!Array.isArray(prevRepresentation[y]) || prevRepresentation[y][x] === undefined) {
        throw new Error('size exceeds grid')
      }
      if (prevRepresentation[y][x] !== 0 && prevRepresentation[y][x] !== window.id) {
        throw new Error('space is occupied')
      }
      representation[y][x] = window.id
    }
  }
  return representation
}
