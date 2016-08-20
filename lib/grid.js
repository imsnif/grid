'use strict'

const assert = require('assert')
const validate = require('validate.js')
const getters = require('../components/getters')
const paneAdder = require('../components/pane-adder')
const paneGetter = require('../components/pane-getter')

module.exports = Grid

function createRepresentation (width, height) {
  return new Array(height)
    .fill([]) // create two dimensional array
    .map(row => new Array(width).fill(0)) // zero fill all cells
}

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

