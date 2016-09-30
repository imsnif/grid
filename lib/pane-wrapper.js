'use strict'

const assert = require('assert')
const validate = require('validate.js')
const sizeChanger = require('../components/size-changer')
const locationChanger = require('../components/location-changer')
const destructor = require('../components/destructor')

module.exports = PaneWrapper

function findImplementation (constructor) {
  try {
    return require(`../implementations/${constructor.name}`)
  } catch (e) {
    return false
  }
}

function PaneWrapper (Wrappee, opts) {
  assert(validate.isInteger(opts.x), `${opts.x} is not an integer`)
  assert(validate.isInteger(opts.y), `${opts.y} is not an integer`)
  assert(validate.isInteger(opts.width), `${opts.width} is not an integer`)
  assert(validate.isInteger(opts.height), `${opts.height} is not an integer`)
  const implementation = findImplementation(Wrappee)
  const offset = opts.grid && opts.grid.offset || { x: 0, y: 0 }
  const wrapped = typeof Wrappee === 'function'
    ? new Wrappee(Object.assign({}, opts, {
      x: opts.x + offset.x,
      y: opts.y + offset.y
    }))
    : {}
  if (!validate.isDefined(opts.id) && !validate.isDefined(wrapped.id)) {
    if (typeof wrapped.close === 'function') wrapped.close()
    throw new Error('id is not defined')
  }
  let state = {
    wrapped,
    grid: opts.grid,
    id: opts.id || wrapped.id,
    width: opts.width,
    height: opts.height,
    x: opts.x,
    y: opts.y
  }
  return Object.assign(
    state,
    sizeChanger(state, implementation),
    locationChanger(state, implementation),
    destructor(state, implementation)
  )
}
