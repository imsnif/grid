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

test('can add panes to grid', t => {
  t.plan(4)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubWindow, {id: 1, width: 400, height: 600})
    let gridPane
    t.equals(grid.panes.length, 1, 'grid has one pane')
    gridPane = _.pick(grid.getPane(1), ['id', 'width', 'height', 'x', 'y'])
    t.deepEquals(gridPane, {
      id: 1,
      width: 400,
      height: 600,
      x: 0,
      y: 0
    }, 'pane added in default location')
    grid.add(StubWindow, {id: 2, width: 400, height: 600})
    t.equals(grid.panes.length, 2, 'grid has two panes')
    gridPane = _.pick(grid.getPane(2), ['id', 'width', 'height', 'x', 'y'])
    t.deepEquals(gridPane, {
      id: 2,
      width: 400,
      height: 600,
      x: 400,
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
    grid.add(StubWindow, {id: 1, width: 200, height: 100})
    t.throws(
      () => grid.add(StubWindow, {id: 2, width: 200, height: 100, x: 199, y: 0}),
      Error,
      'pane cannot be created over existing pane on x axis'
    )
    t.throws(
      () => grid.add(StubWindow, {id: 2, width: 200, height: 100, x: 0, y: 99}),
      Error,
      'pane cannot be created over existing pane on y axis'
    )
    t.throws(
      () => grid.add(StubWindow, {id: 2, width: 200, height: 100, x: 199, y: 99}),
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
      () => grid.add(StubWindow, {id: 1, width: 200, height: 100, x: 1401, y: 0}),
      Error,
      'pane cannot exceed grid horizontal bounds'
    )
    t.throws(
      () => grid.add(StubWindow, {id: 1, width: 200, height: 100, x: 0, y: 801}),
      Error,
      'pane canonot exceed grid vertical bounds'
    )
    t.throws(
      () => grid.add(StubWindow, {id: 2, width: WIDTH + 1, height: HEIGHT}),
      Error,
      'cannot add pane wider than grid'
    )
    t.throws(
      () => grid.add(StubWindow, {id: 2, width: WIDTH, height: HEIGHT + 1}),
      Error,
      'cannot add pane taller than grid'
    )
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})
