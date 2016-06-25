'use strict'

import test from 'tape'
import { Application } from 'spectron'
import robot from 'robotjs'

function createApp () {
  return new Application({
    path: './node_modules/.bin/electron',
    args: ['./main.js']
  })
}

test('able to open new window', async t => {
  t.plan(1)
  try {
    const app = createApp()
    await app.start()
    robot.keyTap('w', 'control')
    await app.browserWindow.blur()
    await app.webContents.sendInputEvent({
      type: 'char',
      keyCode: 'w'
    })
    const windowCount = await app.client.getWindowCount()
    t.equals(windowCount, 2, 'New window was opened')
  } catch (e) {
    t.fail(e)
  }
})

test.skip('able to move window to all parts of main display', async t => {
  // TBD
})

test.skip('window cannot move up over another window', async t => {
  // TBD
})

test.skip('window cannot move down over another window', async t => {
  // TBD
})

test.skip('window cannot move left over another window', async t => {
  // TBD
})

test.skip('window cannot move right over another window', async t => {
  // TBD
})
