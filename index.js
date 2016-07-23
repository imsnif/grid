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

const occupy = (placement, window) => {
  const firstVerticalPoint = window.y
  const firstHorizontalPoint = window.x
  const lastVerticalPoint = window.height + window.y
  const lastHorizontalPoint = window.width + window.x
  for (let y = firstVerticalPoint; y < lastVerticalPoint; y += 1) {
    for (let x = firstHorizontalPoint; x < lastHorizontalPoint; x += 1) {
      placement[y][x] = window.id
    }
  }
}

const spaceIsOccupied = (window, placement) => {
  return new Array(window.height).fill([])
    .some((row, rowIndex) => {
      return new Array(window.width).fill(window.id)
        .some((cell, cellIndex) => {
          if (placement[window.y + rowIndex][window.x + cellIndex] !== 0) {
            return true
          } else {
            return false
          }
        })
    })
}

Object.defineProperty(Grid.prototype, 'size', {
  get: function() {
    return {
     width: this.width,
     height: this.height
    }
  }
})

Grid.prototype.add = function (size, x, y) {
  const window = Object.assign({}, size, {
    x: x || 0,
    y: y || 0
  })
  if (spaceIsOccupied(window, this.placement)) {
    throw new Error('Failed to create window - space is occupied')
  }
  occupy(this.placement, window) // TODO: pure function
  this.windows.push(window)
}

Grid.prototype.getWindow = function (id) {
  return this.windows.filter(w => w.id === id)[0]
}
