'use strict'

import test from 'tape'
import Grid from '../../lib/grid'
import WindowWrapper from '../../lib/window-wrapper'
import _ from 'lodash'

const WIDTH = 1600
const HEIGHT = 900

function StubWindow (id, width, height) {
  this.id = id
  this.width = width
  this.height = height
}

test('new WindowWrapper(window, x, y): can create window-wrapper (default parameters)', t => {
  t.plan(5)
  try {
    const win = new StubWindow(1, 100, 200)
    const wrapper = new WindowWrapper(win)
    t.equals(wrapper.width, 100, 'window created with proper width')
    t.equals(wrapper.height, 200, 'window created with proper height')
    t.equals(wrapper.x, 0, 'window created with default x position')
    t.equals(wrapper.y, 0, 'window created with default y position')
    t.deepEquals(wrapper.window, win, 'window object preserved in wrapper')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('new WindowWrapper(window, x, y): can create window-wrapper (optional parameters)', t => {
  t.plan(5)
  try {
    const win = new StubWindow(1, 100, 200)
    const wrapper = new WindowWrapper(win, 1, 1)
    t.equals(wrapper.width, 100, 'window created with proper width')
    t.equals(wrapper.height, 200, 'window created with proper height')
    t.equals(wrapper.x, 1, 'window created with custom x position')
    t.equals(wrapper.y, 1, 'window created with custom y position')
    t.deepEquals(wrapper.window, win, 'window object preserved in wrapper')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('new WindowWrapper(width, height): bad parameters', t => {
  t.plan(3)
  const win = new StubWindow(1, 100, 200)
  t.throws(
    () => new WindowWrapper(win, 'a'),
    Error,
    'cannot create wrapper with non-nomeric width'
  )
  t.throws(
    () => new WindowWrapper(win, 1, 'a'),
    Error,
    'cannot create wrapper with non-nomeric width'
  )
  t.throws(
    () => new WindowWrapper('a'),
    Error,
    'cannot create wrapper with non-object window'
  )
})

test('wrapper.changeLocation(width, size): can change window location', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    const stubWindow = new StubWindow(1, 400, 600)
    grid.add(stubWindow)
    grid.getWindow(1).changeLocation(1, 1)
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

test.skip('wrapper.changeLocation(width, size): bad parameters', t => {
  // TBD
})

test('wrapper.changeSize(width, height): can change window size', t => {
  t.plan(4)
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
    grid.getWindow(1).changeSize(350, 550)
    t.equals(grid.windows.length, 1, 'grid has one window')
    t.deepEquals(_.pick(grid.getWindow(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 350,
      height: 550
    }, 'window size changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test.skip('wrapper.changeSize(width, size): bad parameters', t => {
  // TBD
})
