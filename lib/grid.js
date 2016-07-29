'use strict'

const assert = require('assert')
const validate = require('validate.js')
const WindowWrapper = require('./window-wrapper')
const occupy = require('./occupy-window')

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
