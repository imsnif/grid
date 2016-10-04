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

test('new PaneWrapper(Constructor, opts): can create pane-wrapper (default parameters)', t => {
  t.plan(4)
  try {
    const wrapper = new PaneWrapper(StubPane, {id: 1, width: 100, height: 200, x: 0, y: 0})
    t.equals(wrapper.width, 100, 'pane created with proper width')
    t.equals(wrapper.height, 200, 'pane created with proper height')
    t.equals(wrapper.x, 0, 'pane created with default x position')
    t.equals(wrapper.y, 0, 'pane created with default y position')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('new PaneWrapper(Constructor, opts): can create pane-wrapper with id of wrapped pane', t => {
  t.plan(1)
  try {
    const wrapper = new PaneWrapper(StubPaneWithId, {width: 100, height: 200, x: 0, y: 0})
    t.equals(wrapper.id, 1, 'wrapper created with id of pane')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('new PaneWrapper(Constructor, opts): opts overrides native id of wrapped pane', t => {
  t.plan(1)
  try {
    const wrapper = new PaneWrapper(StubPaneWithId, {id: 2, width: 100, height: 200, x: 0, y: 0})
    t.equals(wrapper.id, 2, 'wrapper created with provided id')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('new PaneWrapper(constructor, opts): bad parameters', t => {
  t.plan(4)
  t.throws(
    () => new PaneWrapper(StubPane, {id: 1, x: 1, y: 1, width: 'a', height: 1}),
    Error,
    'cannot create wrapper with non-nomeric width'
  )
  t.throws(
    () => new PaneWrapper(StubPane, {id: 2, x: 1, y: 1, width: 1, height: 'a'}),
    Error,
    'cannot create wrapper with non-nomeric height'
  )
  t.throws(
    () => new PaneWrapper(StubPane, {id: 3, x: 'a', y: 1, width: 1, height: 1}),
    Error,
    'cannot create wrapper with non-nomeric x'
  )
  t.throws(
    () => new PaneWrapper(StubPane, {id: 4, x: 1, y: 'a', width: 1, height: 1}),
    Error,
    'cannot create wrapper with non-nomeric y'
  )
})

test('new PaneWrapper(constructor, opts): bad parameters - no id', t => {
  t.plan(2)
  const spy = sinon.spy()
  StubPane.prototype.close = spy
  t.throws(
    () => new PaneWrapper(StubPane, {x: 1, y: 1, width: 1, height: 1}),
    Error,
    'cannot create pane without id'
  )
  t.ok(
    spy.calledOnce,
    'close method was called when no id was provided'
  )
  StubPane.prototype.close = undefined
})

test('wrapper.changeLocation(x, y): can change pane location', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 600})
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
    grid.add(StubPane, {id: 1, width: 400, height: 600})
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

test('wrapper.maxLoc(opts): can max pane location left', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 1200, y: 0})
    grid.getPane(1).maxLoc({left: true})
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 400,
      height: 200
    }, 'pane location changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.maxLoc(opts): can max pane location left with obstructing pane', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 1200, y: 0})
    grid.add(StubPane, {id: 2, width: 400, height: 200, x: 500, y: 0})
    grid.add(StubPane, {id: 3, width: 400, height: 200, x: 100, y: 0})
    grid.add(StubPane, {id: 4, width: 400, height: 200, x: 100, y: 400})
    grid.getPane(1).maxLoc({left: true})
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 900,
      y: 0,
      width: 400,
      height: 200
    }, 'pane location changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.maxLoc(opts): can max pane location right', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200})
    grid.getPane(1).maxLoc({right: true})
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 1200,
      y: 0,
      width: 400,
      height: 200
    }, 'pane location changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.maxLoc(opts): can max pane location right with obstructing panes', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200})
    grid.add(StubPane, {id: 2, width: 400, height: 200, x: 600, y: 0})
    grid.add(StubPane, {id: 3, width: 400, height: 200, x: 1000, y: 0})
    grid.add(StubPane, {id: 4, width: 400, height: 200, x: 1000, y: 300})
    grid.getPane(1).maxLoc({right: true})
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 200,
      y: 0,
      width: 400,
      height: 200
    }, 'pane location changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.maxLoc(opts): can max pane location down', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 600})
    grid.getPane(1).maxLoc({down: true})
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 300,
      width: 400,
      height: 600
    }, 'pane location changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.maxLoc(opts): can max pane location down with obstructing panes', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200})
    grid.add(StubPane, {id: 2, width: 400, height: 200, x: 0, y: 400})
    grid.add(StubPane, {id: 3, width: 400, height: 200, x: 0, y: 700})
    grid.add(StubPane, {id: 4, width: 400, height: 200, x: 500, y: 700})
    grid.getPane(1).maxLoc({down: true})
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 200,
      width: 400,
      height: 200
    }, 'pane location changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.maxLoc(opts): can max pane location up', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 0, y: 700})
    grid.getPane(1).maxLoc({up: true})
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 400,
      height: 200
    }, 'pane location changed')
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
    grid.getPane(1).maxLoc({up: true})
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

test('wrapper.maxLoc(opts): bad params', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 600})
    t.throws(
      () => grid.getPane(1).maxLoc({foo: 'bar'}),
      /Error: foo should be one of 'up\/down\/left\/right'/,
      'cannot change location with bad params'
    )
    t.throws(
      () => grid.getPane(1).maxLoc({up: true}),
      /Error: location blocked/,
      'cannot max location when at the edge of the grid horizontally'
    )
    t.throws(
      () => grid.getPane(1).maxLoc({left: true}),
      /Error: location blocked/,
      'cannot max location when at the edge of the grid vertically'
    )
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})
