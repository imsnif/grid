'use strict'

import test from 'tape'
import Grid from '../../'
import _ from 'lodash'

const WIDTH = 1600
const HEIGHT = 900

function StubWindow (id, width, height) {
  this.id = id
  this.width = width,
  this.height = height
}

test('can change window size', t => {
  t.plan(2)
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
    }, 'window added in default location')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test.skip('can change window location', t => {
  // TBD
})

test.skip('can change window size and location', t => {
  // TBD
})

test.skip('cannot resize window over another window', t => {
  // TBD
})

test.skip('cannot move window over another window', t => {
  // TBD
})

test.skip('cannot resize window outside grid', t => {
  // TBD
})

test.skip('cannot move window outside grid', t => {
  // TBD
})
