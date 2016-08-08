'use strict'

const assert = require('assert')
const validate = require('validate.js')
const WindowWrapper = require('./window-wrapper')
const occupy = require('./occupy-window')
const chooseLocation = require('./choose-location')

module.exports = Grid

function Grid (width, height) {
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

Grid.prototype.add = function (unwrappedWindow, opts) {
  opts = opts || {}
  if (unwrappedWindow.constructor && unwrappedWindow.constructor.name !== 'BrowserWindow') {
    assert(validate.isDefined(unwrappedWindow.width))
    assert(validate.isDefined(unwrappedWindow.height))
    assert(validate.isDefined(unwrappedWindow.id))
  }
  const chosenLocation = opts.chooseLocation
    ? chooseLocation(this.representation, unwrappedWindow)
    : undefined
  const y = chosenLocation ? chosenLocation.y : opts.y
  const x = chosenLocation ? chosenLocation.x : opts.x
  const window = new WindowWrapper(unwrappedWindow, x, y)
  window.grid = this
  this.representation = occupy(this.representation, window)
  this.windows.push(window)
}

Grid.prototype.getWindow = function (id) {
  const window = this.windows.filter(w => w.id === id)[0]
  assert(validate.isDefined(window))
  return window
}
