'use strict'

const assert = require('assert')
const validate = require('validate.js')
const occupy = require('./occupy-window')

module.exports = WindowWrapper

function WindowWrapper (window, x, y) {
  this.id = window.id
  const bounds = window.constructor.name === 'BrowserWindow'
    ? window.getBounds()
    : {
      width: window.width,
      height: window.height,
      x: x || 0,
      y: y || 0
    }
  bounds.x = x || bounds.x || 0
  bounds.y = y || bounds.y || 0
  this.width = bounds.width
  this.height = bounds.height
  this.x = bounds.x
  this.y = bounds.y
  this.window = window
  if (this.window.constructor.name === 'BrowserWindow') {
    this.window.setBounds(bounds)
  }
}

WindowWrapper.prototype.changeSize = function(width, height) {
  this.grid.representation = occupy(
    this.grid.representation,
    Object.assign({}, this, { width, height }),
    Object.assign({}, this)
  )
  this.width = width
  this.height = height
  if (this.window.constructor.name === 'BrowserWindow') {
    const bounds = this.window.getBounds()
    this.window.setBounds(Object.assign({}, bounds, {width, height}))
  }
}

WindowWrapper.prototype.changeLocation = function(x, y) {
  this.grid.representation = occupy(
    this.grid.representation,
    Object.assign({}, this, { x, y }),
    this
  )
  this.x = x
  this.y = y
  if (this.window.constructor.name === 'BrowserWindow') {
    const bounds = this.window.getBounds()
    this.window.setBounds(Object.assign({}, bounds, {x, y}))
  }
}
