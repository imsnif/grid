'use strict'

const assert = require('assert')
const validate = require('validate.js')

function detectBottomVerticalObstruction (pane, sibling) {
  if (
    sibling.x < pane.x + pane.width &&
    sibling.x + sibling.width > pane.x &&
    sibling.y > pane.y
  ) {
    return true
  }
}

module.exports = {
  up: function (pane) {
    // TBD
  },
  down: function (pane) {
    assert(validate.isObject(pane), `${pane} must be an object`)
    const grid = pane.grid
    const obstructions = grid.panes
      .filter(p => p.id !== pane.id)
      .filter((sibling) => detectBottomVerticalObstruction(pane, sibling))
    const newHeight = obstructions.length > 0
      ? Math.min(...obstructions.map(o => o.y)) - pane.y
      : grid.height - pane.y
    return newHeight
  },
  left: function (pane) {
    // TBD
  },
  right: function (pane) {
    // TBD
  }
}
