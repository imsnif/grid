'use strict'

const assert = require('assert')
const validate = require('validate.js')
const getters = require('../components/getters')
const paneAdder = require('../components/pane-adder')
const paneGetter = require('../components/pane-getter')

module.exports = Grid

function Grid (width, height, offset) {
  assert(validate.isInteger(width), `${width} is not an integer`)
  assert(validate.isInteger(height), `${height} is not an integer`)
  offset = offset || { x: 0, y: 0 }
  let state = {
    offset,
    width,
    height,
    panes: []
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
