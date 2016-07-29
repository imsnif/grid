'use strict'

const occupy = require('./occupy-window')

module.exports = function occupy (prevRepresentation, window, windowPrev) {
  let representation = prevRepresentation.slice()
  if (windowPrev) {
    // Clear window's previous representation from grid
    const firstVerticalPointPrev = windowPrev.y
    const firstHorizontalPointPrev = windowPrev.x
    const lastVerticalPointPrev = windowPrev.height + windowPrev.y
    const lastHorizontalPointPrev = windowPrev.width + windowPrev.x
    for (let y = firstVerticalPointPrev; y < lastVerticalPointPrev; y += 1) {
      for (let x = firstHorizontalPointPrev; x < lastHorizontalPointPrev; x += 1) {
        if (prevRepresentation[y][x] !== windowPrev.id) {
          throw new Error('representation is corrupt')
        }
        representation[y][x] = 0
      }
    }
  }
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
