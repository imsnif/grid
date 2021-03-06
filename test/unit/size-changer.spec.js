'use strict'

import test from 'tape'
import Grid from '../../lib/grid'
import _ from 'lodash'
import sinon from 'sinon'

const WIDTH = 1600
const HEIGHT = 900

function StubPane (opts) {
  this.id = opts.id
  this.width = opts.width
  this.height = opts.height
}

function BrowserWindow (opts) {
  this.id = opts.id
  this.width = opts.width
  this.height = opts.height
}

BrowserWindow.prototype.setBounds = function () {} // no-op
BrowserWindow.prototype.getBounds = () => ({})

test('wrapper.changeSize(width, height): can change pane size', t => {
  t.plan(4)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    const pane = grid.add(StubPane, {id: 1, width: 400, height: 600})
    const changeBounds = sinon.spy()
    pane.once('changeBounds', changeBounds)
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
    t.ok(changeBounds.calledOnce, 'changeBounds event emitter')
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

test('wrapper.maxSize(direction): can max pane size down', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    const pane = grid.add(StubPane, {id: 1, width: 400, height: 600})
    const changeBounds = sinon.spy()
    pane.once('changeBounds', changeBounds)
    grid.getPane(1).maxSize('down')
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 400,
      height: 900
    }, 'pane size changed')
    t.ok(changeBounds.calledOnce, 'changeBounds event emitted')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.maxSize(direction): bad params', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 600})
    t.throws(
      () => grid.getPane(1).maxSize('foo'),
      /foo should be one of 'up\/down\/left\/right'/,
      'cannot resize with bad params'
    )
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.maxSize(direction): can max pane size down with obstructing panes', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200})
    grid.add(StubPane, {id: 2, width: 400, height: 200, x: 0, y: 400})
    grid.add(StubPane, {id: 3, width: 400, height: 200, x: 0, y: 700})
    grid.add(StubPane, {id: 4, width: 400, height: 200, x: 500, y: 700})
    grid.getPane(1).maxSize('down')
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

test('wrapper.maxSize(direction): can max pane size up', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 0, y: 700})
    grid.getPane(1).maxSize('up')
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

test('wrapper.maxSize(direction): can max pane size up with obstructing panes', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 0, y: 700})
    grid.add(StubPane, {id: 2, width: 400, height: 200, x: 0, y: 400})
    grid.add(StubPane, {id: 3, width: 400, height: 200, x: 0, y: 200})
    grid.add(StubPane, {id: 4, width: 400, height: 200, x: 500, y: 200})
    grid.getPane(1).maxSize('up')
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

test('wrapper.maxSize(direction): can max pane size right', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200})
    grid.getPane(1).maxSize('right')
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

test('wrapper.maxSize(direction): can max pane size right with obstructing panes', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200})
    grid.add(StubPane, {id: 2, width: 400, height: 200, x: 600, y: 0})
    grid.add(StubPane, {id: 3, width: 400, height: 200, x: 1000, y: 0})
    grid.add(StubPane, {id: 4, width: 400, height: 200, x: 1000, y: 300})
    grid.getPane(1).maxSize('right')
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

test('wrapper.maxSize(direction): can max pane size left', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 1200, y: 0})
    grid.getPane(1).maxSize('left')
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

test('wrapper.maxSize(direction): can max pane size left with obstructing pane', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 1200, y: 0})
    grid.add(StubPane, {id: 2, width: 400, height: 200, x: 500, y: 0})
    grid.add(StubPane, {id: 3, width: 400, height: 200, x: 100, y: 0})
    grid.add(StubPane, {id: 4, width: 400, height: 200, x: 100, y: 400})
    grid.getPane(1).maxSize('left')
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

test('wrapper.decreaseSizeDirectional(direction, amount): can decrease size directionally up', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    const pane = grid.add(StubPane, {id: 1, width: 400, height: 200, x: 0, y: 700})
    const changeBounds = sinon.spy()
    pane.once('changeBounds', changeBounds)
    grid.getPane(1).decreaseSizeDirectional('up', 10)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 700,
      width: 400,
      height: 190
    }, 'pane sized decreased directionally')
    t.ok(changeBounds.calledOnce, 'changeBounds event emitted')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.decreaseSizeDirectional(direction, amount): can decrease size directionally down', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 0, y: 700})
    grid.getPane(1).decreaseSizeDirectional('down', 10)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 710,
      width: 400,
      height: 190
    }, 'pane sized decreased directionally')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.decreaseSizeDirectional(direction, amount): can decrease size directionally left', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 0, y: 700})
    grid.getPane(1).decreaseSizeDirectional('left', 10)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 700,
      width: 390,
      height: 200
    }, 'pane sized decreased directionally')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.decreaseSizeDirectional(direction, amount): can decrease size directionally right', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 0, y: 700})
    grid.getPane(1).decreaseSizeDirectional('right', 10)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 10,
      y: 700,
      width: 390,
      height: 200
    }, 'pane sized decreased directionally')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.decreaseSizeDirectional(direction, amount): bad params', t => {
  t.plan(6)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 0, y: 700})
    t.throws(
      () => grid.getPane(1).decreaseSizeDirectional('notADirection', 10),
      /notADirection must be one of right\/left\/up\/down/,
      'cannot decrease directional size with a bad direction'
    )
    t.throws(
      () => grid.getPane(1).decreaseSizeDirectional('left', 'a'),
      /a must be numeric/,
      'cannot decrease directional size with bad amount'
    )
    t.throws(
      () => grid.getPane(1).decreaseSizeDirectional('left', 400),
      /pane is too small/,
      'cannot decrease pane size to zero left'
    )
    t.throws(
      () => grid.getPane(1).decreaseSizeDirectional('right', 400),
      /pane is too small/,
      'cannot decrease pane size to zero right'
    )
    t.throws(
      () => grid.getPane(1).decreaseSizeDirectional('up', 200),
      /pane is too small/,
      'cannot decrease pane size to zero up'
    )
    t.throws(
      () => grid.getPane(1).decreaseSizeDirectional('down', 200),
      /pane is too small/,
      'cannot decrease pane size to zero down'
    )
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.increaseSizeDirectional(direction, amount): can increase size directionally up', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    const pane = grid.add(StubPane, {id: 1, width: 400, height: 200, x: 0, y: 700})
    const changeBounds = sinon.spy()
    pane.once('changeBounds', changeBounds)
    grid.getPane(1).increaseSizeDirectional('up', 10)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 690,
      width: 400,
      height: 210
    }, 'pane sized increased directionally')
    t.ok(changeBounds.calledOnce, 'changeBounds event emitted')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.increaseSizeDirectional(direction, amount): can increase size directionally down', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 0, y: 200})
    grid.getPane(1).increaseSizeDirectional('down', 10)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 200,
      width: 400,
      height: 210
    }, 'pane sized increased directionally')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.increaseSizeDirectional(direction, amount): can increase size directionally left', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 100, y: 700})
    grid.getPane(1).increaseSizeDirectional('left', 10)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 90,
      y: 700,
      width: 410,
      height: 200
    }, 'pane sized increased directionally')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.increaseSizeDirectional(direction, amount): can increase size directionally right', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 0, y: 700})
    grid.getPane(1).increaseSizeDirectional('right', 10)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 700,
      width: 410,
      height: 200
    }, 'pane sized increased directionally')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.increaseSizeDirectional(direction, amount): bad params', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 100, y: 700})
    t.throws(
      () => grid.getPane(1).increaseSizeDirectional('notADirection', 10),
      /notADirection must be one of right\/left\/up\/down/,
      'cannot increase directional size with a bad direction'
    )
    t.throws(
      () => grid.getPane(1).increaseSizeDirectional('left', 'a'),
      /a must be numeric/,
      'cannot increase directional size with bad amount'
    )
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.increaseSizeDirectional(direction, amount): maxes pane size in direction if not enough room left', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 30, y: 700})
    grid.getPane(1).increaseSizeDirectional('left', 50)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 700,
      width: 430,
      height: 200
    }, 'pane sized increased directionally')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.increaseSizeDirectional(direction, amount): maxes pane size in direction if not enough room right', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 1170, y: 700})
    grid.getPane(1).increaseSizeDirectional('right', 50)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 1170,
      y: 700,
      width: 430,
      height: 200
    }, 'pane sized increased directionally')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.increaseSizeDirectional(direction, amount): maxes pane size in direction if not enough room up', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 0, y: 30})
    grid.getPane(1).increaseSizeDirectional('up', 50)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 400,
      height: 230
    }, 'pane sized increased directionally')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.increaseSizeDirectional(direction, amount): maxes pane size in direction if not enough room down', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 0, y: 670})
    grid.getPane(1).increaseSizeDirectional('down', 50)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 670,
      width: 400,
      height: 230
    }, 'pane sized increased directionally')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.increaseSizeDirectional(direction, amount): maxes pane size in direction if not enough room left with obstruction', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 430, y: 0})
    grid.add(StubPane, {id: 2, width: 400, height: 200, x: 0, y: 0})
    grid.getPane(1).increaseSizeDirectional('left', 50)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 400,
      y: 0,
      width: 430,
      height: 200
    }, 'pane sized increased directionally')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.increaseSizeDirectional(direction, amount): maxes pane size in direction if not enough room right with obstruction', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 770, y: 0})
    grid.add(StubPane, {id: 2, width: 400, height: 200, x: 1200, y: 0})
    grid.getPane(1).increaseSizeDirectional('right', 50)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 770,
      y: 0,
      width: 430,
      height: 200
    }, 'pane sized increased directionally')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.increaseSizeDirectional(direction, amount): maxes pane size in direction if not enough room up with obstruction', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 0, y: 230})
    grid.add(StubPane, {id: 2, width: 400, height: 200, x: 0, y: 0})
    grid.getPane(1).increaseSizeDirectional('up', 50)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 200,
      width: 400,
      height: 230
    }, 'pane sized increased directionally')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.increaseSizeDirectional(direction, amount): maxes pane size in direction if not enough room down with obstruction', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, width: 400, height: 200, x: 0, y: 0})
    grid.add(StubPane, {id: 2, width: 400, height: 200, x: 0, y: 230})
    grid.getPane(1).increaseSizeDirectional('down', 50)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 400,
      height: 230
    }, 'pane sized increased directionally')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})
