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

function detectUpperVerticalObstruction (pane, sibling) {
  if (
    sibling.x < pane.x + pane.width &&
    sibling.x + sibling.width > pane.x &&
    sibling.y + sibling.height <= pane.y
  ) {
    return true
  }
}

function detectRightHorizontalObstruction (pane, sibling) {
  if (
    sibling.y < pane.y + pane.height &&
    sibling.y + sibling.height > pane.y &&
    sibling.x > pane.x
  ) {
    return true
  }
}

function detectLeftHorizontalObstruction (pane, sibling) {
  if (
    sibling.y < pane.y + pane.height &&
    sibling.y + sibling.height > pane.y &&
    sibling.x + sibling.width <= pane.x
  ) {
    return true
  }
}

module.exports = {
  up: function (pane) {
    assert(validate.isObject(pane), `${pane} must be an object`)
    const grid = pane.grid
    const obstructions = grid.panes
      .filter(p => p.id !== pane.id)
      .filter((sibling) => detectUpperVerticalObstruction(pane, sibling))
    const y = obstructions.length > 0
      ? Math.max(...obstructions.map(o => o.y + o.height))
      : 0
    const height = pane.height + (pane.y - y)
    return { height, y: y }
  },
  down: function (pane) {
    assert(validate.isObject(pane), `${pane} must be an object`)
    const grid = pane.grid
    const obstructions = grid.panes
      .filter(p => p.id !== pane.id)
      .filter((sibling) => detectBottomVerticalObstruction(pane, sibling))
    const height = obstructions.length > 0
      ? Math.min(...obstructions.map(o => o.y)) - pane.y
      : grid.height - pane.y
    return { height, y: pane.y }
  },
  left: function (pane) {
    assert(validate.isObject(pane), `${pane} must be an object`)
    const grid = pane.grid
    const obstructions = grid.panes
      .filter(p => p.id !== pane.id)
      .filter((sibling) => detectLeftHorizontalObstruction(pane, sibling))
    const x = obstructions.length > 0
      ? Math.max(...obstructions.map(o => o.x + o.width))
      : 0
    const width = pane.width + (pane.x - x)
    return { width, x: x }
  },
  right: function (pane) {
    assert(validate.isObject(pane), `${pane} must be an object`)
    const grid = pane.grid
    const obstructions = grid.panes
      .filter(p => p.id !== pane.id)
      .filter((sibling) => detectRightHorizontalObstruction(pane, sibling))
    const width = obstructions.length > 0
      ? Math.min(...obstructions.map(o => o.x)) - pane.x
      : grid.width - pane.x
    return { width, x: pane.x }
  }
}
