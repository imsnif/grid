'use strict'

import test from 'tape'
import Grid from '../../'
import _ from 'lodash'

const WIDTH = 1600
const HEIGHT = 900

function BrowserWindow (opts) {
  // mock electron BrowserWindow
  this.x = opts.x
  this.y = opts.y
  this.width = opts.width
  this.height = opts.height
  this.id = opts.id
}

BrowserWindow.prototype.getBounds = function () {
  return {
    width: this.width,
    height: this.height,
    x: this.x,
    y: this.y
  }
}

BrowserWindow.prototype.setBounds = function (bounds) {
  this.width = bounds.width
  this.height = bounds.height
  this.x = bounds.x
  this.y = bounds.y
}

test('can increase pane size', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(BrowserWindow, {id: 1, width: 400, height: 600})
    grid.getPane(1).changeSize(450, 650)
    t.equals(grid.panes.length, 1, 'grid has one pane')
    t.deepEquals(grid.getPane(1).wrapped.getBounds(), {
      x: 0,
      y: 0,
      width: 450,
      height: 650
    }, 'pane size changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('can decrease pane size', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(BrowserWindow, {id: 1, width: 400, height: 600})
    grid.getPane(1).changeSize(350, 550)
    t.equals(grid.panes.length, 1, 'grid has one pane')
    t.deepEquals(grid.getPane(1).wrapped.getBounds(), {
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

test('cannot resize pane over another pane', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(BrowserWindow, {id: 1, width: 400, height: 100})
    grid.add(BrowserWindow, {id: 2, width: 400, height: 100, x: 400, y: 0})
    grid.add(BrowserWindow, {id: 3, width: 400, height: 100, x: 0, y: 100})
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

test('can change pane location', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(BrowserWindow, {id: 1, width: 400, height: 600})
    grid.getPane(1).changeLocation(1, 1)
    t.equals(grid.panes.length, 1, 'grid has one pane')
    t.deepEquals(grid.getPane(1).wrapped.getBounds(), {
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

test('can change pane location with changeOrMaxLocation', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(BrowserWindow, {id: 1, width: 400, height: 600})
    grid.getPane(1).changeOrMaxLocation(1, 1)
    t.equals(grid.panes.length, 1, 'grid has one pane')
    t.deepEquals(grid.getPane(1).wrapped.getBounds(), {
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

test('cannot move pane over another pane', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(BrowserWindow, {id: 1, width: 400, height: 100})
    grid.add(BrowserWindow, {id: 2, width: 400, height: 100, x: 400, y: 0})
    grid.add(BrowserWindow, {id: 3, width: 400, height: 100, x: 0, y: 100})
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

test('cannot move pane over another pane', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(BrowserWindow, {id: 1, width: 400, height: 100, x: 0, y: 0})
    grid.add(BrowserWindow, {id: 2, width: 400, height: 100, x: 400, y: 0})
    t.throws(
      () => grid.getPane(2).changeOrMaxLocation(350, 0),
      Error,
      'cannot move pane horizontally over another'
    )
    t.equals(grid.panes.length, 2, 'grid panes still present')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('cannot resize pane outside grid', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(BrowserWindow, {id: 1, width: 400, height: 100})
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
    grid.add(BrowserWindow, {id: 1, width: 400, height: 100})
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
    grid.add(BrowserWindow, {id: 1, width: 400, height: 100})
    grid.add(BrowserWindow, {id: 2, width: 400, height: 100, x: 400, y: 0})
    grid.getPane(1).changeLocation(0, 100)
    grid.getPane(2).changeLocation(0, 0)
    t.equals(grid.panes.length, 2, 'grid panes still present')
    t.deepEquals(grid.getPane(2).wrapped.getBounds(), {
      x: 0,
      y: 0,
      width: 400,
      height: 100
    }, 'pane size changed')
    t.deepEquals(grid.getPane(1).wrapped.getBounds(), {
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

test('grid can decide pane location horizontally ', t => {
  t.plan(4)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(BrowserWindow, {id: 1, width: 400, height: 100})
    t.equals(grid.panes.length, 1, 'grid pane added to grid')
    grid.add(BrowserWindow, {id: 2, width: 400, height: 100})
    t.equals(grid.panes.length, 2, 'second grid pane added to grid')
    t.deepEquals(grid.getPane(1).wrapped.getBounds(), {
      x: 0,
      y: 0,
      width: 400,
      height: 100
    }, 'pane location decided properly')
    t.deepEquals(grid.getPane(2).wrapped.getBounds(), {
      x: 400,
      y: 0,
      width: 400,
      height: 100
    }, 'pane location decided properly')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.maxSize(opts): can max pane size down (electron)', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(BrowserWindow, {id: 1, width: 400, height: 600})
    grid.getPane(1).maxSize({down: true})
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 400,
      height: 900
    }, 'pane size changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.maxOrSkipLoc(opts): can max pane location down (electron)', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(BrowserWindow, {id: 1, width: 400, height: 600})
    grid.getPane(1).maxOrSkipLoc({down: true})
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 300,
      width: 400,
      height: 600
    }, 'pane size changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('can max pane if there is no room to move it fully', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(BrowserWindow, {id: 1, width: 400, height: 100, x: 0, y: 0})
    grid.add(BrowserWindow, {id: 2, width: 400, height: 100, x: 450, y: 0})
    grid.getPane(2).changeOrMaxLocation(350, 0)
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 400,
      y: 0,
      width: 400,
      height: 100
    }, 'pane maxed when no room to move fully')
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 400,
      height: 100
    }, 'obstacle unmoved')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.decreaseSizeDirectional(direction, amount): can decrease size directionally', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(BrowserWindow, {id: 1, width: 400, height: 100, x: 0, y: 0})
    grid.getPane(1).decreaseSizeDirectional('left', 10)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 390,
      height: 100
    }, 'pane decreased size to the left')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})
