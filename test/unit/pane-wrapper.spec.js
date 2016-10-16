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

test('wrapper.changeLocation(x, y): change location maxes pane location in direction if there is not enough room', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPaneWithIdAndLocation, {id: 1, x: 0, y: 0, width: 400, height: 600})
    grid.add(StubPaneWithIdAndLocation, {id: 2, x: 450, y: 0, width: 400, height: 600})
    grid.getPane(2).changeLocation(350, 0)
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 400,
      y: 0,
      width: 400,
      height: 600
    }, 'pane location changed to max in direction')
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

test('wrapper.squashIntoLocation(x, y): can squash pane into location by pushing obstacle', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPaneWithIdAndLocation, {id: 1, width: 400, height: 600, x: 50, y: 0})
    grid.add(StubPaneWithIdAndLocation, {id: 2, width: 400, height: 600, x: 450, y: 0})
    grid.getPane(2).squashIntoLocation(400, 0)
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 400,
      y: 0,
      width: 400,
      height: 600
    }, 'pane squashed into location')
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 400,
      height: 600
    }, 'pane was pushed left')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.squashIntoLocation(x, y): can squash pane into location by resizing obstacle', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPaneWithIdAndLocation, {id: 1, width: 400, height: 600, x: 0, y: 0})
    grid.add(StubPaneWithIdAndLocation, {id: 2, width: 400, height: 600, x: 400, y: 0})
    grid.getPane(2).squashIntoLocation(350, 0)
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 350,
      y: 0,
      width: 400,
      height: 600
    }, 'pane squashed into location')
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 350,
      height: 600
    }, 'pane was resized left')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.squashIntoLocation(x, y): can squash pane into location by pushing multiple obstacles', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPaneWithIdAndLocation, {id: 1, width: 400, height: 600, x: 50, y: 0})
    grid.add(StubPaneWithIdAndLocation, {id: 2, width: 400, height: 600, x: 450, y: 0})
    grid.add(StubPaneWithIdAndLocation, {id: 3, width: 400, height: 600, x: 850, y: 0})
    grid.getPane(3).squashIntoLocation(800, 0)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 400,
      height: 600
    }, 'first obstacle pushed to the left')
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 400,
      y: 0,
      width: 400,
      height: 600
    }, 'second obstacle pushed to the left')
    t.deepEquals(_.pick(grid.getPane(3), ['x', 'y', 'width', 'height']), {
      x: 800,
      y: 0,
      width: 400,
      height: 600
    }, 'second pane was pushed left')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.squashIntoLocation(x, y): can squash pane into location by pushing multiple horizontal and vertical obstacles', t => {
  t.plan(5)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPaneWithIdAndLocation, {id: 1, width: 400, height: 200, x: 50, y: 0})
    grid.add(StubPaneWithIdAndLocation, {id: 2, width: 400, height: 200, x: 50, y: 200})
    grid.add(StubPaneWithIdAndLocation, {id: 3, width: 400, height: 200, x: 450, y: 0})
    grid.add(StubPaneWithIdAndLocation, {id: 4, width: 400, height: 200, x: 450, y: 200})
    grid.add(StubPaneWithIdAndLocation, {id: 5, width: 400, height: 200, x: 850, y: 100})
    grid.getPane(5).squashIntoLocation(800, 100)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 400,
      height: 200
    }, 'first obstacle pushed to the left')
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 200,
      width: 400,
      height: 200
    }, 'second obstacle pushed to the left')
    t.deepEquals(_.pick(grid.getPane(3), ['x', 'y', 'width', 'height']), {
      x: 400,
      y: 0,
      width: 400,
      height: 200
    }, 'third obstacle pushed to the left')
    t.deepEquals(_.pick(grid.getPane(4), ['x', 'y', 'width', 'height']), {
      x: 400,
      y: 200,
      width: 400,
      height: 200
    }, 'fourth obstacle pushed to the left')
    t.deepEquals(_.pick(grid.getPane(5), ['x', 'y', 'width', 'height']), {
      x: 800,
      y: 100,
      width: 400,
      height: 200
    }, 'pane moved to the left')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.squashIntoLocation(x, y): squashed pane resizes farthest pane(s) when squashed', t => {
  t.plan(5)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPaneWithIdAndLocation, {id: 1, width: 400, height: 200, x: 0, y: 0})
    grid.add(StubPaneWithIdAndLocation, {id: 2, width: 400, height: 200, x: 0, y: 200})
    grid.add(StubPaneWithIdAndLocation, {id: 3, width: 400, height: 200, x: 400, y: 0})
    grid.add(StubPaneWithIdAndLocation, {id: 4, width: 400, height: 200, x: 400, y: 200})
    grid.add(StubPaneWithIdAndLocation, {id: 5, width: 400, height: 200, x: 800, y: 100})
    grid.getPane(5).squashIntoLocation(750, 100)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 350,
      height: 200
    }, 'first obstacle shrunk into location')
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 200,
      width: 350,
      height: 200
    }, 'second obstacle shrunk into location')
    t.deepEquals(_.pick(grid.getPane(3), ['x', 'y', 'width', 'height']), {
      x: 350,
      y: 0,
      width: 400,
      height: 200
    }, 'third obstacle pushed into location')
    t.deepEquals(_.pick(grid.getPane(4), ['x', 'y', 'width', 'height']), {
      x: 350,
      y: 200,
      width: 400,
      height: 200
    }, 'fourth obstacle pushed into location')
    t.deepEquals(_.pick(grid.getPane(5), ['x', 'y', 'width', 'height']), {
      x: 750,
      y: 100,
      width: 400,
      height: 200
    }, 'pane moved to the left')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.squashIntoLocation(x, y): squashed pane resizes second to farthest pane(s) when squashed and farthest pane is too small', t => {
  t.plan(5)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPaneWithIdAndLocation, {id: 1, width: 10, height: 200, x: 0, y: 0})
    grid.add(StubPaneWithIdAndLocation, {id: 2, width: 10, height: 200, x: 0, y: 200})
    grid.add(StubPaneWithIdAndLocation, {id: 3, width: 400, height: 200, x: 10, y: 0})
    grid.add(StubPaneWithIdAndLocation, {id: 4, width: 400, height: 200, x: 10, y: 200})
    grid.add(StubPaneWithIdAndLocation, {id: 5, width: 400, height: 200, x: 410, y: 100})
    grid.getPane(5).squashIntoLocation(390, 100)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 10,
      height: 200
    }, 'first obstacle stayed in place and size')
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 200,
      width: 10,
      height: 200
    }, 'second obstacle stayed in place and size')
    t.deepEquals(_.pick(grid.getPane(3), ['x', 'y', 'width', 'height']), {
      x: 10,
      y: 0,
      width: 380,
      height: 200
    }, 'third obstacle shrunk into location')
    t.deepEquals(_.pick(grid.getPane(4), ['x', 'y', 'width', 'height']), {
      x: 10,
      y: 200,
      width: 380,
      height: 200
    }, 'fourth obstacle shrunk into location')
    t.deepEquals(_.pick(grid.getPane(5), ['x', 'y', 'width', 'height']), {
      x: 390,
      y: 100,
      width: 400,
      height: 200
    }, 'pane moved to the left')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.squashIntoLocation(x, y): can squash pane into location by pushing obstacle right', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPaneWithIdAndLocation, {id: 1, width: 200, height: 200, x: 1350, y: 0})
    grid.add(StubPaneWithIdAndLocation, {id: 2, width: 200, height: 200, x: 1150, y: 0})
    grid.getPane(2).squashIntoLocation(1200, 0)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 1400,
      y: 0,
      width: 200,
      height: 200
    }, 'pane pushed into location')
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 1200,
      y: 0,
      width: 200,
      height: 200
    }, 'pane moved into location')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.squashIntoLocation(x, y): can squash pane into location right by resizing obstacle', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPaneWithIdAndLocation, {id: 1, width: 200, height: 200, x: 1400, y: 0})
    grid.add(StubPaneWithIdAndLocation, {id: 2, width: 200, height: 200, x: 1200, y: 0})
    grid.getPane(2).squashIntoLocation(1250, 0)
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 1250,
      y: 0,
      width: 200,
      height: 200
    }, 'pane squashed into location')
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 1450,
      y: 0,
      width: 150,
      height: 200
    }, 'pane was resized right')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.squashIntoLocation(x, y): can squash pane into location by pushing multiple obstacles right', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPaneWithIdAndLocation, {id: 1, width: 200, height: 200, x: 1350, y: 0})
    grid.add(StubPaneWithIdAndLocation, {id: 2, width: 200, height: 200, x: 1150, y: 0})
    grid.add(StubPaneWithIdAndLocation, {id: 3, width: 200, height: 200, x: 950, y: 0})
    grid.getPane(3).squashIntoLocation(1000, 0)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 1400,
      y: 0,
      width: 200,
      height: 200
    }, 'first obstacle pushed to the right')
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 1200,
      y: 0,
      width: 200,
      height: 200
    }, 'second obstacle pushed to the right')
    t.deepEquals(_.pick(grid.getPane(3), ['x', 'y', 'width', 'height']), {
      x: 1000,
      y: 0,
      width: 200,
      height: 200
    }, 'pane moved right')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.squashIntoLocation(x, y): can squash pane into location by pushing multiple horizontal and vertical obstacles right', t => {
  t.plan(5)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPaneWithIdAndLocation, {id: 1, width: 200, height: 200, x: 1350, y: 0})
    grid.add(StubPaneWithIdAndLocation, {id: 2, width: 200, height: 200, x: 1350, y: 200})
    grid.add(StubPaneWithIdAndLocation, {id: 3, width: 200, height: 200, x: 1150, y: 0})
    grid.add(StubPaneWithIdAndLocation, {id: 4, width: 200, height: 200, x: 1150, y: 200})
    grid.add(StubPaneWithIdAndLocation, {id: 5, width: 200, height: 200, x: 950, y: 100})
    grid.getPane(5).squashIntoLocation(1000, 100)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 1400,
      y: 0,
      width: 200,
      height: 200
    }, 'first obstacle pushed to the right')
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 1400,
      y: 200,
      width: 200,
      height: 200
    }, 'second obstacle pushed to the right')
    t.deepEquals(_.pick(grid.getPane(3), ['x', 'y', 'width', 'height']), {
      x: 1200,
      y: 0,
      width: 200,
      height: 200
    }, 'third obstacle pushed to the right')
    t.deepEquals(_.pick(grid.getPane(4), ['x', 'y', 'width', 'height']), {
      x: 1200,
      y: 200,
      width: 200,
      height: 200
    }, 'fourth obstacle pushed to the right')
    t.deepEquals(_.pick(grid.getPane(5), ['x', 'y', 'width', 'height']), {
      x: 1000,
      y: 100,
      width: 200,
      height: 200
    }, 'pane moved to the right')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.squashIntoLocation(x, y): squashed pane resizes farthest pane(s) when squashed right', t => {
  t.plan(5)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPaneWithIdAndLocation, {id: 1, width: 200, height: 200, x: 1400, y: 0})
    grid.add(StubPaneWithIdAndLocation, {id: 2, width: 200, height: 200, x: 1400, y: 200})
    grid.add(StubPaneWithIdAndLocation, {id: 3, width: 200, height: 200, x: 1200, y: 0})
    grid.add(StubPaneWithIdAndLocation, {id: 4, width: 200, height: 200, x: 1200, y: 200})
    grid.add(StubPaneWithIdAndLocation, {id: 5, width: 200, height: 200, x: 1000, y: 100})
    grid.getPane(5).squashIntoLocation(1050, 100)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 1450,
      y: 0,
      width: 150,
      height: 200
    }, 'first obstacle shrunk into location')
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 1450,
      y: 200,
      width: 150,
      height: 200
    }, 'second obstacle shrunk into location')
    t.deepEquals(_.pick(grid.getPane(3), ['x', 'y', 'width', 'height']), {
      x: 1250,
      y: 0,
      width: 200,
      height: 200
    }, 'third obstacle pushed into location')
    t.deepEquals(_.pick(grid.getPane(4), ['x', 'y', 'width', 'height']), {
      x: 1250,
      y: 200,
      width: 200,
      height: 200
    }, 'fourth obstacle pushed into location')
    t.deepEquals(_.pick(grid.getPane(5), ['x', 'y', 'width', 'height']), {
      x: 1050,
      y: 100,
      width: 200,
      height: 200
    }, 'pane moved to the right')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.squashIntoLocation(x, y): squashed pane resizes second to farthest pane(s) right when squashed and farthest pane is too small', t => {
  t.plan(5)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPaneWithIdAndLocation, {id: 1, width: 10, height: 200, x: 1590, y: 0})
    grid.add(StubPaneWithIdAndLocation, {id: 2, width: 10, height: 200, x: 1590, y: 200})
    grid.add(StubPaneWithIdAndLocation, {id: 3, width: 200, height: 200, x: 1390, y: 0})
    grid.add(StubPaneWithIdAndLocation, {id: 4, width: 200, height: 200, x: 1390, y: 200})
    grid.add(StubPaneWithIdAndLocation, {id: 5, width: 200, height: 200, x: 1190, y: 100})
    grid.getPane(5).squashIntoLocation(1240, 100)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 1590,
      y: 0,
      width: 10,
      height: 200
    }, 'first obstacle stayed in place and size')
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 1590,
      y: 200,
      width: 10,
      height: 200
    }, 'second obstacle stayed in place and size')
    t.deepEquals(_.pick(grid.getPane(3), ['x', 'y', 'width', 'height']), {
      x: 1440,
      y: 0,
      width: 150,
      height: 200
    }, 'third obstacle shrunk into location')
    t.deepEquals(_.pick(grid.getPane(4), ['x', 'y', 'width', 'height']), {
      x: 1440,
      y: 200,
      width: 150,
      height: 200
    }, 'fourth obstacle shrunk into location')
    t.deepEquals(_.pick(grid.getPane(5), ['x', 'y', 'width', 'height']), {
      x: 1240,
      y: 100,
      width: 200,
      height: 200
    }, 'pane moved to the right')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.squashIntoLocation(x, y): can squash pane into location by pushing obstacle up', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPaneWithIdAndLocation, {id: 1, width: 200, height: 200, x: 0, y: 50})
    grid.add(StubPaneWithIdAndLocation, {id: 2, width: 200, height: 200, x: 0, y: 250})
    grid.getPane(2).squashIntoLocation(0, 200)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 200,
      height: 200
    }, 'pane pushed into location')
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 200,
      width: 200,
      height: 200
    }, 'pane moved into location')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.squashIntoLocation(x, y): can squash pane into location up by resizing obstacle', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPaneWithIdAndLocation, {id: 1, width: 200, height: 200, x: 0, y: 0})
    grid.add(StubPaneWithIdAndLocation, {id: 2, width: 200, height: 200, x: 0, y: 200})
    grid.getPane(2).squashIntoLocation(0, 150)
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 150,
      width: 200,
      height: 200
    }, 'pane squashed into location')
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 200,
      height: 150
    }, 'pane was resized up')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.squashIntoLocation(x, y): can squash pane into location by pushing multiple obstacles up', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPaneWithIdAndLocation, {id: 1, width: 200, height: 200, x: 0, y: 50})
    grid.add(StubPaneWithIdAndLocation, {id: 2, width: 200, height: 200, x: 0, y: 250})
    grid.add(StubPaneWithIdAndLocation, {id: 3, width: 200, height: 200, x: 0, y: 450})
    grid.getPane(3).squashIntoLocation(0, 400)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 200,
      height: 200
    }, 'first obstacle pushed up')
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 200,
      width: 200,
      height: 200
    }, 'second obstacle pushed up')
    t.deepEquals(_.pick(grid.getPane(3), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 400,
      width: 200,
      height: 200
    }, 'pane moved up')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.squashIntoLocation(x, y): can squash pane into location by pushing multiple horizontal and vertical obstacles up', t => {
  t.plan(5)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPaneWithIdAndLocation, {id: 1, width: 200, height: 200, x: 0, y: 50})
    grid.add(StubPaneWithIdAndLocation, {id: 2, width: 200, height: 200, x: 200, y: 50})
    grid.add(StubPaneWithIdAndLocation, {id: 3, width: 200, height: 200, x: 0, y: 250})
    grid.add(StubPaneWithIdAndLocation, {id: 4, width: 200, height: 200, x: 200, y: 250})
    grid.add(StubPaneWithIdAndLocation, {id: 5, width: 200, height: 200, x: 100, y: 450})
    grid.getPane(5).squashIntoLocation(100, 400)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 200,
      height: 200
    }, 'first obstacle pushed up')
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 200,
      y: 0,
      width: 200,
      height: 200
    }, 'second obstacle pushed up')
    t.deepEquals(_.pick(grid.getPane(3), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 200,
      width: 200,
      height: 200
    }, 'third obstacle pushed up')
    t.deepEquals(_.pick(grid.getPane(4), ['x', 'y', 'width', 'height']), {
      x: 200,
      y: 200,
      width: 200,
      height: 200
    }, 'fourth obstacle pushed up')
    t.deepEquals(_.pick(grid.getPane(5), ['x', 'y', 'width', 'height']), {
      x: 100,
      y: 400,
      width: 200,
      height: 200
    }, 'pane moved up')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.squashIntoLocation(x, y): squashed pane resizes farthest pane(s) when squashed up', t => {
  t.plan(5)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPaneWithIdAndLocation, {id: 1, width: 200, height: 200, x: 0, y: 0})
    grid.add(StubPaneWithIdAndLocation, {id: 2, width: 200, height: 200, x: 200, y: 0})
    grid.add(StubPaneWithIdAndLocation, {id: 3, width: 200, height: 200, x: 0, y: 200})
    grid.add(StubPaneWithIdAndLocation, {id: 4, width: 200, height: 200, x: 200, y: 200})
    grid.add(StubPaneWithIdAndLocation, {id: 5, width: 200, height: 200, x: 100, y: 400})
    grid.getPane(5).squashIntoLocation(100, 350)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 200,
      height: 150
    }, 'first obstacle shrunk into location')
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 200,
      y: 0,
      width: 200,
      height: 150
    }, 'second obstacle shrunk into location')
    t.deepEquals(_.pick(grid.getPane(3), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 150,
      width: 200,
      height: 200
    }, 'third obstacle pushed into location')
    t.deepEquals(_.pick(grid.getPane(4), ['x', 'y', 'width', 'height']), {
      x: 200,
      y: 150,
      width: 200,
      height: 200
    }, 'fourth obstacle pushed into location')
    t.deepEquals(_.pick(grid.getPane(5), ['x', 'y', 'width', 'height']), {
      x: 100,
      y: 350,
      width: 200,
      height: 200
    }, 'pane moved up')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.squashIntoLocation(x, y): squashed pane resizes second to farthest pane(s) up when squashed and farthest pane is too small', t => {
  t.plan(5)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPaneWithIdAndLocation, {id: 1, width: 200, height: 10, x: 0, y: 0})
    grid.add(StubPaneWithIdAndLocation, {id: 2, width: 200, height: 10, x: 200, y: 0})
    grid.add(StubPaneWithIdAndLocation, {id: 3, width: 200, height: 200, x: 0, y: 10})
    grid.add(StubPaneWithIdAndLocation, {id: 4, width: 200, height: 200, x: 200, y: 10})
    grid.add(StubPaneWithIdAndLocation, {id: 5, width: 200, height: 200, x: 100, y: 210})
    grid.getPane(5).squashIntoLocation(100, 160)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 200,
      height: 10
    }, 'first obstacle stayed in place and size')
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 200,
      y: 0,
      width: 200,
      height: 10
    }, 'second obstacle stayed in place and size')
    t.deepEquals(_.pick(grid.getPane(3), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 10,
      width: 200,
      height: 150
    }, 'third obstacle shrunk into location')
    t.deepEquals(_.pick(grid.getPane(4), ['x', 'y', 'width', 'height']), {
      x: 200,
      y: 10,
      width: 200,
      height: 150
    }, 'fourth obstacle shrunk into location')
    t.deepEquals(_.pick(grid.getPane(5), ['x', 'y', 'width', 'height']), {
      x: 100,
      y: 160,
      width: 200,
      height: 200
    }, 'pane moved to the right')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.squashIntoLocation(x, y): can squash pane into location by pushing obstacle down', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPaneWithIdAndLocation, {id: 1, width: 200, height: 200, x: 0, y: 650})
    grid.add(StubPaneWithIdAndLocation, {id: 2, width: 200, height: 200, x: 0, y: 450})
    grid.getPane(2).squashIntoLocation(0, 500)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 700,
      width: 200,
      height: 200
    }, 'pane pushed into location')
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 500,
      width: 200,
      height: 200
    }, 'pane moved into location')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.squashIntoLocation(x, y): can squash pane into location down by resizing obstacle', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPaneWithIdAndLocation, {id: 1, width: 200, height: 200, x: 0, y: 700})
    grid.add(StubPaneWithIdAndLocation, {id: 2, width: 200, height: 200, x: 0, y: 500})
    grid.getPane(2).squashIntoLocation(0, 550)
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 550,
      width: 200,
      height: 200
    }, 'pane squashed into location')
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 750,
      width: 200,
      height: 150
    }, 'pane was resized down')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.squashIntoLocation(x, y): can squash pane into location by pushing multiple obstacles down', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPaneWithIdAndLocation, {id: 1, width: 200, height: 200, x: 0, y: 650})
    grid.add(StubPaneWithIdAndLocation, {id: 2, width: 200, height: 200, x: 0, y: 450})
    grid.add(StubPaneWithIdAndLocation, {id: 3, width: 200, height: 200, x: 0, y: 250})
    grid.getPane(3).squashIntoLocation(0, 300)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 700,
      width: 200,
      height: 200
    }, 'first obstacle pushed down')
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 500,
      width: 200,
      height: 200
    }, 'second obstacle pushed down')
    t.deepEquals(_.pick(grid.getPane(3), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 300,
      width: 200,
      height: 200
    }, 'pane moved down')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.squashIntoLocation(x, y): can squash pane into location by pushing multiple horizontal and vertical obstacles down', t => {
  t.plan(5)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPaneWithIdAndLocation, {id: 1, width: 200, height: 200, x: 0, y: 650})
    grid.add(StubPaneWithIdAndLocation, {id: 2, width: 200, height: 200, x: 200, y: 650})
    grid.add(StubPaneWithIdAndLocation, {id: 3, width: 200, height: 200, x: 0, y: 450})
    grid.add(StubPaneWithIdAndLocation, {id: 4, width: 200, height: 200, x: 200, y: 450})
    grid.add(StubPaneWithIdAndLocation, {id: 5, width: 200, height: 200, x: 100, y: 250})
    grid.getPane(5).squashIntoLocation(100, 300)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 700,
      width: 200,
      height: 200
    }, 'first obstacle pushed down')
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 200,
      y: 700,
      width: 200,
      height: 200
    }, 'second obstacle pushed down')
    t.deepEquals(_.pick(grid.getPane(3), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 500,
      width: 200,
      height: 200
    }, 'third obstacle pushed down')
    t.deepEquals(_.pick(grid.getPane(4), ['x', 'y', 'width', 'height']), {
      x: 200,
      y: 500,
      width: 200,
      height: 200
    }, 'fourth obstacle pushed down')
    t.deepEquals(_.pick(grid.getPane(5), ['x', 'y', 'width', 'height']), {
      x: 100,
      y: 300,
      width: 200,
      height: 200
    }, 'pane moved down')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.squashIntoLocation(x, y): squashed pane resizes farthest pane(s) when squashed down', t => {
  t.plan(5)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPaneWithIdAndLocation, {id: 1, width: 200, height: 200, x: 0, y: 700})
    grid.add(StubPaneWithIdAndLocation, {id: 2, width: 200, height: 200, x: 200, y: 700})
    grid.add(StubPaneWithIdAndLocation, {id: 3, width: 200, height: 200, x: 0, y: 500})
    grid.add(StubPaneWithIdAndLocation, {id: 4, width: 200, height: 200, x: 200, y: 500})
    grid.add(StubPaneWithIdAndLocation, {id: 5, width: 200, height: 200, x: 100, y: 300})
    grid.getPane(5).squashIntoLocation(100, 350)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 750,
      width: 200,
      height: 150
    }, 'first obstacle shrunk into location')
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 200,
      y: 750,
      width: 200,
      height: 150
    }, 'second obstacle shrunk into location')
    t.deepEquals(_.pick(grid.getPane(3), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 550,
      width: 200,
      height: 200
    }, 'third obstacle pushed into location')
    t.deepEquals(_.pick(grid.getPane(4), ['x', 'y', 'width', 'height']), {
      x: 200,
      y: 550,
      width: 200,
      height: 200
    }, 'fourth obstacle pushed into location')
    t.deepEquals(_.pick(grid.getPane(5), ['x', 'y', 'width', 'height']), {
      x: 100,
      y: 350,
      width: 200,
      height: 200
    }, 'pane moved down')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.squashIntoLocation(x, y): squashed pane resizes second to farthest pane(s) down when squashed and farthest pane is too small', t => {
  t.plan(5)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPaneWithIdAndLocation, {id: 1, width: 200, height: 10, x: 0, y: 890})
    grid.add(StubPaneWithIdAndLocation, {id: 2, width: 200, height: 10, x: 200, y: 890})
    grid.add(StubPaneWithIdAndLocation, {id: 3, width: 200, height: 200, x: 0, y: 690})
    grid.add(StubPaneWithIdAndLocation, {id: 4, width: 200, height: 200, x: 200, y: 690})
    grid.add(StubPaneWithIdAndLocation, {id: 5, width: 200, height: 200, x: 100, y: 490})
    grid.getPane(5).squashIntoLocation(100, 540)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 890,
      width: 200,
      height: 10
    }, 'first obstacle stayed in place and size')
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 200,
      y: 890,
      width: 200,
      height: 10
    }, 'second obstacle stayed in place and size')
    t.deepEquals(_.pick(grid.getPane(3), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 740,
      width: 200,
      height: 150
    }, 'third obstacle shrunk into location')
    t.deepEquals(_.pick(grid.getPane(4), ['x', 'y', 'width', 'height']), {
      x: 200,
      y: 740,
      width: 200,
      height: 150
    }, 'fourth obstacle shrunk into location')
    t.deepEquals(_.pick(grid.getPane(5), ['x', 'y', 'width', 'height']), {
      x: 100,
      y: 540,
      width: 200,
      height: 200
    }, 'pane moved down')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.squashIntoLocation(x, y): if cannot squash pane, neighboring panes that could be squashed are not', t => {
  t.plan(5)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPaneWithIdAndLocation, {id: 1, width: 10, height: 200, x: 0, y: 0})
    grid.add(StubPaneWithIdAndLocation, {id: 2, width: 10, height: 200, x: 10, y: 0})
    grid.add(StubPaneWithIdAndLocation, {id: 3, width: 20, height: 200, x: 0, y: 200})
    grid.add(StubPaneWithIdAndLocation, {id: 4, width: 200, height: 200, x: 20, y: 100})
    t.throws(
      () => grid.getPane(4).squashIntoLocation(10, 100),
      /Error: location is blocked by one or more panes/,
      'cannot squash pane when there is no room'
    )
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 10,
      height: 200
    }, 'first obstacle stayed in place and size')
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 10,
      y: 0,
      width: 10,
      height: 200
    }, 'second obstacle stayed in place and size')
    t.deepEquals(_.pick(grid.getPane(3), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 200,
      width: 20,
      height: 200
    }, 'third obstacle stayed in place and size')
    t.deepEquals(_.pick(grid.getPane(4), ['x', 'y', 'width', 'height']), {
      x: 20,
      y: 100,
      width: 200,
      height: 200
    }, 'pane did not move')
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

test('wrapper.maxLoc(opts): max pane location left skips over obstructing pane', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 900, y: 0})
    grid.add(StubPane, {id: 2, width: 400, height: 200, x: 500, y: 0})
    grid.getPane(1).maxLoc({left: true})
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 100,
      y: 0,
      width: 400,
      height: 200
    }, 'pane location changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.maxLoc(opts): max pane location left skips over obstructing pane vertically down', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 400, y: 0})
    grid.add(StubPane, {id: 2, width: 400, height: 200, x: 0, y: 0})
    grid.getPane(1).maxLoc({left: true})
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

test('wrapper.maxLoc(opts): max pane location left skips over obstructing pane vertically up', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 400, y: 700})
    grid.add(StubPane, {id: 2, width: 400, height: 200, x: 0, y: 700})
    grid.getPane(1).maxLoc({left: true})
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 500,
      width: 400,
      height: 200
    }, 'pane location changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.maxLoc(opts): max pane location right skips over obstructing pane', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 0, y: 0})
    grid.add(StubPane, {id: 2, width: 400, height: 200, x: 400, y: 0})
    grid.getPane(1).maxLoc({right: true})
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 800,
      y: 0,
      width: 400,
      height: 200
    }, 'pane location changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.maxLoc(opts): max pane location right skips over obstructing pane vertically down', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 800, y: 0})
    grid.add(StubPane, {id: 2, width: 400, height: 200, x: 1200, y: 0})
    grid.getPane(1).maxLoc({right: true})
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 1200,
      y: 200,
      width: 400,
      height: 200
    }, 'pane location changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.maxLoc(opts): max pane location right skips over obstructing pane vertically up', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 800, y: 700})
    grid.add(StubPane, {id: 2, width: 400, height: 200, x: 1200, y: 700})
    grid.getPane(1).maxLoc({right: true})
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 1200,
      y: 500,
      width: 400,
      height: 200
    }, 'pane location changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.maxLoc(opts): max pane up skips over obstructing pane', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 0, y: 500})
    grid.add(StubPane, {id: 2, width: 400, height: 200, x: 0, y: 300})
    grid.getPane(1).maxLoc({up: true})
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 100,
      width: 400,
      height: 200
    }, 'pane location changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.maxLoc(opts): max pane up skips over obstructing pane horizontally right', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 0, y: 200})
    grid.add(StubPane, {id: 2, width: 400, height: 200, x: 0, y: 0})
    grid.getPane(1).maxLoc({up: true})
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 400,
      y: 0,
      width: 400,
      height: 200
    }, 'pane location changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.maxLoc(opts): max pane up skips over obstructing pane horizontally left', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 1200, y: 200})
    grid.add(StubPane, {id: 2, width: 400, height: 200, x: 1200, y: 0})
    grid.getPane(1).maxLoc({up: true})
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 800,
      y: 0,
      width: 400,
      height: 200
    }, 'pane location changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.maxLoc(opts): max pane down skips over obstructing pane', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 0, y: 300})
    grid.add(StubPane, {id: 2, width: 400, height: 200, x: 0, y: 500})
    grid.getPane(1).maxLoc({down: true})
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 700,
      width: 400,
      height: 200
    }, 'pane location changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.maxLoc(opts): max pane down skips over obstructing pane horizontally right', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 0, y: 500})
    grid.add(StubPane, {id: 2, width: 400, height: 200, x: 0, y: 700})
    grid.getPane(1).maxLoc({down: true})
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 400,
      y: 700,
      width: 400,
      height: 200
    }, 'pane location changed')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.maxLoc(opts): max pane down skips over obstructing pane horizontally left', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 1200, y: 500})
    grid.add(StubPane, {id: 2, width: 400, height: 200, x: 1200, y: 700})
    grid.getPane(1).maxLoc({down: true})
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 800,
      y: 700,
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

test('wrapper.maxLoc(opts): cannot skip over the edge of the grid', t => {
  t.plan(4)
  try {
    const grid = new Grid(900, 900)
    grid.add(StubPane, {id: 1, width: 300, height: 300, x: 0, y: 0})
    grid.add(StubPane, {id: 2, width: 300, height: 300, x: 300, y: 0})
    grid.add(StubPane, {id: 3, width: 300, height: 300, x: 600, y: 0})
    grid.add(StubPane, {id: 4, width: 300, height: 300, x: 0, y: 300})
    grid.add(StubPane, {id: 5, width: 300, height: 300, x: 300, y: 300})
    grid.add(StubPane, {id: 6, width: 300, height: 300, x: 600, y: 300})
    grid.add(StubPane, {id: 7, width: 300, height: 300, x: 0, y: 600})
    grid.add(StubPane, {id: 8, width: 300, height: 300, x: 300, y: 600})
    grid.add(StubPane, {id: 9, width: 300, height: 300, x: 600, y: 600})
    t.throws(
      () => grid.getPane(5).maxLoc({up: true}),
      /Error: location blocked/,
      'cannot skip over the upper edge of the grid'
    )
    t.throws(
      () => grid.getPane(5).maxLoc({down: true}),
      /Error: location blocked/,
      'cannot skip over the lower edge of the grid'
    )
    t.throws(
      () => grid.getPane(1).maxLoc({left: true}),
      /Error: location blocked/,
      'cannot skip over the left edge of the grid'
    )
    t.throws(
      () => grid.getPane(1).maxLoc({right: true}),
      /Error: location blocked/,
      'cannot skip over the right edge of the grid'
    )
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})
