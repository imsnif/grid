import test from 'tape'
import occupy from '../../services/occupy-pane'

function createpane (opts) {
  return {
    id: opts.id,
    x: opts.x,
    y: opts.y,
    width: opts.width,
    height: opts.height
  }
}

function createGrid (opts) {
  return {
    width: opts.width,
    height: opts.height,
    panes: opts.panes || []
  }
}

test('occupy(grid, pane): bad parameters', t => {
  t.plan(2)
  try {
    const grid = createGrid({width: 200, height: 200})
    const pane = createpane({id: 1, x: 0, y: 0, width: 100, height: 100})
    t.throws(
      () => occupy('a', pane),
      Error,
      'occupy with bad grid'
    )
    t.throws(
      () => occupy(grid, 'a'),
      Error,
      'occupy with bad pane'
    )
  } catch (err) {
    t.fail(err.toString())
    t.end()
  }
})

test('occupy(grid, pane): occupy pane on representation', t => {
  t.plan(1)
  try {
    const pane1 = createpane(1, 0, 0, 100, 100)
    const pane2 = createpane(1, 200, 200, 100, 100)
    const grid = createGrid({width: 500, height: 500, panes: [pane1]})
    occupy(grid, pane2)
    t.pass('second pane occupied on grid')
    // This test is only possible if the first and second location do not have any overlap
  } catch (err) {
    t.fail(err.toString())
    t.end()
  }
})

test('occupy(grid, pane): size exceeds representation', t => {
  t.plan(1)
  try {
    const grid = createGrid({width: 200, height: 200})
    const pane = createpane({id: 1, x: 0, y: 0, width: 300, height: 300})
    t.throws(
      () => occupy(grid, pane),
      Error,
      'pane size exceeds grid'
    )
  } catch (err) {
    t.fail(err.toString())
    t.end()
  }
})

test('occupy(grid, pane): space is occupied', t => {
  t.plan(1)
  try {
    const pane1 = createpane({id: 1, x: 0, y: 0, width: 200, height: 200})
    const pane2 = createpane({id: 2, x: 0, y: 0, width: 200, height: 200})
    const grid = createGrid({width: 200, height: 200, panes: [pane1]})
    t.throws(
      () => occupy(grid, pane2),
      Error,
      'space is occupied on grid'
    )
  } catch (err) {
    t.fail(err.toString())
    t.end()
  }
})
