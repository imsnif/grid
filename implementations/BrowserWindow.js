'use strict'

// electron BrowserWindow implementation

module.exports = {
  changeSize: (state, width, height) => {
    const bounds = state.wrapped.getBounds()
    state.wrapped.setBounds(Object.assign({}, bounds, {width, height}))
  },
  changeLocation: (state, x, y) => {
    const offset = state.grid.offset || { x: 0, y: 0 }
    const bounds = state.wrapped.getBounds()
    state.wrapped.setBounds(Object.assign({}, bounds, {
      x: x + offset.x,
      y: y + offset.y
    }))
  },
  changeBounds: (state) => {
    const offset = state.grid.offset || { x: 0, y: 0 }
    state.wrapped.setBounds({
      width: state.width,
      height: state.height,
      x: state.x + offset.x,
      y: state.y + offset.y
    })
  }
}
