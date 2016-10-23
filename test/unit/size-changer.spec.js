'use strict'

import test from 'tape'
import Grid from '../../lib/grid'
import PaneWrapper from '../../lib/pane-wrapper'
import _ from 'lodash'
import sinon from 'sinon'

const WIDTH = 1600
const HEIGHT = 900

function StubPane (opts) {
  this.id = opts.id
  this.width = opts.width
  this.height = opts.height
}

function StubPaneWithId (opts) {
  this.id = opts.id || 1
  this.width = opts.width
  this.height = opts.height
}

function StubPaneWithIdAndLocation (opts) {
  this.id = opts.id
  this.width = opts.width
  this.height = opts.height
  this.x = opts.x
  this.y = opts.y
}

test('wrapper.changeSize(width, height): can change pane size', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 600})
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
    grid.add(StubPane, {id: 1, width: 400, height: 600})
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
    grid.add(StubPane, {id: 1, width: 400, height: 600})
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

test('wrapper.maxSize(opts): bad params', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 600})
    t.throws(
      () => grid.getPane(1).maxSize({down: true, foo: 'bar'}),
      Error,
      'cannot resize with bad params'
    )
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.maxSize(opts): can max pane size down with obstructing panes', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200})
    grid.add(StubPane, {id: 2, width: 400, height: 200, x: 0, y: 400})
    grid.add(StubPane, {id: 3, width: 400, height: 200, x: 0, y: 700})
    grid.add(StubPane, {id: 4, width: 400, height: 200, x: 500, y: 700})
    grid.getPane(1).maxSize({down: true})
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 400,
      height: 400
    }, 'pane size changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.maxSize(opts): can max pane size up', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 0, y: 700})
    grid.getPane(1).maxSize({up: true})
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

test('wrapper.maxSize(opts): can max pane size up with obstructing panes', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 0, y: 700})
    grid.add(StubPane, {id: 2, width: 400, height: 200, x: 0, y: 400})
    grid.add(StubPane, {id: 3, width: 400, height: 200, x: 0, y: 200})
    grid.add(StubPane, {id: 4, width: 400, height: 200, x: 500, y: 200})
    grid.getPane(1).maxSize({up: true})
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 600,
      width: 400,
      height: 300
    }, 'pane size changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.maxSize(opts): can max pane size right', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200})
    grid.getPane(1).maxSize({right: true})
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 1600,
      height: 200
    }, 'pane size changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.maxSize(opts): can max pane size right with obstructing panes', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200})
    grid.add(StubPane, {id: 2, width: 400, height: 200, x: 600, y: 0})
    grid.add(StubPane, {id: 3, width: 400, height: 200, x: 1000, y: 0})
    grid.add(StubPane, {id: 4, width: 400, height: 200, x: 1000, y: 300})
    grid.getPane(1).maxSize({right: true})
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 600,
      height: 200
    }, 'pane size changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.maxSize(opts): can max pane size left', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 1200, y: 0})
    grid.getPane(1).maxSize({left: true})
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 1600,
      height: 200
    }, 'pane size changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.maxSize(opts): can max pane size left with obstructing pane', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 1200, y: 0})
    grid.add(StubPane, {id: 2, width: 400, height: 200, x: 500, y: 0})
    grid.add(StubPane, {id: 3, width: 400, height: 200, x: 100, y: 0})
    grid.add(StubPane, {id: 4, width: 400, height: 200, x: 100, y: 400})
    grid.getPane(1).maxSize({left: true})
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 900,
      y: 0,
      width: 700,
      height: 200
    }, 'pane size changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.maxSize(opts): can max pane location up with obstructing panes', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 0, y: 700})
    grid.add(StubPane, {id: 2, width: 400, height: 200, x: 0, y: 400})
    grid.add(StubPane, {id: 3, width: 400, height: 200, x: 0, y: 200})
    grid.add(StubPane, {id: 4, width: 400, height: 200, x: 500, y: 200})
    grid.getPane(1).maxOrSkipLoc({up: true})
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 600,
      width: 400,
      height: 200
    }, 'pane location changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})
