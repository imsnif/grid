'use strict'

import test from 'tape'
import Grid from '../../'

const WIDTH = 1600
const HEIGHT = 900

test('can create grid', async t => {
  t.plan(2)
  try {
    const grid = new Grid(WIDTH, HEIGHT)
    t.deepEquals(grid.size, {width: WIDTH, height: HEIGHT}, 'correct initial size')
    t.equals(grid.windows.length, 0, 'grid created with no windows')
  } catch (e) {
    t.fail(e.toString())
    t.end()
  }
})

test('cannot create grid with bad parameters', async t => {
  t.plan(3)
  t.throws(new Grid(), new Error('provide width and height'))
  t.throws(new Grid(undefined, HEIGHT), new Error('provide width and height'))
  t.throws(new Grid('foo', HEIGHT), new Error('width and height should be numeric'))
})
