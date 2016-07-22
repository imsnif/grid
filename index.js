'use strict'

module.exports = Grid

function Grid (width, height) {
  if (!Number.isInteger(width) || !Number.isInteger(height)) {
    throw new Error('width and height should be numeric')
    // throw new Error('width and height should be numeric')
  }
  this.width = width
  this.height = height
  this.windows = []
}

Object.defineProperty(Grid.prototype, 'size', {
  get: function() {
    return {
     width: this.width,
     height: this.height
    }
  }
})

Grid.prototype.add = function (window) {
  this.windows.push(window)
}
