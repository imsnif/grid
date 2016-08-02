'use strict'

import test from 'tape'
import Grid from '../../'

const WIDTH = 1600
const HEIGHT = 900

function StubWindow (id, width, height) {
  this.id = id
  this.width = width
  this.height = height
}

test('new Grid(width, height): can create grid', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    t.deepEquals(grid.size, {width: WIDTH, height: HEIGHT}, 'grid.size() returns grid size')
    t.equals(grid.windows.length, 0, 'grid.windows is a 0 length array')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('new Grid(width, height): bad parameters', t => {
  t.plan(5)
  try {
    t.throws(() => new Grid(), Error, 'cannot create grid with no params')
    t.throws(() => new Grid(undefined, HEIGHT), Error, 'cannot create grid with no width')
    t.throws(() => new Grid(WIDTH), Error, 'cannot create grid with no height')
    t.throws(() => new Grid('foo', HEIGHT), Error, 'cannot create grid with non-numeric width')
    t.throws(() => new Grid(WIDTH, 'bar'), Error, 'cannot create grid with non-numeric height')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('grid.add(window): can add window to grid', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    const stubWindow1 = new StubWindow(1, 400, 600)
    const stubWindow2 = new StubWindow(2, 400, 600)
    grid.add(stubWindow1)
    t.equals(grid.windows.length, 1, 'first window added to grid')
    grid.add(stubWindow2, 950, 0)
    t.equals(grid.windows.length, 2, 'second window added to grid')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('grid.getWindow(id): can get window by its id from a grid', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    const stubWindow1 = new StubWindow(1, 400, 600)
    const stubWindow2 = new StubWindow(2, 400, 600)
    grid.add(stubWindow1)
    grid.add(stubWindow2, 950, 0)
    t.equals(grid.getWindow(1).id, 1, 'got first window by its id')
    t.equals(grid.getWindow(2).id, 2, 'got second window by its id')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('grid.getWindow(id): bad parameters', t => {
  // TBD
})
