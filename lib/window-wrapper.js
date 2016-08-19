'use strict'

const occupy = require('./occupy-window')
const assert = require('assert')
const validate = require('validate.js')
const EventEmitter = require('events').EventEmitter

module.exports = WindowWrapper

function WindowWrapper (constructor, opts) {
  assert(validate.isInteger(opts.x))
  assert(validate.isInteger(opts.y))

  this.id = opts.id
  this.width = opts.width
  this.height = opts.height
  this.x = opts.x
  this.y = opts.y
  this.CreateWindow = constructor
  this.opts = opts
  this.on('occupied', () => {
    if (constructor) {
      this.window = new this.CreateWindow(this.opts)
    }
  })
}

WindowWrapper.prototype = EventEmitter.prototype

WindowWrapper.prototype.changeSize = function (width, height) {
  assert(validate.isInteger(width))
  assert(validate.isInteger(height))
  this.grid.representation = occupy(
    this.grid.representation,
    Object.assign({}, this, { width, height }),
    Object.assign({}, this)
  )
  this.width = width
  this.height = height
  if (this.window && this.window.setBounds) {
    const bounds = this.window.getBounds()
    this.window.setBounds(Object.assign({}, bounds, {width, height}))
  }
}

WindowWrapper.prototype.changeLocation = function (x, y) {
  assert(validate.isInteger(x))
  assert(validate.isInteger(y))
  this.grid.representation = occupy(
    this.grid.representation,
    Object.assign({}, this, { x, y }),
    this
  )
  this.x = x
  this.y = y
  if (this.window && this.window.getBounds) {
    const bounds = this.window.getBounds()
    this.window.setBounds(Object.assign({}, bounds, {x, y}))
  }
}
