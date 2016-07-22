'use strict'

import test from 'tape'
import Grid from '../../'

test('create grid', async t => {
  t.plan(2)
  const width = 1600
  const height = 900
  try {
    const grid = new Grid({width, height})
    t.deepEquals(grid.size, {width, height}, 'grid created with correct initial size')
    t.equals(grid.windows.length, 0, 'grid created with no windows')
  } catch (e) {
    t.fail(e)
    t.end()
  }
})
