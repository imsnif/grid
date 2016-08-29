'use strict'

const assert = require('assert')
const validate = require('validate.js')
const occupy = require('./occupy-pane')

function checkLines (opts) {
  try {
    return checkColumns(opts)
  } catch (e) {
    if (opts.grid.height >= Math.min(...e.blockedLines) + opts.pane.height) {
      // if there's room left below highest block point, check that line
      return checkLines(Object.assign({}, opts, {y: Math.min(...e.blockedLines)}))
    } else {
      throw new Error('no space for new pane')
    }
  }
}

function checkColumns (opts) {
  opts.blockedLines = opts.blockedLines || []
  try {
    return occupy(opts.grid, Object.assign({}, opts.pane, {x: opts.x, y: opts.y}))
  } catch (e) {
    opts.blockedLines.push(e.coords.y)
    if (opts.grid.width >= e.coords.x + opts.pane.width) {
      // if there's room left to the right of the block, keep checking...
      return checkColumns(Object.assign({}, opts, {x: e.coords.x}))
    } else {
      const err = new Error('end of the line')
      err.blockedLines = opts.blockedLines
      throw err
    }
  }
}

module.exports = function chooseLocation (grid, pane) {
  assert(validate.isObject(grid))
  assert(validate.isObject(pane))
  return checkLines({grid, pane, x: 0, y: 0})
}
