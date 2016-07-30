'use strict'

const assert = require('assert')
const validate = require('validate.js')
const occupy = require('./occupy-window')

module.exports = WindowWrapper

function WindowWrapper (window, x, y) {
  this.id = window.id
  this.width = window.width
  this.height = window.height
  this.x = x || 0
  this.y = y || 0
}

WindowWrapper.prototype.changeSize = function(width, height) {
  this.grid.representation = occupy(
    this.grid.representation,
    Object.assign({}, this, { width, height }),
    Object.assign({}, this)
  )
  this.width = width
  this.height = height
}

WindowWrapper.prototype.changeLocation = function(x, y) {
  this.grid.representation = occupy(
    this.grid.representation,
    Object.assign({}, this, { x, y }),
    this
  )
  this.x = x
  this.y = y
}
