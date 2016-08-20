'use strict'

const assert = require('assert')
const validate = require('validate.js')
const sizeChanger = require('../components/size-changer')
const locationChanger = require('../components/location-changer')
const getters = require('../components/getters')

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
  const wrapped = typeof Wrappee === 'function'
    ? new Wrappee(opts)
    : {}
  let state = {
    wrapped,
    grid: opts.grid,
    id: opts.id,
    width: opts.width,
    height: opts.height,
    x: opts.x,
    y: opts.y
  }
  return Object.defineProperties(Object.assign(
    {},
    sizeChanger(state, implementation),
    locationChanger(state, implementation)
  ), getters(state))
}
