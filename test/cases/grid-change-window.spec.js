'use strict'

import test from 'tape'
import Grid from '../../'

const WIDTH = 1600
const HEIGHT = 900

function StubWindow (id, width, height) {
  this.id = id
  this.width = width,
  this.height = height
}

test('can change window size', t => {
  // TBD
})

test.skip('can change window location', t => {
  // TBD
})

test.skip('can change window size and location', t => {
  // TBD
})

test.skip('cannot resize window over another window', t => {
  // TBD
})

test.skip('cannot move window over another window', t => {
  // TBD
})

test.skip('cannot resize window outside grid', t => {
  // TBD
})

test.skip('cannot move window outside grid', t => {
  // TBD
})
