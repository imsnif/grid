'use strict'

import test from 'tape'
import Grid from '../../lib/grid'
import _ from 'lodash'

const WIDTH = 1600
const HEIGHT = 900

function StubPane (params) {
  this.id = params.id
  this.x = params.x
  this.y = params.y
  this.width = params.width
  this.height = params.height
}

test('maxAllPanes() - can max size multiple panes in all directions', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, x: 400, y: 300, width: 400, height: 300})
    grid.add(StubPane, {id: 2, x: 800, y: 300, width: 400, height: 300})
    grid.maxAllPanes()
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 800,
      height: 900
    }, 'first pane maxed up, down and left')
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 800,
      y: 0,
      width: 800,
      height: 900
    }, 'second pane maxed up, down and right')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('findGaps() - can find all gaps in a grid with multiple panes', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, x: 0, y: 0, width: 400, height: 300})
    grid.add(StubPane, {id: 2, x: 400, y: 0, width: 400, height: 300})
    grid.add(StubPane, {id: 3, x: 800, y: 0, width: 400, height: 300})
    grid.add(StubPane, {id: 4, x: 1200, y: 0, width: 400, height: 300})
    grid.add(StubPane, {id: 5, x: 0, y: 300, width: 400, height: 300})
    grid.add(StubPane, {id: 6, x: 800, y: 300, width: 400, height: 300})
    grid.add(StubPane, {id: 7, x: 0, y: 600, width: 1600, height: 300})
    const gaps = grid.findGaps()
    t.equals(gaps.length, 2, 'two gaps found')
    t.deepEquals(_.pick(gaps[0], ['x', 'y', 'width', 'height']), {
      x: 400,
      y: 300,
      width: 400,
      height: 300
    }, 'first gap reported properly')
    t.deepEquals(_.pick(gaps[1], ['x', 'y', 'width', 'height']), {
      x: 1200,
      y: 300,
      width: 400,
      height: 300
    }, 'second gap reported properly')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('findGaps() - can find all gaps in a grid with a single pane', t => {
  t.plan(5)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, x: 400, y: 300, width: 400, height: 300})
    const gaps = grid.findGaps()
    t.equals(gaps.length, 4, 'four gaps found')
    t.deepEquals(_.pick(gaps[0], ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 0,
      width: 1600,
      height: 300
    }, 'first gap reported properly')
    t.deepEquals(_.pick(gaps[1], ['x', 'y', 'width', 'height']), {
      x: 0,
      y: 300,
      width: 400,
      height: 600
    }, 'second gap reported properly')
    t.deepEquals(_.pick(gaps[2], ['x', 'y', 'width', 'height']), {
      x: 800,
      y: 300,
      width: 800,
      height: 600
    }, 'third gap reported properly')
    t.deepEquals(_.pick(gaps[3], ['x', 'y', 'width', 'height']), {
      x: 400,
      y: 600,
      width: 400,
      height: 300
    }, 'fourth gap reported properly')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('switchPanes(firstId, secondId) - can switch dimensions of two panes', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, x: 400, y: 300, width: 300, height: 200})
    grid.add(StubPane, {id: 2, x: 800, y: 300, width: 200, height: 300})
    grid.switchPanes(1, 2)
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 800,
      y: 300,
      width: 200,
      height: 300
    }, 'first pane switched location to that of second pane')
    t.deepEquals(_.pick(grid.getPane(2), ['x', 'y', 'width', 'height']), {
      x: 400,
      y: 300,
      width: 300,
      height: 200
    }, 'second pane switched location to that of first pane')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('switchPanes(firstId, secondId) - bad params', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, x: 400, y: 300, width: 300, height: 200})
    t.throws(
      () => grid.switchPanes(1, 2),
      /2 does not exist/,
      'cannot switch location with non-existent pane'
    )
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})
