'use strict'

const assert = require('assert')
const validate = require('validate.js')
const sizeChanger = require('../components/size-changer')
const locationChanger = require('../components/location-changer')

function findImplementation (constructor) {
  try {
    return require(`../implementations/${constructor.name}`)
  } catch (e) {
    return false
  }
}

module.exports = WindowWrapper

function WindowWrapper (Wrappee, opts) {
  assert(validate.isInteger(opts.x))
  assert(validate.isInteger(opts.y))
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

function getters (state) {
  let ret = {}
  Object.keys(state).forEach(k => {
    ret[k] = {
      get: () => state[k],
      set: (val) => { state[k] = val }
    }
  })
  return ret
}
