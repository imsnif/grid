'use strict'

import test from 'tape'
import Grid from '../../'
import _ from 'lodash'

const WIDTH = 1600
const HEIGHT = 900

test('cannot resize pane over another pane', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(null, {id: 1, width: 400, height: 100})
    grid.add(null, {id: 2, width: 400, height: 100, x: 400, y: 0})
    grid.add(null, {id: 3, width: 400, height: 100, x: 0, y: 100})
    t.throws(
      () => grid.getPane(1).changeSize(401, 100),
      Error,
      'cannot resize pane horizontally over another'
    )
    t.throws(
      () => grid.getPane(1).changeSize(400, 101),
      Error,
      'cannot resize pane vertically over another'
    )
    t.equals(grid.panes.length, 3, 'grid panes still present')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('cannot move pane over another pane', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(null, {id: 1, width: 400, height: 100})
    grid.add(null, {id: 2, width: 400, height: 100, x: 400, y: 0})
    grid.add(null, {id: 3, width: 400, height: 100, x: 0, y: 100})
    t.throws(
      () => grid.getPane(1).changeLocation(1, 0),
      Error,
      'cannot move pane horizontally over another'
    )
    t.throws(
      () => grid.getPane(1).changeLocation(0, 1),
      Error,
      'cannot move pane vertically over another'
    )
    t.equals(grid.panes.length, 3, 'grid panes still present')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('cannot move pane over another pane with changeOrMaxLocation', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(null, {id: 1, width: 400, height: 100})
    grid.add(null, {id: 2, width: 400, height: 100, x: 400, y: 0})
    grid.add(null, {id: 3, width: 400, height: 100, x: 0, y: 100})
    t.throws(
      () => grid.getPane(1).changeLocationOrMaxLocation(1, 0),
      Error,
      'cannot move pane horizontally over another'
    )
    t.throws(
      () => grid.getPane(1).changeLocationOrMaxLocation(0, 1),
      Error,
      'cannot move pane vertically over another'
    )
    t.equals(grid.panes.length, 3, 'grid panes still present')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('cannot resize pane outside grid', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(null, {id: 1, width: 400, height: 100})
    t.throws(
      () => grid.getPane(1).changeSize(1601, 100),
      Error,
      'cannot resize pane horizontally outside grid'
    )
    t.throws(
      () => grid.getPane(1).changeSize(400, 901),
      Error,
      'cannot resize pane vertically outside grid'
    )
    t.equals(grid.panes.length, 1, 'grid pane still present')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('cannot move pane outside grid', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(null, {id: 1, width: 400, height: 100})
    t.throws(
      () => grid.getPane(1).changeLocation(1201, 100),
      Error,
      'cannot move pane horizontally outside grid'
    )
    t.throws(
      () => grid.getPane(1).changeLocation(400, 801),
      Error,
      'cannot move pane vertically outside grid'
    )
    t.equals(grid.panes.length, 1, 'grid pane still present')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('can move pane into location vacated by another', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(null, {id: 1, width: 400, height: 100})
    grid.add(null, {id: 2, width: 400, height: 100, x: 400, y: 0})
    grid.getPane(1).changeLocation(0, 100)
    grid.getPane(2).changeLocation(0, 0)
    t.equals(grid.panes.length, 2, 'grid panes still present')
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 400,
      height: 100
    }, 'pane size changed')
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 100,
      width: 400,
      height: 100
    }, 'pane size changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('grid can decide pane location horizontally', t => {
  t.plan(4)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(null, {id: 1, width: 400, height: 100})
    t.equals(grid.panes.length, 1, 'grid pane added to grid')
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y']), {x: 0, y: 0}, 'pane added directly to the right')
    grid.add(null, {id: 2, width: 400, height: 100})
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y']), {x: 400, y: 0}, 'pane added directly to the right')
    t.equals(grid.panes.length, 2, 'second grid pane added to grid')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('grid can decide pane location horizontally with vertical blockage', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(null, {id: 1, width: 400, height: 100})
    grid.add(null, {id: 2, width: 400, height: 100, x: 400, y: 20})
    grid.add(null, {id: 3, width: 400, height: 100})
    t.deepEquals(_.pick(grid.getPane(3), ['x', 'y']), {x: 800, y: 0}, 'pane skipped horizontal blockage')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('grid can decide pane location horizontally with horizontal blockage', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(null, {id: 1, width: 400, height: 100})
    grid.add(null, {id: 2, width: 400, height: 100, x: 405, y: 0})
    grid.add(null, {id: 3, width: 300, height: 100})
    t.deepEquals(_.pick(grid.getPane(3), ['x', 'y']), {x: 805, y: 0}, 'pane skipped horizontal blockage')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('grid can decide pane location horizontally with multiple horizontal blockage', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(null, {id: 1, width: 400, height: 100})
    grid.add(null, {id: 2, width: 400, height: 100, x: 400, y: 10})
    grid.add(null, {id: 3, width: 400, height: 100, x: 800, y: 0})
    grid.add(null, {id: 4, width: 400, height: 100})
    t.deepEquals(_.pick(grid.getPane(4), ['x', 'y']), {x: 1200, y: 0}, 'pane skipped horizontal blockage')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('grid can decide pane location horizontally with multiple horizontal and vertical blockage', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(null, {id: 1, width: 10, height: 100, x: 10, y: 0})
    grid.add(null, {id: 2, width: 10, height: 150, x: 20, y: 0})
    grid.add(null, {id: 3, width: 1560, height: 10, x: 30, y: 0})
    grid.add(null, {id: 4, width: 400, height: 100})
    t.deepEquals(_.pick(grid.getPane(4), ['x', 'y']), {x: 30, y: 10}, 'pane skipped blockage')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('grid can decide pane location vertically', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(null, {id: 1, width: 1600, height: 100})
    grid.add(null, {id: 2, width: 400, height: 100})
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y']), {x: 0, y: 100}, 'pane added directly to the right')
    t.equals(grid.panes.length, 2, 'second grid pane added to grid')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('grid cannot decide to add pane to full grid', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(null, {id: 1, width: 700, height: 460})
    grid.add(null, {id: 2, width: 700, height: 460})
    t.throws(
      () => grid.add(null, {id: 3, width: 700, height: 460}),
      Error,
      'Cannot decide to add a pane to a full grid'
    )
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})
