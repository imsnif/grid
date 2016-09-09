'use strict'

// electron-terminal-window implementation

const BrowserWindowImplementation = require('./BrowserWindow')

module.exports = Object.assign({}, BrowserWindowImplementation, {
  changeSize: (state, width, height) => {
    BrowserWindowImplementation.changeSize(state, width, height)
    state.wrapped.webContents.send('termResize', {width, height})
  },
  changeBounds: (state) => {
    BrowserWindowImplementation.changeBounds(state)
    state.wrapped.webContents.send('termResize', {
      width: state.width,
      height: state.height
    })
  }
})
