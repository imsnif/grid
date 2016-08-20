'use strict'

import test from 'tape'
import Grid from '../../'

const WIDTH = 1600
const HEIGHT = 900

function StubWindow (opts) {
  this.id = opts.id
  this.width = opts.width
  this.height = opts.height
}

test('new Grid(width, height): can create grid', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    t.deepEquals({width: grid.width, height: grid.height}, {width: WIDTH, height: HEIGHT}, 'grid created with correct size')
    t.equals(grid.panes.length, 0, 'grid.panes is a 0 length array')
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

test('grid.add(pane): can add pane to grid', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubWindow, {id: 1, width: 400, height: 600})
    t.equals(grid.panes.length, 1, 'first pane added to grid')
    grid.add(StubWindow, {id: 2, width: 400, height: 600})
    t.equals(grid.panes.length, 2, 'second pane added to grid')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('grid.add(pane): bad parameters', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    t.throws(
      () => grid.add(StubWindow, {id: 1, width: 2}),
      Error,
      'Cannot add pane without height'
    )
    t.throws(
      () => grid.add(StubWindow, {id: 1, height: 2}),
      Error,
      'Cannot add pane without width'
    )
    t.throws(
      () => grid.add(StubWindow, {width: 1, height: 2}),
      Error,
      'Cannot add pane without id'
    )
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('grid.getPane(id): can get pane by its id from a grid', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubWindow, {id: 1, width: 400, height: 600})
    grid.add(StubWindow, {id: 2, width: 400, height: 600})
    t.equals(grid.getPane(1).id, 1, 'got first pane by its id')
    t.equals(grid.getPane(2).id, 2, 'got second pane by its id')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('grid.getPane(id): bad parameters', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubWindow, {id: 1, width: 400, height: 600})
    t.throws(
      () => grid.getPane(2),
      Error,
      'cannot get non-existent pane'
    )
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})
