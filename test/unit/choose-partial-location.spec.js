'use strict'

import test from 'tape'
import choosePartial from '../../services/choose-partial-location'
import uuid from 'uuid'

function StubGrid (width, height, panes) {
  this.width = width
  this.height = height
  this.panes = panes
}

function StubPane (x, y, width, height) {
  this.id = uuid.v4()
  this.x = x
  this.y = y
  this.width = width
  this.height = height
}

test('can choose partial location to the right', t => {
  t.plan(1)
  try {
    const grid = new StubGrid(800, 600, [])
    const pane = new StubPane(0, 100, 100, 200)
    const chosen = choosePartial(grid, pane, 'right')
    t.ok(
      chosen.x >= pane.x + pane.width,
      'new location is to the right of previous location'
    )
  } catch (e) {
    t.fail(e)
  }
})

test('can choose partial location to the right with obstruction', t => {
  t.plan(1)
  try {
    const obstructingPane = new StubPane(100, 0, 700, 100)
    const grid = new StubGrid(800, 600, [obstructingPane])
    const pane = new StubPane(0, 0, 100, 100)
    const chosen = choosePartial(grid, pane, 'right')
    t.ok(
      chosen.x >= pane.x + pane.width,
      'new location is to the right of previous location'
    )
  } catch (e) {
    t.fail(e)
  }
})

test('can choose partial location to the right with whole row obstructed', t => {
  t.plan(1)
  try {
    const obstructingPane = new StubPane(0, 100, 150, 200)
    const grid = new StubGrid(800, 600, [obstructingPane])
    const pane = new StubPane(0, 0, 100, 200)
    const chosen = choosePartial(grid, pane, 'right')
    t.ok(
      chosen.x >= pane.x + pane.width,
      'new location is to the right of previous location'
    )
  } catch (e) {
    t.fail(e)
  }
})

test('can choose partial location to the left', t => {
  t.plan(1)
  try {
    const grid = new StubGrid(800, 600, [])
    const pane = new StubPane(100, 100, 100, 200)
    const chosen = choosePartial(grid, pane, 'left')
    t.ok(
      chosen.x <= pane.x,
      'new location is to the left of previous location'
    )
  } catch (e) {
    t.fail(e)
  }
})

test('can choose partial location to the left with obstruction', t => {
  t.plan(1)
  try {
    const obstructingPane = new StubPane(100, 100, 150, 200)
    const grid = new StubGrid(800, 600, [obstructingPane])
    const pane = new StubPane(300, 100, 100, 200)
    const chosen = choosePartial(grid, pane, 'left')
    t.ok(
      chosen.x < pane.x,
      'new location is to the left of previous location'
    )
  } catch (e) {
    t.fail(e)
  }
})

test('can choose partial location to the left with whole row obstructed', t => {
  t.plan(1)
  try {
    const obstructingPane = new StubPane(0, 0, 700, 100)
    const grid = new StubGrid(800, 600, [obstructingPane])
    const pane = new StubPane(700, 0, 100, 100)
    const chosen = choosePartial(grid, pane, 'left')
    t.ok(
      chosen.x < pane.x,
      'new location is to the left of previous location'
    )
  } catch (e) {
    t.fail(e)
  }
})

test('can choose partial location up', t => {
  t.plan(1)
  try {
    const grid = new StubGrid(800, 600, [])
    const pane = new StubPane(100, 200, 100, 200)
    const chosen = choosePartial(grid, pane, 'up')
    t.ok(
      chosen.y <= pane.y,
      'new location is above the previous location'
    )
  } catch (e) {
    t.fail(e)
  }
})

test('can choose partial location up with obstruction', t => {
  t.plan(1)
  try {
    const obstructingPane = new StubPane(100, 100, 150, 200)
    const grid = new StubGrid(800, 600, [obstructingPane])
    const pane = new StubPane(100, 300, 100, 100)
    const chosen = choosePartial(grid, pane, 'up')
    t.ok(
      chosen.y <= pane.y,
      'new location is above the previous location'
    )
  } catch (e) {
    t.fail(e)
  }
})

test('can choose partial location up with full column obstructed', t => {
  t.plan(1)
  try {
    const obstructingPane = new StubPane(0, 0, 100, 500)
    const grid = new StubGrid(800, 600, [obstructingPane])
    const pane = new StubPane(0, 500, 100, 100)
    const chosen = choosePartial(grid, pane, 'up')
    t.ok(
      chosen.y <= pane.y,
      'new location is above the previous location'
    )
  } catch (e) {
    t.fail(e)
  }
})

test('can choose partial location down', t => {
  t.plan(1)
  try {
    const grid = new StubGrid(800, 600, [])
    const pane = new StubPane(100, 200, 100, 200)
    const chosen = choosePartial(grid, pane, 'down')
    t.ok(
      chosen.y >= pane.y + pane.height,
      'new location is below the previous location'
    )
  } catch (e) {
    t.fail(e)
  }
})

test('can choose partial location down with obstruction', t => {
  t.plan(1)
  try {
    const obstructingPane = new StubPane(100, 100, 150, 200)
    const grid = new StubGrid(800, 600, [obstructingPane])
    const pane = new StubPane(100, 0, 100, 100)
    const chosen = choosePartial(grid, pane, 'down')
    t.ok(
      chosen.y >= pane.y + pane.height,
      'new location is below the previous location'
    )
  } catch (e) {
    t.fail(e)
  }
})

test('can choose partial location down with full column obstructed', t => {
  t.plan(1)
  try {
    const obstructingPane = new StubPane(0, 100, 100, 500)
    const grid = new StubGrid(800, 600, [obstructingPane])
    const pane = new StubPane(0, 0, 100, 100)
    const chosen = choosePartial(grid, pane, 'down')
    t.ok(
      chosen.y >= pane.y + pane.height,
      'new location is below the previous location'
    )
  } catch (e) {
    t.fail(e)
  }
})

test('cannot choose partial location when direction is full vertically', t => {
  t.plan(1)
  try {
    const obstructingPane = new StubPane(0, 100, 800, 500)
    const grid = new StubGrid(800, 600, [obstructingPane])
    const pane = new StubPane(0, 0, 100, 100)
    t.throws(
      () => choosePartial(grid, pane, 'down'),
      /Error: space is occupied/,
      'location not chosen when direction is full'
    )
  } catch (e) {
    t.fail(e)
  }
})

test('cannot choose partial location when direction is full horizontally', t => {
  t.plan(1)
  try {
    const obstructingPane = new StubPane(100, 0, 700, 600)
    const grid = new StubGrid(800, 600, [obstructingPane])
    const pane = new StubPane(0, 0, 100, 100)
    t.throws(
      () => choosePartial(grid, pane, 'right'),
      /Error: space is occupied/,
      'location not chosen when direction is full'
    )
  } catch (e) {
    t.fail(e)
  }
})
