'use strict'

const assert = require('assert')
const validate = require('validate.js')
const occupy = require('./occupy-pane')

module.exports = function chooseLocation (grid, pane) {
  assert(validate.isObject(grid))
  assert(validate.isObject(pane))
  let y = 0
  while (y !== false) {
    let x = 0
    let blockedLines = []
    while (x !== false) {
      try {
        const occupied = occupy(grid, Object.assign({}, pane, {x, y}))
        return occupied
      } catch (e) {
        blockedLines.push(e.coords.y)
        if (grid.width >= e.coords.x + pane.width) {
          x = e.coords.x
        } else {
          x = false
        }
      }
    }
    if (grid.height >= Math.min(...blockedLines) + pane.height) {
      y = Math.min(...blockedLines)
    } else {
      throw new Error('no space for new pane')
    }
  }
}
