'use strict'
import test from 'tape'
import Grid from '../../'
import sinon from 'sinon'
import {EventEmitter} from 'events'
const WIDTH = 1600
const HEIGHT = 900

function BrowserWindow (opts) {
  // mock electron BrowserWindow
  this._emitter = new EventEmitter()
  this.id = opts.id
  this.width = opts.width
  this.height = opts.height
}

BrowserWindow.prototype.getBounds = function () {
  return {
    width: this.width,
    height: this.height,
    x: this.x,
    y: this.y
  }
}

BrowserWindow.prototype.close = function () {
  this.emit('close')
}

BrowserWindow.prototype.on = function () {
  this._emitter.on.apply(this._emitter, arguments)
}

BrowserWindow.prototype.emit = function () {
  this._emitter.emit.apply(this._emitter, arguments)
}

BrowserWindow.prototype.setBounds = function (bounds) {
  this.width = bounds.width
  this.height = bounds.height
  this.x = bounds.x
  this.y = bounds.y
}

BrowserWindow.prototype.removeAllListeners = function (type) {
  // no-op
}

test('can remove electron BrowserWindow', t => {
  t.plan(2)
  try {
    const spy = sinon.spy(BrowserWindow.prototype, 'close')
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(BrowserWindow, {id: 1, width: 400, height: 600})
    grid.remove(1)
    t.equal(grid.panes.length, 0, 'grid removed from pane')
    t.ok(spy.calledOnce, 'close method of BrowserWindow was caled only once')
    spy.restore()
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('BrowserWindow.close() removes pane from grid', t => {
  t.plan(1)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(BrowserWindow, {id: 1, width: 400, height: 600})
    const pane = grid.getPane(1)
    pane.close()
    t.equal(grid.panes.length, 0, 'grid removed from pane')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('can expel pane from grid', t => {
  t.plan(4)
  try {
    const closeSpy = sinon.spy(BrowserWindow.prototype, 'close')
    const removeListenersSpy = sinon.spy(BrowserWindow.prototype, 'removeAllListeners')
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(BrowserWindow, {id: 1, width: 400, height: 600})
    const winInGrid = grid.getPane(1).wrapped
    const expelledWin = grid.expel(1)
    t.equal(grid.panes.length, 0, 'grid removed from pane')
    t.deepEqual(winInGrid, expelledWin, 'expelledWin equals window in grid')
    t.ok(
      removeListenersSpy.withArgs('close').calledOnce,
      'close listener removed from window before expulsion'
    )
    t.ok(closeSpy.notCalled, 'close method was not called on window')
    closeSpy.restore()
    removeListenersSpy.restore()
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('cannot expel pane with bad params', t => {
  t.plan(4)
  try {
    const closeSpy = sinon.spy(BrowserWindow.prototype, 'close')
    const removeListenersSpy = sinon.spy(BrowserWindow.prototype, 'removeAllListeners')
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(BrowserWindow, {id: 1, width: 400, height: 600})
    t.throws(
      () => grid.expel(),
      /Error: id is not defined/,
      'cannot expel window without id'
    )
    t.throws(
      () => grid.expel(2),
      /Error: 2 does not exist/,
      'cannot expel window without id'
    )
    t.ok(closeSpy.notCalled, 'close method of existing window was not called')
    t.ok(removeListenersSpy.notCalled, 'removeListeners was not called on existing window')
    closeSpy.restore()
    removeListenersSpy.restore()
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})
