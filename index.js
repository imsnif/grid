'use strict'

const assert = require('assert')
const validate = require('validate.js')

module.exports = Grid

function Grid (width, height) {
  assert(validate.isInteger(width))
  assert(validate.isInteger(height))
  this.width = width
  this.height = height
  this.windows = []
  this.placement = createPlacement(width, height)
}

const createPlacement = (width, height) => {
  return new Array(height)
    .fill([]) // create two dimensional array
    .map(row => new Array(width).fill(0)) // zero fill all cells
}

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

Object.defineProperty(Grid.prototype, 'size', {
  get: function() {
    return {
     width: this.width,
     height: this.height
    }
  }
})

Grid.prototype.add = function (unwrappedWindow, x, y) {
  // TODO: assert window opts
  const window = new WindowWrapper(unwrappedWindow, x, y)
  window.grid = this
  this.placement = occupy(this.placement, window) // TODO: pure function
  this.windows.push(window)
}

Grid.prototype.getWindow = function (id) {
  return this.windows.filter(w => w.id === id)[0]
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
