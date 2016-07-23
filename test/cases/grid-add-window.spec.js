'use strict'

import test from 'tape'
import Grid from '../../'

const WIDTH = 1600
const HEIGHT = 900

function StubWindow (id, width, height) {
  this.id = id
  this.width = width,
  this.height = height
}

test('can add windows to grid', t => {
  t.plan(4)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    const stubWindow1 = new StubWindow(1, 400, 600)
    const stubWindow2 = new StubWindow(2, 400, 600)
    grid.add(stubWindow1)
    t.equals(grid.windows.length, 1, 'grid has one window')
    t.deepEquals(grid.getWindow(1), Object.assign({}, stubWindow1, {
      x: 0,
      y: 0
    }), 'window added in default location')
    grid.add(stubWindow2, 950, 0)
    t.equals(grid.windows.length, 2, 'grid has two windows')
    t.deepEquals(grid.getWindow(2), Object.assign({}, stubWindow2, {
      x: 950,
      y: 0
    }), 'window added in custom location')
  } catch (e) {
    t.fail(e.toString())
  }
})

test('windows should not be created over each other', t => {
  t.plan(7)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    const stubWindow1 = new StubWindow(1, 200, 100)
    const stubWindow2 = new StubWindow(2, 200, 100)
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
    t.throws(
      () => grid.add(stubWindow2, 1401, 0),
      Error,
      'window cannot exceed grid horizontal bounds'
    )
    t.throws(
      () => grid.add(stubWindow2, 0, 801),
      Error,
      'window canonot exceed grid vertical bounds'
    )
    t.equals(grid.windows.length, 1, 'grid still has one window')
    t.deepEquals(grid.getWindow(1), Object.assign({}, stubWindow1, {
      x: 0,
      y: 0
    }), 'first window still present')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test.skip('can add window to grid in custom location', async t => {
  // TBD:
  // window cannot be created outside screen bounds
})

test.skip('cannot add window to grid over another window ', async t => {
  // TBD:
  // window cannot be created outside screen bounds
})

test.skip('can change window bounds', async t => {
  // TBD
})

test.skip('cannot change window bounds over an existing window', async t => {
  // TBD
  // fully
  // partially
})
