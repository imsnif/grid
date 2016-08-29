'use strict'

import test from 'tape'
import Grid from '../../lib/grid'
import PaneWrapper from '../../lib/pane-wrapper'
import _ from 'lodash'

const WIDTH = 1600
const HEIGHT = 900

function StubWindow (opts) {
  this.id = opts.id
  this.width = opts.width
  this.height = opts.height
}

test('new PaneWrapper(Constructor, opts): can create pane-wrapper (default parameters)', t => {
  t.plan(4)
  try {
    const wrapper = new PaneWrapper(StubWindow, {id: 1, width: 100, height: 200, x: 0, y: 0})
    t.equals(wrapper.width, 100, 'pane created with proper width')
    t.equals(wrapper.height, 200, 'pane created with proper height')
    t.equals(wrapper.x, 0, 'pane created with default x position')
    t.equals(wrapper.y, 0, 'pane created with default y position')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('new PaneWrapper(constructor, opts): bad parameters', t => {
  t.plan(4)
  t.throws(
    () => new PaneWrapper(StubWindow, {x: 1, y: 1, width: 'a', height: 1}),
    Error,
    'cannot create wrapper with non-nomeric width'
  )
  t.throws(
    () => new PaneWrapper(StubWindow, {x: 1, y: 1, width: 1, height: 'a'}),
    Error,
    'cannot create wrapper with non-nomeric height'
  )
  t.throws(
    () => new PaneWrapper(StubWindow, {x: 'a', y: 1, width: 1, height: 1}),
    Error,
    'cannot create wrapper with non-nomeric x'
  )
  t.throws(
    () => new PaneWrapper(StubWindow, {x: 1, y: 'a', width: 1, height: 1}),
    Error,
    'cannot create wrapper with non-nomeric y'
  )
})

test('wrapper.changeLocation(x, y): can change pane location', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubWindow, {id: 1, width: 400, height: 600})
    grid.getPane(1).changeLocation(1, 1)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 1,
      y: 1,
      width: 400,
      height: 600
    }, 'pane location changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.changeLocation(x, y): bad parameters', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubWindow, {id: 1, width: 400, height: 600})
    t.throws(
      () => grid.getPane(1).changeLocation(undefined, 1),
      Error,
      'cannot change location with bad x'
    )
    t.throws(
      () => grid.getPane(1).changeLocation(1, undefined),
      Error,
      'cannot change location with bad y'
    )
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.changeSize(width, height): can change pane size', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubWindow, {id: 1, width: 400, height: 600})
    grid.getPane(1).changeSize(450, 650)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 450,
      height: 650
    }, 'pane size changed')
    grid.getPane(1).changeSize(350, 550)
    t.equals(grid.panes.length, 1, 'grid has one pane')
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 350,
      height: 550
    }, 'pane size changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.changeSize(width, size): bad parameters', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubWindow, {id: 1, width: 400, height: 600})
    t.throws(
      () => grid.getPane(1).changeSize(undefined, 1),
      Error,
      'cannot change location with bad width'
    )
    t.throws(
      () => grid.getPane(1).changeSize(1, undefined),
      Error,
      'cannot change location with bad height'
    )
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.maxSize(opts): can max pane size down', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubWindow, {id: 1, width: 400, height: 600})
    grid.getPane(1).maxSize({down: true})
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 450,
      height: 900
    }, 'pane size changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})
