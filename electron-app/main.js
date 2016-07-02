'use strict'

const electron = require('electron')
const app = electron.app
const globalShortcut = electron.globalShortcut
const path = require('path')
const window = require('electron-window')

window.getFocusedWindow = window.getFocusedWindow || electron.BrowserWindow.getFocusedWindow

app.on('ready', () => {
  const screen = electron.screen
  globalShortcut.register('CommandOrControl+l', () => {
    const displays = screen.getAllDisplays()
    const screenBounds = displays[0].bounds
    const pane = window.getFocusedWindow()
    console.log('pane:', pane)
    if (pane) moveRight(screenBounds, pane)
  })
  globalShortcut.register('CommandOrControl+h', () => {
    const displays = electron.screen.getAllDisplays()
    const screenBounds = displays[0].bounds
    const pane = window.getFocusedWindow()
    console.log('screenBounds:', screenBounds)
    if (pane) moveLeft(screenBounds, pane)
  })
  globalShortcut.register('CommandOrControl+j', () => {
    const displays = electron.screen.getAllDisplays()
    const screenBounds = displays[0].bounds
    const pane = window.getFocusedWindow()
    if (pane) moveDown(screenBounds, pane)
  })
  globalShortcut.register('CommandOrControl+k', () => {
    const displays = electron.screen.getAllDisplays()
    const screenBounds = displays[0].bounds
    const pane = window.getFocusedWindow()
    if (pane) moveUp(screenBounds, pane)
  })
  createWindow()
  globalShortcut.register('CommandOrControl+w', createWindow)
  globalShortcut.register('CommandOrControl+q', switchWindow)
})

function switchWindow () {
  const pane = window.getFocusedWindow()
  const allPanes = window.windows
  const newWindowId = Object.keys(allPanes).filter(id => +id !== +pane.id)[0]
  window.windows[newWindowId].focus()
}

function moveRight (workArea, pane) {
  const bounds = pane.getBounds()
  const x = bounds.x + 50 > workArea.width - bounds.width ? workArea.width - bounds.width : bounds.x + 50
  const newBounds = Object.keys(window.windows)
    .filter(id => id !== pane.id)
    .some(id => {
      const windowBounds = window.windows[id].getBounds()
      return windowBounds.x - windowBounds.width === bounds.x &&
        bounds.y > windowBounds.y - windowBounds.height &&
        bounds.y < windowBounds.y + windowBounds.height
    })
    ? bounds
    : Object.assign(bounds, {x})
  pane.setBounds(newBounds)
  console.log('new Bounds:', pane.getBounds())
}

function moveLeft (workArea, pane) {
  const bounds = pane.getBounds()
  const x = bounds.x - 50 < 0 ? 0 : bounds.x - 50
  const newBounds = Object.keys(window.windows)
    .filter(id => id !== pane.id)
    .some(id => {
      const windowBounds = window.windows[id].getBounds()
      return windowBounds.x + windowBounds.width === bounds.x &&
        bounds.y > windowBounds.y - windowBounds.height &&
        bounds.y < windowBounds.y + windowBounds.height
    })
    ? bounds
    : Object.assign(bounds, {x})
  pane.setBounds(newBounds)
  console.log('new Bounds:', pane.getBounds())
}

function moveUp (workArea, pane) {
  const bounds = pane.getBounds()
  const y = bounds.y - 50 < 0 ? 0 : bounds.y - 50
  const newBounds = Object.keys(window.windows)
    .filter(id => +id !== +pane.id)
    .some(id => {
      console.log('in some')
      const windowBounds = window.windows[id].getBounds()
      return windowBounds.y + windowBounds.height === bounds.y &&
        bounds.x > windowBounds.x - windowBounds.width &&
        bounds.x < windowBounds.x + windowBounds.width
    })
    ? bounds
    : Object.assign(bounds, {y})
  pane.setBounds(newBounds)
  console.log('new Bounds:', pane.getBounds())
}

function moveDown (workArea, pane) {
  const bounds = pane.getBounds()
  const y = bounds.y + 50 > workArea.height - bounds.height ? workArea.height - bounds.height : bounds.y + 50
  const newBounds = Object.keys(window.windows)
    .filter(id => id !== pane.id)
    .some(id => {
      const windowBounds = window.windows[id].getBounds()
      return windowBounds.y - windowBounds.height === bounds.y &&
        bounds.x > windowBounds.x - windowBounds.width &&
        bounds.x < windowBounds.x + windowBounds.width
    })
    ? bounds
    : Object.assign(bounds, {y})
  pane.setBounds(newBounds)
  console.log('new Bounds:', pane.getBounds())
}

function createWindow () {
  const created = window.createWindow({ width: 300, height: 200, frame: false, blinkFeatures: {KeyboardEventKey: true} })
  const indexPath = path.resolve(__dirname, 'index.html')

  created.showUrl(indexPath, () => {
    console.log('window is now visible!')
  })
}
