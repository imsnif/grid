'use strict'

import test from 'tape'
import Grid from '../../lib/grid'
import _ from 'lodash'

const WIDTH = 1600
const HEIGHT = 900

function StubPane (opts) {
  this.id = opts.id
  this.width = opts.width
  this.height = opts.height
}

test('increaseAndFillsize(direction, amount) - can increase size over other pane right', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, x: 0, y: 0, width: 800, height: 900})
    grid.add(StubPane, {id: 2, x: 800, y: 0, width: 800, height: 900})
    grid.getPane(1).increaseAndFillSize('right', 30)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 830,
      height: 900
    }, 'pane size increased')
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 830,
      y: 0,
      width: 770,
      height: 900
    }, 'adjacent pane decreased in size')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('increaseAndFillsize(direction, amount) - can increase size over other pane left', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, x: 0, y: 0, width: 800, height: 900})
    grid.add(StubPane, {id: 2, x: 800, y: 0, width: 800, height: 900})
    grid.getPane(2).increaseAndFillSize('left', 30)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 770,
      height: 900
    }, 'adjacent pane size decreased')
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 770,
      y: 0,
      width: 830,
      height: 900
    }, 'pane size increased')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('increaseAndFillsize(direction, amount) - can increase size over other pane up', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, x: 0, y: 0, width: 800, height: 450})
    grid.add(StubPane, {id: 2, x: 0, y: 450, width: 800, height: 450})
    grid.getPane(2).increaseAndFillSize('up', 30)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 800,
      height: 420
    }, 'adjacent pane decreased in size')
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 420,
      width: 800,
      height: 480
    }, 'pane size increased')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('increaseAndFillsize(direction, amount) - can increase size over other pane down', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, x: 0, y: 0, width: 800, height: 450})
    grid.add(StubPane, {id: 2, x: 0, y: 450, width: 800, height: 450})
    grid.getPane(1).increaseAndFillSize('down', 30)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 800,
      height: 480
    }, 'pane size increased')
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 480,
      width: 800,
      height: 420
    }, 'adjacent pane decreased in size')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('increaseAndFillsize(direction, amount) - bad params', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, x: 0, y: 0, width: 1600, height: 900})
    t.throws(
      () => grid.getPane(1).increaseAndFillSize('notDirection', 30),
      /notDirection must be one of right\/left\/up\/down/,
      'cannot call increaseAndFillSize with bad direction'
    )
    t.throws(
      () => grid.getPane(1).increaseAndFillSize('right', 'notANumber'),
      /notANumber must be numeric/,
      'cannot call increaseAndFillSize with bad amount'
    )
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('increaseAndFillsize(direction, amount) - cascade size increase to multiple panes', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, x: 0, y: 0, width: 800, height: 900})
    grid.add(StubPane, {id: 2, x: 800, y: 0, width: 10, height: 900})
    grid.add(StubPane, {id: 3, x: 810, y: 0, width: 790, height: 900})
    grid.getPane(3).increaseAndFillSize('left', 30)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 770,
      height: 900
    }, 'pane resize cascaded')
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 770,
      y: 0,
      width: 10,
      height: 900
    }, 'pane too small to resize pushed')
    t.deepEquals(_.pick(grid.getPane(3), ['x', 'y', 'width', 'height']), {
      x: 780,
      y: 0,
      width: 820,
      height: 900
    }, 'pane resized')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('increaseAndFillsize(direction, amount) - cascade push to multiple panes', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, x: 100, y: 0, width: 200, height: 900})
    grid.add(StubPane, {id: 2, x: 300, y: 0, width: 200, height: 900})
    grid.add(StubPane, {id: 3, x: 500, y: 0, width: 200, height: 900})
    grid.getPane(3).increaseAndFillSize('left', 100)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 200,
      height: 900
    }, 'first pane pushed to the left')
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 200,
      y: 0,
      width: 200,
      height: 900
    }, 'second pane pushed to the left')
    t.deepEquals(_.pick(grid.getPane(3), ['x', 'y', 'width', 'height']), {
      x: 400,
      y: 0,
      width: 300,
      height: 900
    }, 'third pane increased in size to the left')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('increaseAndFillsize(direction, amount) - cannot increase pane size when there is no room to cascade to other panes', t => {
  t.plan(4)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, x: 0, y: 0, width: 10, height: 900})
    grid.add(StubPane, {id: 2, x: 10, y: 0, width: 10, height: 900})
    grid.add(StubPane, {id: 3, x: 20, y: 0, width: 800, height: 900})
    t.throws(
      () => grid.getPane(3).increaseAndFillSize('left', 30),
      /location is blocked by one or more panes/,
      'proper error is given when trying to resize pane over others'
    )
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 10,
      height: 900
    }, 'first pane stayed in size and position')
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 10,
      y: 0,
      width: 10,
      height: 900
    }, 'second pane stayed in size and position')
    t.deepEquals(_.pick(grid.getPane(3), ['x', 'y', 'width', 'height']), {
      x: 20,
      y: 0,
      width: 800,
      height: 900
    }, 'third pane stayed in size and position')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})
