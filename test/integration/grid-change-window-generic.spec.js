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

test('cannot resize window over another window', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    const stubWindow1 = new StubWindow(1, 400, 100)
    const stubWindow2 = new StubWindow(2, 400, 100)
    const stubWindow3 = new StubWindow(3, 400, 100)
    grid.add(stubWindow1)
    grid.add(stubWindow2, {x: 400})
    grid.add(stubWindow3, {x: 0, y: 100})
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
    const stubWindow1 = new StubWindow(1, 400, 100)
    const stubWindow2 = new StubWindow(2, 400, 100)
    const stubWindow3 = new StubWindow(3, 400, 100)
    grid.add(stubWindow1)
    grid.add(stubWindow2, {x: 400})
    grid.add(stubWindow3, {x: 0, y: 100})
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
    const stubWindow1 = new StubWindow(1, 400, 100)
    grid.add(stubWindow1)
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
    const stubWindow1 = new StubWindow(1, 400, 100)
    grid.add(stubWindow1)
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
    const stubWindow1 = new StubWindow(1, 400, 100)
    const stubWindow2 = new StubWindow(2, 400, 100)
    grid.add(stubWindow1)
    grid.add(stubWindow2, {x: 400})
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
    const stubWindow = new StubWindow(1, 200, 100)
    grid.add(stubWindow)
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

test('grid can decide window location horizontally ', t => {
  t.plan(4)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    const stubWindow1 = new StubWindow(1, 400, 100)
    const stubWindow2 = new StubWindow(2, 400, 100)
    grid.add(stubWindow1, {chooseLocation: true})
    t.equals(grid.windows.length, 1, 'grid window added to grid')
    t.deepEquals(_.pick(grid.getWindow(1), ['x', 'y']), {x: 0, y: 0}, 'window added directly to the right')
    grid.add(stubWindow2, {chooseLocation: true})
    t.deepEquals(_.pick(grid.getWindow(2), ['x', 'y']), {x: 400, y: 0}, 'window added directly to the right')
    t.equals(grid.windows.length, 2, 'second grid window added to grid')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('grid can decide window location vertically', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    const stubWindow1 = new StubWindow(1, 1600, 100)
    const stubWindow2 = new StubWindow(2, 1600, 100)
    grid.add(stubWindow1, {chooseLocation: true})
    grid.add(stubWindow2, {chooseLocation: true})
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
    const stubWindow1 = new StubWindow(1, 700, 460)
    const stubWindow2 = new StubWindow(2, 700, 460)
    const stubWindow3 = new StubWindow(3, 700, 460)
    grid.add(stubWindow1, {chooseLocation: true})
    grid.add(stubWindow2, {chooseLocation: true})
    t.throws(
      () => grid.add(stubWindow3, {chooseLocation: true}),
      Error,
      'Cannot decide to add a window to a full grid'
    )
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})
