'use strict'

import test from 'tape'
import Grid from '../../'
import _ from 'lodash'

const WIDTH = 1600
const HEIGHT = 900

function StubWindow (id, width, height) {
  this.id = id
  this.width = width
  this.height = height
}

test('can add windows to grid', t => {
  t.plan(4)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    const stubWindow1 = new StubWindow(1, 400, 600)
    const stubWindow2 = new StubWindow(2, 400, 600)
    let gridWindow
    grid.add(stubWindow1)
    t.equals(grid.windows.length, 1, 'grid has one window')
    gridWindow = _.pick(grid.getWindow(1), ['id', 'width', 'height', 'x', 'y'])
    t.deepEquals(gridWindow, Object.assign({}, stubWindow1, {
      x: 0,
      y: 0
    }), 'window added in default location')
    grid.add(stubWindow2, {x: 950, y: 0})
    t.equals(grid.windows.length, 2, 'grid has two windows')
    gridWindow = _.pick(grid.getWindow(2), ['id', 'width', 'height', 'x', 'y'])
    t.deepEquals(gridWindow, Object.assign({}, stubWindow2, {
      x: 950,
      y: 0
    }), 'window added in custom location')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('windows should not be created over each other', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    const stubWindow1 = new StubWindow(1, 200, 100)
    const stubWindow2 = new StubWindow(2, 200, 100)
    grid.add(stubWindow1)
    t.throws(
      () => grid.add(stubWindow2, {x: 199, y: 0}),
      Error,
      'window cannot be created over existing window on x axis'
    )
    t.throws(
      () => grid.add(stubWindow2, {x: 0, y: 99}),
      Error,
      'window cannot be created over existing window on y axis'
    )
    t.throws(
      () => grid.add(stubWindow2, {x: 199, y: 99}),
      Error,
      'window cannot be created over existing window on multiple axes'
    )
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('windows should not be created outside grid', t => {
  t.plan(4)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    const stubWindow = new StubWindow(1, 200, 100)
    const fatStubWindow = new StubWindow(2, WIDTH + 1, HEIGHT)
    const tallStubWindow = new StubWindow(2, WIDTH, HEIGHT + 1)
    t.throws(
      () => grid.add(stubWindow, {x: 1401, y: 0}),
      Error,
      'window cannot exceed grid horizontal bounds'
    )
    t.throws(
      () => grid.add(stubWindow, {x: 0, y: 801}),
      Error,
      'window canonot exceed grid vertical bounds'
    )
    t.throws(
      () => grid.add(fatStubWindow),
      Error,
      'cannot add window wider than grid'
    )
    t.throws(
      () => grid.add(tallStubWindow),
      Error,
      'cannot add window taller than grid'
    )
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})
