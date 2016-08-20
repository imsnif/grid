'use strict'

const assert = require('assert')
const validate = require('validate.js')
const PaneWrapper = require('./pane-wrapper')
const occupy = require('../services/occupy-pane')
const chooseLocation = require('../services/choose-location')
const getters = require('../components/getters')

module.exports = Grid

function Grid (width, height) {
  // TODO: add validate messages
  assert(validate.isInteger(width))
  assert(validate.isInteger(height))
  let state = {
    width,
    height,
    panes: [],
    representation: createRepresentation(width, height)
  }
  return Object.defineProperties(
    Object.assign(
      {},
      paneAdder(state),
      paneGetter(state)
    ),
    getters(state)
  )
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


Grid.prototype.getpane = function (id) {
  const pane = this.panes.filter(w => w.id === id)[0]
  assert(validate.isDefined(pane))
  return pane
}
