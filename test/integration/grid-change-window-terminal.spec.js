'use strict'

import test from 'tape'
import Grid from '../../'
import _ from 'lodash'

const WIDTH = 1600
const HEIGHT = 900

function TerminalWindow (opts) {
  // mock electron TerminalWindow
  this.x = opts.x
  this.y = opts.y
  this.width = opts.width
  this.height = opts.height
  this.id = opts.id
}

TerminalWindow.prototype.getBounds = function () {
  return {
    width: this.width,
    height: this.height,
    x: this.x,
    y: this.y
  }
}

TerminalWindow.prototype.setBounds = function (bounds) {
  this.width = bounds.width
  this.height = bounds.height
  this.x = bounds.x
  this.y = bounds.y
}

test('can increase pane size', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(TerminalWindow, {id: 1, width: 400, height: 600})
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

test('wrapper.maxSize(opts): can max pane size down (terminal)', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(TerminalWindow, {id: 1, width: 400, height: 600})
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
