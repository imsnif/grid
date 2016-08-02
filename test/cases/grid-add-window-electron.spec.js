'use strict'

import test from 'tape'
import Grid from '../../'
import _ from 'lodash'

const WIDTH = 1600
const HEIGHT = 900

function BrowserWindow (id, width, height) {
  // mock electron BrowserWindow
  this.id = id
  this.width = width
  this.height = height
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

test('can add windows to grid', t => {
  t.plan(4)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    const stubWindow1 = new BrowserWindow(1, 400, 600)
    const stubWindow2 = new BrowserWindow(2, 400, 600)
    let gridWindow
    grid.add(stubWindow1)
    t.equals(grid.windows.length, 1, 'grid has one window')
    const bounds = stubWindow1.getBounds()
    t.deepEquals(grid.getWindow(1).window.getBounds(), Object.assign({}, bounds, {
      x: 0,
      y: 0
    }), 'window added in default location')
    grid.add(stubWindow2, 450, 0)
    t.equals(grid.windows.length, 2, 'grid has two windows')
    gridWindow = grid.getWindow(2)
    t.deepEquals(grid.getWindow(2).window.getBounds(), Object.assign(stubWindow2.getBounds(), {
      x: 450,
      y: 0
    }), 'window added in custom location')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test.skip('windows should not be created over each other', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    const stubWindow1 = new BrowserWindow(1, 200, 100)
    const stubWindow2 = new BrowserWindow(2, 200, 100)
    grid.add(stubWindow1)
    t.throws(
      () => grid.add(stubWindow2, 199, 0),
      Error,
      'window cannot be created over existing window on x axis'
    )
    t.throws(
      () => grid.add(stubWindow2, 0, 99),
      Error,
      'window cannot be created over existing window on y axis'
    )
    t.throws(
      () => grid.add(stubWindow2, 199, 99),
      Error,
      'window cannot be created over existing window on multiple axes'
    )
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test.skip('windows should not be created outside grid', t => {
  t.plan(4)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    const stubWindow = new BrowserWindow(1, 200, 100)
    const fatBrowserWindow = new BrowserWindow(2, WIDTH + 1, HEIGHT)
    const tallBrowserWindow = new BrowserWindow(2, WIDTH, HEIGHT + 1)
    t.throws(
      () => grid.add(stubWindow, 1401, 0),
      Error,
      'window cannot exceed grid horizontal bounds'
    )
    t.throws(
      () => grid.add(stubWindow, 0, 801),
      Error,
      'window canonot exceed grid vertical bounds'
    )
    t.throws(
      () => grid.add(fatBrowserWindow),
      Error,
      'cannot add window wider than grid'
    )
    t.throws(
      () => grid.add(tallBrowserWindow),
      Error,
      'cannot add window taller than grid'
    )
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})
