'use strict'

import test from 'tape'
import Grid from '../../'

const WIDTH = 1600
const HEIGHT = 900

function BrowserWindow (id, width, height) {
  // mock electron BrowserWindow
  this.id = id
  this.width = width
  this.height = height
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

test('can increase window size', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    const stubWindow = new BrowserWindow(1, 400, 600)
    grid.add(stubWindow)
    grid.getWindow(1).changeSize(450, 650)
    t.equals(grid.windows.length, 1, 'grid has one window')
    t.deepEquals(grid.getWindow(1).window.getBounds(), {
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

test('can decrease window size', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    const stubWindow = new BrowserWindow(1, 400, 600)
    grid.add(stubWindow)
    grid.getWindow(1).changeSize(350, 550)
    t.equals(grid.windows.length, 1, 'grid has one window')
    t.deepEquals(grid.getWindow(1).window.getBounds(), {
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

test('cannot resize window over another window', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    const stubWindow1 = new BrowserWindow(1, 400, 100)
    const stubWindow2 = new BrowserWindow(2, 400, 100)
    const stubWindow3 = new BrowserWindow(3, 400, 100)
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

test('can change window location', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    const stubWindow = new BrowserWindow(1, 400, 600)
    grid.add(stubWindow)
    grid.getWindow(1).changeLocation(1, 1)
    t.equals(grid.windows.length, 1, 'grid has one window')
    t.deepEquals(grid.getWindow(1).window.getBounds(), {
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

test('cannot move window over another window', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    const stubWindow1 = new BrowserWindow(1, 400, 100)
    const stubWindow2 = new BrowserWindow(2, 400, 100)
    const stubWindow3 = new BrowserWindow(3, 400, 100)
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
    const stubWindow1 = new BrowserWindow(1, 400, 100)
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
    const stubWindow1 = new BrowserWindow(1, 400, 100)
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
    const stubWindow1 = new BrowserWindow(1, 400, 100)
    const stubWindow2 = new BrowserWindow(2, 400, 100)
    grid.add(stubWindow1)
    grid.add(stubWindow2, {x: 400})
    grid.getWindow(1).changeLocation(0, 100)
    grid.getWindow(2).changeLocation(0, 0)
    t.equals(grid.windows.length, 2, 'grid windows still present')
    t.deepEquals(grid.getWindow(2).window.getBounds(), {
      x: 0,
      y: 0,
      width: 400,
      height: 100
    }, 'window size changed')
    t.deepEquals(grid.getWindow(1).window.getBounds(), {
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
