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

test('wrapper.overrideLocation({x, y, width, height}): can override pane location', t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    const changeBounds = sinon.spy()
    const pane = grid.add(StubPane, {id: 1, x: 0, y: 0, width: 400, height: 600})
    pane.once('changeBounds', changeBounds)
    grid.getPane(1).overrideLocation({x: 1200, y: 300, width: 200, height: 200})
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 1200,
      y: 300,
      width: 200,
      height: 200
    }, 'pane location and size overridden')
    t.ok(changeBounds.calledOnce, 'emitted location change')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.overrideLocation({x, y, width, height}): bad params', t => {
  t.plan(3)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubPane, {id: 1, x: 0, y: 0, width: 400, height: 600})
    t.throws(
      () => grid.getPane(1).overrideLocation(),
      /x, y, width and height need to be integers/,
      'proper error thrown without parameters'
    )
    t.throws(
      () => grid.getPane(1).overrideLocation({x: 0, y: 1}),
      /x, y, width and height need to be integers/,
      'proper error thrown without width or height'
    )
    t.throws(
      () => grid.getPane(1).overrideLocation({width: 100, height: 100}),
      /x, y, width and height need to be integers/,
      'proper error thrown without x or y'
    )
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('wrapper.overrideLocation({x, y, width, height}): can override pane location - electron integration', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    const spy = sinon.spy(BrowserWindow.prototype, 'setBounds')
    grid.add(BrowserWindow, {id: 1, x: 0, y: 0, width: 400, height: 600})
    grid.getPane(1).overrideLocation({x: 1200, y: 300, width: 200, height: 200})
    t.deepEquals(_.pick(grid.getPane(1), ['x', 'y', 'width', 'height']), {
      x: 1200,
      y: 300,
      width: 200,
      height: 200
    }, 'pane location and size overridden')
    spy.restore()
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})
