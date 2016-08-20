'use strict'
import test from 'tape'
import Grid from '../../'
import _ from 'lodash'

const WIDTH = 1600
const HEIGHT = 900

function BrowserWindow (opts) {
  // mock electron BrowserWindow
  this.id = opts.id
  this.width = opts.width
  this.height = opts.height
}

BrowserWindow.prototype.getBounds = function () {
  return {
    width: this.width,
    height: this.height,
    x: this.x,
    y: this.y
  }
}

BrowserWindow.prototype.setBounds = function (bounds) {
  this.width = bounds.width
  this.height = bounds.height
  this.x = bounds.x
  this.y = bounds.y
}

test('can add panes to grid', t => {
  t.plan(4)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(BrowserWindow, {id: 1, width: 400, height: 600})
    t.equals(grid.panes.length, 1, 'grid has one pane')
    const gridPane1 = _.pick(grid.getPane(1), ['x', 'y'])
    t.deepEquals(gridPane1, {
      x: 0,
      y: 0
    }, 'pane added in default location')
    grid.add(BrowserWindow, {id: 2, width: 400, height: 600, x: 450, y: 0})
    t.equals(grid.panes.length, 2, 'grid has two panes')
    const gridPane2 = _.pick(grid.getPane(2), ['x', 'y'])
    t.deepEquals(gridPane2, {
      x: 450,
      y: 0
    }, 'pane added in custom location')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('panes should not be created over each other', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(BrowserWindow, {id: 1, width: 200, height: 100})
    t.throws(
      () => grid.add(BrowserWindow, {id: 2, width: 200, height: 100, x: 199, y: 0}),
      Error,
      'pane cannot be created over existing pane on x axis'
    )
    t.throws(
      () => grid.add(BrowserWindow, {id: 2, width: 200, height: 100, x: 0, y: 99}),
      Error,
      'pane cannot be created over existing pane on y axis'
    )
    t.throws(
      () => grid.add(BrowserWindow, {id: 2, width: 200, height: 100, x: 199, y: 99}),
      Error,
      'pane cannot be created over existing pane on multiple axes'
    )
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('panes should not be created outside grid', t => {
  t.plan(4)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    t.throws(
      () => grid.add(BrowserWindow, {id: 1, width: 200, height: 100, x: 1401, y: 0}),
      Error,
      'pane cannot exceed grid horizontal bounds'
    )
    t.throws(
      () => grid.add(BrowserWindow, {id: 1, width: 200, height: 100, x: 0, y: 801}),
      Error,
      'pane canonot exceed grid vertical bounds'
    )
    t.throws(
      () => grid.add(BrowserWindow, {id: 2, width: WIDTH + 1, height: HEIGHT}),
      Error,
      'cannot add pane wider than grid'
    )
    t.throws(
      () => grid.add(BrowserWindow, {id: 2, width: WIDTH, height: HEIGHT + 1}),
      Error,
      'cannot add pane taller than grid'
    )
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})
