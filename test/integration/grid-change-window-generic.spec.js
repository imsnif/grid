'use strict'

import test from 'tape'
import Grid from '../../'
import _ from 'lodash'

const WIDTH = 1600
const HEIGHT = 900

test('cannot resize window over another window', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(null, {id: 1, width: 400, height: 100})
    grid.add(null, {id: 2, width: 400, height: 100, x: 400, y: 0})
    grid.add(null, {id: 3, width: 400, height: 100, x: 0, y: 100})
    t.throws(
      () => grid.getWindow(1).changeSize(401, 100),
      Error,
      'cannot resize window horizontally over another'
    )
    t.throws(
      () => grid.getWindow(1).changeSize(400, 101),
      Error,
      'cannot resize window vertically over another'
    )
    t.equals(grid.windows.length, 3, 'grid windows still present')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('cannot move window over another window', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(null, {id: 1, width: 400, height: 100})
    grid.add(null, {id: 2, width: 400, height: 100, x: 400, y: 0})
    grid.add(null, {id: 3, width: 400, height: 100, x: 0, y: 100})
    t.throws(
      () => grid.getWindow(1).changeLocation(1, 0),
      Error,
      'cannot move window horizontally over another'
    )
    t.throws(
      () => grid.getWindow(1).changeLocation(0, 1),
      Error,
      'cannot move window vertically over another'
    )
    t.equals(grid.windows.length, 3, 'grid windows still present')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('cannot resize window outside grid', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(null, {id: 1, width: 400, height: 100})
    t.throws(
      () => grid.getWindow(1).changeSize(1601, 100),
      Error,
      'cannot resize window horizontally outside grid'
    )
    t.throws(
      () => grid.getWindow(1).changeSize(400, 901),
      Error,
      'cannot resize window vertically outside grid'
    )
    t.equals(grid.windows.length, 1, 'grid window still present')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('cannot move window outside grid', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(null, {id: 1, width: 400, height: 100})
    t.throws(
      () => grid.getWindow(1).changeLocation(1201, 100),
      Error,
      'cannot move window horizontally outside grid'
    )
    t.throws(
      () => grid.getWindow(1).changeLocation(400, 801),
      Error,
      'cannot move window vertically outside grid'
    )
    t.equals(grid.windows.length, 1, 'grid window still present')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('can move window into location vacated by another', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(null, {id: 1, width: 400, height: 100})
    grid.add(null, {id: 2, width: 400, height: 100, x: 400, y: 0})
    grid.getWindow(1).changeLocation(0, 100)
    grid.getWindow(2).changeLocation(0, 0)
    t.equals(grid.windows.length, 2, 'grid windows still present')
    t.deepEquals(_.pick(grid.getWindow(2), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 400,
      height: 100
    }, 'window size changed')
    t.deepEquals(_.pick(grid.getWindow(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 100,
      width: 400,
      height: 100
    }, 'window size changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('cannot move window when representation is corrupt', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    const initialRepresentation = grid.representation.map(r => r.slice())
    grid.add(null, {id: 1, width: 200, height: 100})
    grid.representation = initialRepresentation // corrupt the representation
    t.throws(
      () => grid.getWindow(1).changeLocation(1, 1),
      Error,
      'window cannot be added when grid representation is corrupt'
    )
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('grid can decide window location horizontally', t => {
  t.plan(4)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(null, {id: 1, width: 400, height: 100})
    t.equals(grid.windows.length, 1, 'grid window added to grid')
    t.deepEquals(_.pick(grid.getWindow(1), ['x', 'y']), {x: 0, y: 0}, 'window added directly to the right')
    grid.add(null, {id: 2, width: 400, height: 100})
    t.deepEquals(_.pick(grid.getWindow(2), ['x', 'y']), {x: 400, y: 0}, 'window added directly to the right')
    t.equals(grid.windows.length, 2, 'second grid window added to grid')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('grid can decide window location horizontally with vertical blockage', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(null, {id: 1, width: 400, height: 100})
    grid.add(null, {id: 2, width: 400, height: 100, x: 400, y: 20})
    grid.add(null, {id: 3, width: 400, height: 100})
    t.deepEquals(_.pick(grid.getWindow(3), ['x', 'y']), {x: 800, y: 0}, 'window skipped horizontal blockage')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('grid can decide window location horizontally with horizontal blockage', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(null, {id: 1, width: 400, height: 100})
    grid.add(null, {id: 2, width: 400, height: 100, x: 405, y: 0})
    grid.add(null, {id: 3, width: 300, height: 100})
    t.deepEquals(_.pick(grid.getWindow(3), ['x', 'y']), {x: 805, y: 0}, 'window skipped horizontal blockage')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('grid can decide window location horizontally with multiple horizontal options', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(null, {id: 1, width: 400, height: 100})
    grid.add(null, {id: 2, width: 400, height: 100, x: 400, y: 10})
    grid.add(null, {id: 3, width: 400, height: 100, x: 800, y: 0})
    grid.add(null, {id: 4, width: 400, height: 100})
    t.deepEquals(_.pick(grid.getWindow(4), ['x', 'y']), {x: 1200, y: 0}, 'window skipped horizontal blockage')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('grid can decide window location vertically', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(null, {id: 1, width: 1600, height: 100})
    grid.add(null, {id: 2, width: 400, height: 100})
    t.deepEquals(_.pick(grid.getWindow(2), ['x', 'y']), {x: 0, y: 100}, 'window added directly to the right')
    t.equals(grid.windows.length, 2, 'second grid window added to grid')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('grid cannot decide to add window to full grid', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(null, {id: 1, width: 700, height: 460})
    grid.add(null, {id: 2, width: 700, height: 460})
    t.throws(
      () => grid.add(null, {id: 1, width: 700, height: 460}),
      Error,
      'Cannot decide to add a window to a full grid'
    )
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})
