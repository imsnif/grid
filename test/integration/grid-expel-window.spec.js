'use strict'
import test from 'tape'
import Grid from '../../'
import sinon from 'sinon'
const WIDTH = 1600
const HEIGHT = 900

function StubWindow (id, width, height) {
  this.id = id
  this.width = width
  this.height = height
}

StubWindow.prototype.close = function () {} // no-op
StubWindow.prototype.removeAllListeners = function () {} // no-op

test('can expel pane from grid', t => {
  t.plan(4)
  try {
    const closeSpy = sinon.spy(StubWindow.prototype, 'close')
    const removeListenersSpy = sinon.spy(StubWindow.prototype, 'removeAllListeners')
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubWindow, {id: 1, width: 400, height: 600})
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
  t.plan(5)
  try {
    const closeSpy = sinon.spy(StubWindow.prototype, 'close')
    const removeListenersSpy = sinon.spy(StubWindow.prototype, 'removeAllListeners')
    const grid = new Grid(WIDTH, HEIGHT)
    grid.add(StubWindow, {id: 1, width: 400, height: 600})
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
    t.equal(grid.panes.length, 1, 'existing pane remains in grid')
    closeSpy.restore()
    removeListenersSpy.restore()
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})
