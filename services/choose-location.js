'use strict'

const assert = require('assert')
const validate = require('validate.js')
const occupy = require('./occupy-pane')

const gaugeAdjacentLocation = (pane, direction, obstruction) => {
  const obst = obstruction || pane // skip over self if no obstruction
  const adjacentCoords =
      direction === 'right' ? { x: obst.x + obst.width }
    : direction === 'left' ? { x: obst.x - obst.width }
    : direction === 'down' ? { y: obst.y + obst.height }
    : direction === 'up' ? { y: obst.y - obst.height } : {}
  return Object.assign({}, pane, adjacentCoords)
}

const findPotentialLocation = (grid, pane, obstructions, direction, reducer) => {
  const closestObst = obstructions.reduce(reducer, {})
  const paneAtNextLoc = gaugeAdjacentLocation(pane, direction, closestObst)
  if (
    paneAtNextLoc.y < 0 ||
    paneAtNextLoc.x < 0 ||
    paneAtNextLoc.y + paneAtNextLoc.height > grid.height ||
    paneAtNextLoc.x + paneAtNextLoc.width > grid.width
  ) throw new Error('space is occupied')
  return paneAtNextLoc
}

const checkLine = (grid, pane, direction, blockedCoords = []) => {
  try {
    return occupy(grid, pane)
  } catch (e) {
    if (!e.coords) {
      e.coords = blockedCoords
      throw e
    }
    blockedCoords.push(e.coords)
    const paneAtNextLoc = gaugeAdjacentLocation(pane, direction, e.coords)
    return checkLine(grid, paneAtNextLoc, direction, blockedCoords)
  }
}

const checkMultipleLines = (grid, pane, primaryDirection, secondaryDirection) => {
  try {
    return checkLine(grid, pane, primaryDirection)
  } catch (e) {
    const paneAtNextLoc =
      secondaryDirection === 'up'
      ? findPotentialLocation(
          grid, pane, e.coords, secondaryDirection, (current, candidate) =>
            validate.isInteger(current.y) &&
            current.y > candidate.y ? current : candidate
      ) : secondaryDirection === 'down'
      ? findPotentialLocation(
        grid, pane, e.coords, secondaryDirection, (current, candidate) =>
          validate.isInteger(current.y) &&
          validate.isInteger(current.height) &&
          current.y + current.height < candidate.y + candidate.height ? current : candidate
      ) : secondaryDirection === 'right'
      ? findPotentialLocation(
        grid, pane, e.coords, secondaryDirection, (current, candidate) =>
          validate.isInteger(current.x) &&
          validate.isInteger(current.height) &&
          current.x + current.width < candidate.x + candidate.width ? current : candidate
      ) : secondaryDirection === 'left'
      ? findPotentialLocation(
        grid, pane, e.coords, secondaryDirection, (current, candidate) =>
          validate.isInteger(current.x) &&
          current.x > candidate.x ? current : candidate
      ) : {}
    return checkMultipleLines(grid, paneAtNextLoc, primaryDirection, secondaryDirection)
  }
}

module.exports = {
  existingPane: function chooseLocation (grid, pane, direction) {
    assert(validate.isObject(grid))
    assert(validate.isObject(pane))
    const paneNewLoc = gaugeAdjacentLocation(pane, direction)
    const secondaryDirections = {
      first: direction === 'right' || direction === 'left' ? 'up' : 'right',
      second: direction === 'right' || direction === 'left' ? 'down' : 'left'
    }
    try {
      return checkMultipleLines(grid, paneNewLoc, direction, secondaryDirections.first)
    } catch (e) {
      return checkMultipleLines(grid, paneNewLoc, direction, secondaryDirections.second)
    }
  },
  newPane: function chooseNewLocation (grid, pane, direction) {
    assert(validate.isObject(grid))
    assert(validate.isObject(pane))
    const secondaryDirections = {
      first: direction === 'right' || direction === 'left' ? 'up' : 'right',
      second: direction === 'right' || direction === 'left' ? 'down' : 'left'
    }
    try {
      return checkMultipleLines(grid, pane, direction, secondaryDirections.first)
    } catch (e) {
      return checkMultipleLines(grid, pane, direction, secondaryDirections.second)
    }
  }
}
