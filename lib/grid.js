'use strict'

const assert = require('assert')
const validate = require('validate.js')
const WindowWrapper = require('./window-wrapper')
const occupy = require('./occupy-window')
const chooseLocation = require('./choose-location')

module.exports = Grid

function Grid (width, height) {
  // TODO: add validate messages
  assert(validate.isInteger(width))
  assert(validate.isInteger(height))
  this.width = width
  this.height = height
  this.windows = []
  this.representation = createRepresentation(width, height)
}

const createRepresentation = (width, height) => {
  return new Array(height)
    .fill([]) // create two dimensional array
    .map(row => new Array(width).fill(0)) // zero fill all cells
}

Object.defineProperty(Grid.prototype, 'size', {
  get: function () {
    return {
      width: this.width,
      height: this.height
    }
  }
})

Grid.prototype.add = function (constructor, opts) {
  opts = opts || {}
  assert(validate.isDefined(opts.width))
  assert(validate.isDefined(opts.height))
  assert(validate.isDefined(opts.id))
  assert(this.windows.every(w => w.Id !== opts.id))
  if (typeof opts.y === 'undefined' || typeof opts.x === 'undefined') {
    const chosen = chooseLocation(this.representation, {
      width: opts.width,
      height: opts.height
    })
    opts.x = chosen.x
    opts.y = chosen.y
  }
  const window = new WindowWrapper(constructor, opts)
  window.grid = this
  this.representation = occupy(this.representation, window)
  window.emit('occupied')
  this.windows.push(window)
}

Grid.prototype.getWindow = function (id) {
  const window = this.windows.filter(w => w.id === id)[0]
  assert(validate.isDefined(window))
  return window
}
