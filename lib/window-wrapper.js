'use strict'

const assert = require('assert')
const validate = require('validate.js')

module.exports = WindowWrapper

const occupy = (prevPlacement, window, windowPrev) => {
  let placement = prevPlacement.slice()
  if (windowPrev) {
    // Clear window's previous placement from grid
    const firstVerticalPointPrev = windowPrev.y
    const firstHorizontalPointPrev = windowPrev.x
    const lastVerticalPointPrev = windowPrev.height + windowPrev.y
    const lastHorizontalPointPrev = windowPrev.width + windowPrev.x
    for (let y = firstVerticalPointPrev; y < lastVerticalPointPrev; y += 1) {
      for (let x = firstHorizontalPointPrev; x < lastHorizontalPointPrev; x += 1) {
        if (prevPlacement[y][x] !== windowPrev.id) {
          throw new Error('placement is corrupt')
        }
        placement[y][x] = 0
      }
    }
  }
  const firstVerticalPoint = window.y
  const firstHorizontalPoint = window.x
  const lastVerticalPoint = window.height + window.y
  const lastHorizontalPoint = window.width + window.x
  for (let y = firstVerticalPoint; y < lastVerticalPoint; y += 1) {
    for (let x = firstHorizontalPoint; x < lastHorizontalPoint; x += 1) {
      if (!Array.isArray(prevPlacement[y]) || prevPlacement[y][x] === undefined) {
        throw new Error('size exceeds grid')
      }
      if (prevPlacement[y][x] !== 0 && prevPlacement[y][x] !== window.id) {
        throw new Error('space is occupied')
      }
      placement[y][x] = window.id
    }
  }
  return placement
}

function WindowWrapper (window, x, y) {
  this.id = window.id
  this.width = window.width
  this.height = window.height
  this.x = x || 0
  this.y = y || 0
}

WindowWrapper.prototype.changeSize = function(width, height) {
  this.grid.placement = occupy(
    this.grid.placement,
    Object.assign({}, this, { width, height }),
    this
  )
  this.width = width
  this.height = height
}
