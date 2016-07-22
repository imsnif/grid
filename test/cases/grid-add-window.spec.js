'use strict'

import test from 'tape'
import Grid from '../../'

const WIDTH = 1600
const HEIGHT = 900

function StubWindow (width, height, x, y) {
  return {
    width: width || 200,
    height: height || 100,
    x: x || 0,
    y: y || 0
  }
}

test('can add windows to grid', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(new StubWindow())
    t.equals(grid.windows.length, 1, 'grid has one window')
    grid.add(new StubWindow())
    t.equals(grid.windows.length, 2, 'grid has two windows')
  } catch (e) {
    t.fail(e.toString())
  }
})

test.skip('windows should not be created over each other', t => {
  // TBD
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
