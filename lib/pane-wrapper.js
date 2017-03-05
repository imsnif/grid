'use strict'

const assert = require('assert')
const validate = require('validate.js')
const sizeChanger = require('../components/size-changer')
const locationChanger = require('../components/location-changer')
const directionalResizer = require('../components/directional-resizer')
const destructor = require('../components/destructor')
const EventEmitter = require('events')

module.exports = PaneWrapper

function getWrappedObject (Wrappee, opts, offset) {
  if (typeof Wrappee === 'function') {
    return new Wrappee(Object.assign({}, opts, {
      x: opts.x + offset.x,
      y: opts.y + offset.y
    }))
  } else {
    return (Wrappee || {})
  }
}

function PaneWrapper (Wrappee, opts) {
  assert(validate.isInteger(opts.x), `${opts.x} is not an integer`)
  assert(validate.isInteger(opts.y), `${opts.y} is not an integer`)
  assert(validate.isInteger(opts.width), `${opts.width} is not an integer`)
  assert(validate.isInteger(opts.height), `${opts.height} is not an integer`)
  const offset = (opts.grid && opts.grid.offset) || { x: 0, y: 0 }
  const wrapped = getWrappedObject(Wrappee, opts, offset)
  if (typeof wrapped.setBounds === 'function') {
    const currentBounds = wrapped.getBounds()
    wrapped.setBounds(Object.assign({}, currentBounds, {
      x: opts.x + offset.x,
      y: opts.y + offset.y,
      width: opts.width,
      height: opts.height
    }))
  }
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
  const emitter = new EventEmitter()
  return Object.assign(
    state,
    {
      on: emitter.on,
      once: emitter.once,
      emit: emitter.emit,
      removeListener: emitter.removeListener,
      removeAllListeners: emitter.removeAllListeners
      // TODO: rest of relevant emitter methods
    },
    sizeChanger(state),
    locationChanger(state),
    directionalResizer(state),
    destructor(state)
  )
}
