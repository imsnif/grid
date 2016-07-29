'use strict'

import test from 'tape'
import Grid from '../../'
import _ from 'lodash'

const WIDTH = 1600
const HEIGHT = 900

function StubWindow (id, width, height) {
  this.id = id
  this.width = width,
  this.height = height
}

test('can change window size', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    const stubWindow = new StubWindow(1, 400, 600)
    grid.add(stubWindow)
    grid.getWindow(1).changeSize(450, 650)
    t.equals(grid.windows.length, 1, 'grid has one window')
    t.deepEquals(_.pick(grid.getWindow(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 450,
      height: 650
    }, 'window size changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('cannot resize window over another window', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    const stubWindow1 = new StubWindow(1, 400, 100)
    const stubWindow2 = new StubWindow(2, 400, 100)
    const stubWindow3 = new StubWindow(3, 400, 100)
    grid.add(stubWindow1)
    grid.add(stubWindow2, 400)
    grid.add(stubWindow3, 0, 100)
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

test('can change window location', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    const stubWindow = new StubWindow(1, 400, 600)
    grid.add(stubWindow)
    grid.getWindow(1).changeLocation(1, 1)
    t.equals(grid.windows.length, 1, 'grid has one window')
    t.deepEquals(_.pick(grid.getWindow(1), ['x', 'y', 'width', 'height']), {
      x: 1,
      y: 1,
      width: 400,
      height: 600
    }, 'window location changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test.skip('can change window size and location', t => {
  // TBD
})

test.skip('cannot move window over another window', t => {
  // TBD
})

test.skip('cannot resize window outside grid', t => {
  // TBD
})

test.skip('cannot move window outside grid', t => {
  // TBD
})
