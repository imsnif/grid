'use strict'

import test from 'tape'
import Grid from '../../'

const WIDTH = 1600
const HEIGHT = 900

test('can create grid', t => {
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

test('cannot create grid with bad parameters', t => {
  t.plan(5)
  try {
    t.throws(() => new Grid(), Error, 'no width or height')
    t.throws(() => new Grid(undefined, HEIGHT), Error, 'no width')
    t.throws(() => new Grid(WIDTH), Error, 'no height')
    t.throws(() => new Grid('foo', HEIGHT), Error, 'non numeric width')
    t.throws(() => new Grid(WIDTH, 'bar'), Error, 'non numeric height')
  } catch (e) {
    console.log(e)
    t.fail(e.toString())
  }
})
