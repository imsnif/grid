'use strict'

const assert = require('assert')
const validate = require('validate.js')
const occupy = require('./occupy-pane')

function checkColumnsInverse (opts) {
  try {
    return checkLinesInverse(opts)
  } catch (e) {
    if (opts.grid.width >= Math.min(...e.blockedColumns) + opts.pane.width) {
      // if there's room left to the right of the rightest block point, check that column
      return checkColumnsInverse(Object.assign({}, opts, {
        x: Math.min(...e.blockedColumns),
        blockedColumns: []
      }))
    } else {
      throw new Error('no space for new pane')
    }
  }
}

function checkLinesInverse (opts) {
  opts.blockedColumns = opts.blockedColumns || []
  try {
    if (opts.bottomToTop) {
      return occupy(opts.grid, Object.assign({}, opts.pane, {x: opts.x, y: opts.y}), true)
    } else {
      return occupy(opts.grid, Object.assign({}, opts.pane, {x: opts.x, y: opts.y}))
    }
  } catch (e) {
    opts.blockedColumns.push(e.coords.x + e.coords.width)
    if (opts.bottomToTop) {
      if (e.coords.y - opts.pane.height >= 0 && opts.y !== 0) {
        // if there's room left to the left of the block, keep checking...
        return checkLinesInverse(Object.assign({}, opts, {y: e.coords.y - opts.pane.height}))
      } else {
        const err = new Error('end of the column')
        err.blockedColumns = opts.blockedColumns
        throw err
      }
    } else {
      if (opts.grid.height - e.coords.y >= opts.pane.height) {
        // if there's room left below the block, keep checking...
        return checkColumnsInverse(Object.assign({}, opts, {y: e.coords.y}))
      } else {
        const err = new Error('end of the line')
        err.blockedColumns = opts.blockedColumns
        throw err
      }
    }
  }
}

function checkLines (opts) {
  try {
    return checkColumns(opts)
  } catch (e) {
    if (opts.grid.height >= Math.min(...e.blockedLines) + opts.pane.height) {
      // if there's room left below highest block point, check that line
      return checkLines(Object.assign({}, opts, {
        y: Math.min(...e.blockedLines),
        blockedLines: []
      }))
    } else {
      throw new Error('no space for new pane')
    }
  }
}

function checkColumns (opts) {
  opts.blockedLines = opts.blockedLines || []
  try {
    if (opts.rightToLeft) {
      return occupy(opts.grid, Object.assign({}, opts.pane, {x: opts.x, y: opts.y}), true)
    } else {
      return occupy(opts.grid, Object.assign({}, opts.pane, {x: opts.x, y: opts.y}))
    }
  } catch (e) {
    opts.blockedLines.push(e.coords.y + e.coords.height)
    if (opts.rightToLeft) {
      if (e.coords.x - opts.pane.width >= 0) {
        // if there's room left to the left of the block, keep checking...
        return checkColumns(Object.assign({}, opts, {x: e.coords.x - opts.pane.width}))
      } else {
        const err = new Error('end of the line')
        err.blockedLines = opts.blockedLines
        throw err
      }
    } else {
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
}

module.exports = function choosePartialLocation (grid, pane, direction) {
  assert(validate.isObject(grid))
  assert(validate.isObject(pane))
  if (direction === 'right') {
    return checkLines({grid, pane, x: pane.x + pane.width, y: pane.y})
  }
  if (direction === 'left') {
    return checkLines({grid, pane, x: pane.x - pane.width, y: pane.y, rightToLeft: true})
  }
  if (direction === 'down') {
    return checkColumnsInverse({grid, pane, x: pane.x, y: pane.y + pane.height})
  }
  if (direction === 'up') {
    return checkColumnsInverse({grid, pane, x: pane.x, y: pane.y - pane.height, bottomToTop: true})
  }
}
