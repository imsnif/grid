'use strict'

const assert = require('assert')
const validate = require('validate.js')
const paneAdder = require('../components/pane-adder')
const paneRemover = require('../components/pane-remover')
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
  return Object.assign(
    state,
    paneAdder(state),
    paneGetter(state),
    paneRemover(state)
  )
}
