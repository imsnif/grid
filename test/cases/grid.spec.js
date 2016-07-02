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
  return {width: 1600, height: 900}
}

test('create grid', async t => {
  t.plan(2)
  try {
    const grid = new Grid(createStubScreen())
    t.deepEquals(grid.size, {width: 1600, height: 900}, 'grid created with proper size')
    t.equals(grid.windows.length, 0, 'grid starts with no windows')
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('add window to grid', async t => {
  t.plan(3)
  try {
    const grid = new Grid(createStubScreen())
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
    consol.log('fail')
    t.fail(e)
  }
})

test.skip('able to move window to all parts of main display', async t => {
  // TBD
})

test.skip('window cannot move up over another window', async t => {
  // TBD
})

test.skip('window cannot move down over another window', async t => {
  // TBD
})

test.skip('window cannot move left over another window', async t => {
  // TBD
})

test.skip('window cannot move right over another window', async t => {
  // TBD
})
