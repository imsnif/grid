'use strict'

import test from 'tape'
import Grid from '../../'

function createStubWindow () {
  return Object.create({
    getBounds: function () {
      return { width: this.width, height: this.height, x: this.x, y: this.y }
    },
    setBounds: function (bounds) {
      this.width = bounds.width
      this.height = bounds.height
      this.x = bounds.x
      this.y = bounds.y
    },
    width: 200,
    height: 100,
    x: 500,
    y: 500
  })
}

function createStubScreen () {
}

test('can add window to grid', async t => {
  t.plan(3)
  try {
    const grid = new Grid({width: 1600, height: 900})
    grid.add(createStubWindow())
    t.equals(grid.windows.length, 1, 'new window successfully added to grid')
    const firstWindowBounds = grid.windows[0].getBounds
    grid.add(createStubwindow())
    t.equals(grid.windows.length, 2, 'second window successfully added to grid')
    const secondWindowBounds = grid.windows[1].getBounds
    if (secondWindowBounds.x + secondWindowBounds.width < firstWindowBounds.x ||
        secondWindowBounds.x > firstWindowBounds.x + firstWindowBounds.width) {
      t.pass('new Window was created in a different horizontal location')
    } else if (secondWindowBounds.y + secondWindowBounds.height < firstWindowBounds.y ||
        secondWindowBounds.y > firstWindowBounds.y + firstWindowBounds.height) {
      t.pass('new window was created in a different vertical location')
    } else {
      t.fail('new Window was created on top of initial window')
    }
  } catch (e) {
    console.log('fail')
    t.fail(e)
  }
})

test.skip('can add window to grid in custom location', async t => {
  // TBD:
  // window cannot be created outside screen bounds
})

test.skip('cannot add window to grid over another window ', async t => {
  // TBD:
  // window cannot be created outside screen bounds
})

test.skip('can change window bounds', async t => {
  // TBD
})

test.skip('cannot change window bounds over an existing window', async t => {
  // TBD
  // fully
  // partially
})
