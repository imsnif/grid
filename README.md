# grid
This is a work in progress.

## API
### Grid - new Grid(width, height[, offset])
The Grid constructor is exported by the library.
The units of width, height and offset are dependent upon the implementation, but they will most likely be pixels.
##### Parameters
* **width:** The width of the grid. (eg. 1600)
* **height:** The height of the grid. (eg. 900)
* **offset:** If this grid is part of a larger grid system and needs to be offset, this optional parameter can be provided. (eg. {x: 100, y: 0})

##### State
* **offset:** The current offset of the grid (eg. {x: 100, y: 0})
* **width:** The current width of the grid (eg. 1600)
* **height:** The current height of the grid (eg. 900)
* **panes:** An array of pane objects currently present in the grid. See the Pane component for specifics.

#### Methods
##### **grid.add**(constructor, opts)
Adds a pane to the grid. If an x,y location is not specified, the grid chooses the upper-left-most free location based on the provided width/height.
###### Arguments
  * **constructor:** A constructor out of which the pane will be created. See Pane for more info.
  * **opts:**
    * **width** (**required**) - {integer} desired width of pane
    * **height** (**required**) - {integer} desired height of pane
    * **id** (**required**) - {string} desired id of pane - must be unique across this grid
    * **x** - {integer} desired x position of pane. Must be specified along with y or it will be ignored.
    * **y** - {integer} desired y position of pane. Mus tbe specified along with x or it will be ignored.

###### Returns
The created Pane Object

###### Side Effects
Creates a pane object and places it in the panes array of the state.

##### **grid.getPane**(id)
Returns pane with provided id. Throws an exception if the pane does not exist.
###### Arguments
  * **id:** {string} - the id of the pane

###### Returns
The pane with the desired id.

###### Side Effects
None

##### **grid.remove**(paneId)
Removes pane with paneId from grid.
###### Arguments
  * **paneId:** {string} - the id of the pane to remove

###### Returns
undefined

###### Side Effects
Removes pane from grid and emits the 'close' event from the pane.
Note: this does not destroy the constructed pane object. If this behaviour is desired, it should be called as a result of emitting the 'close' event on the pane.

##### **grid.expel**(paneId)
Removes pane with desired paneId from the grid and returns its constructed object.
###### Arguments
  * **paneId:** {string} - the id of the pane to expel

###### Returns
The constructed 'wrapped' object of the pane.

###### Side Effects
Removes pane from grid and removes all listeners from the pane 'close' event.

##### **grid.maxAllPanes**(opts)
Maxes the size of all panes in the grid in all directions (up/down/left/right)
###### Arguments
  * **opts:**
    * **exclude** {string} paneId to exclude - it will not be resized

###### Returns
undefined

###### Side Effects
Maxes all panes in grid

##### **grid.findGaps**()
Finds all gaps in the grid and returns their coordinates.
###### Arguments
None.

###### Returns
An array of all gaps in grid. Eg.
```javascript
[
  {
    x: 0,
    y: 0,
    width: 100,
    height: 100
  },
  {
    x: 500,
    y: 400,
    width: 50,
    height: 75
  }
]
```

###### Side Effects
None.

##### **grid.switchPanes**(firstId, secondId)
Switches location and size between the two specified panes
###### Arguments
  * **firstId** {string} First pane Id
  * **secondId** {string} Second pane Id

###### Returns
undefined

###### Side Effects
Switches between the two specified panes.
Throws if one or more of the provided ids does not exist.

### Pane
Represents a pane in the grid. This is a wrapper around an implementation object (eg. an electron BrowserWindow instance)

##### State
* **wrapped:** The wrapped object.
* **grid:** The grid to which this pane belongs.
* **id:** The id of this pane.
* **width:** The width of this pane.
* **height:** The height of this pane.
* **x:** This pane's x location.
* **y:** This pane's y location.

#### Methods
##### **pane.changeSize**(width, height)
Changes size of pane.
###### Arguments
  * **width** {integer} The desired new width of the pane
  * **height** {integer} The desired new height of the pane

###### Returns
undefined

###### Side Effects
Changes the size of the pane to the desired size.
Emits a 'changeBounds' event with the new pane bounds.
Throws if width or height are not integers.
Throws if width or height are larger than the grid or smaller than 0.
Throws if the pane's new bounds are blocked by another pane.

##### **pane.maxSize**(direction)
Increases pane size up until an obstacle or the grid's edge.
For example, if the pane was:
```javascript
{
  x: 100,
  y: 100,
  width: 100,
  height: 100
}
```
Calling pane.maxSize('left'), assuming there were no other panes in the way, would make it:
```javascript
{
  x: 0,
  y: 100,
  width: 200,
  height: 100
}
```
###### Arguments
  * **direction** {string} Can be one of up/down/left/right

###### Returns
undefined

###### Side Effects
Changes the size of the pane in the desired direction up until an obstacle or the edge of the grid. If the direction is left or right, it will also change the pane's x,y coordinates as needed.
Emits a 'changeBounds' event with the new pane bounds.
Throws if direction is not up/down/left/right.

##### **pane.changeLocation**(x, y)
Changes location of pane to specified coordinates.

###### Arguments
  * **x** {integer} The new x location of the pane
  * **y** {integer} The new y location of the pane

###### Returns
undefined

###### Side Effects
Changes the pane location to the specified coordinates.
Emits a 'changeBounds' event with the new pane bounds.
Throws if the specified coordinates are blocked or out of the grid bounds.

##### **pane.changeOrMaxLocation**(x, y)
Changes location of pane to specified coordinates, or to the maximum in specified direction if there is an obstacle and the direction is clear enough.

###### Arguments
  * **x** {integer} The new x location of the pane
  * **y** {integer} The new y location of the pane

###### Returns
undefined

###### Side Effects
Changes the pane location to the relevant coordinates.
Emits a 'changeBounds' event with the new pane bounds.
Throws if the specified coordinates are blocked and the direction is unclear (if the new coordinates do not have the same x or same y value as the current coordinates).
Throws if the the pane's location was unchanged (the coordinates are blocked, the direction could be established but the maximum up to that point is blocked by another pane).

##### **pane.squashIntoLocation**(x, y)
Changes location of pane to specified coordinates, and pushes other panes out of the way (or shrinks them if they are on the edge of the grid) in order to achieve this.

###### Arguments
  * **x** {integer} The new x location of the pane
  * **y** {integer} The new y location of the pane

###### Returns
undefined

###### Side Effects
Changes the pane location to the relevant coordinates.
Changes obstructing pane's location or size in order to accomodate this if needed.
Emits a 'changeBounds' event with the new pane bounds.
Emits a 'changeBounds' events from obstructing panes with their new bounds as needed.
Throws if the specified coordinates are blocked and the direction is unclear (if the new coordinates do not have the same x or same y value as the current coordinates).
Throws if there is no room for pane and cannot move other panes out of the way in order to accommodate this.

##### **pane.maxLoc**(direction)
Changes the location of the pane up until the nearest obstacle in the desired direction. If there is no obstacle in that direction, it moces it to the edge of the grid.

###### Arguments
  * **direction** {string} The desired direction, one of up/down/left/right

###### Returns
undefined

###### Side Effects
Changes the pane location to the maximum location in the desired direction.
Emits a 'changeBounds' event with the new pane bounds.
Throws if the direction is not one of up/down/left/right

##### **pane.maxOrSkipLoc**(direction)
Changes the location of the pane up until the nearest obstacle in the desired direction. If the pane is right next to an obstacle, it moves the pane to the other side of that obstacle. If there is no obstacle in that direction, it moces it to the edge of the grid.

###### Arguments
  * **direction** {string} The desired direction, one of up/down/left/right

###### Returns
undefined

###### Side Effects
Changes the pane location to the maximum location in the desired direction.
Emits a 'changeBounds' event with the new pane bounds.
Throws if the direction is not one of up/down/left/right

##### **pane.decreaseSizeDirectional**(direction, amount)
Decreases the size of the pane in the specified direction by the specified amount.

###### Arguments
  * **direction** {string} The desired direction, one of up/down/left/right
  * **amount** {integer} The desired amount, must be a whole number.

###### Returns
undefined

###### Side Effects
Changes the pane bounds.
Emits a 'changeBounds' event with the new pane bounds.
Throws if the direction is not one of up/down/left/right
Throws if amount is not an integer.
Throws if direction is horizontal and amount is less than pane width.
Throws if direction is vertical and amount is less than pane height.

##### **pane.increaseSizeDirectional**(direction, amount)
Increases the size of the pane in the specified direction by the specified amount.

###### Arguments
  * **direction** {string} The desired direction, one of up/down/left/right
  * **amount** {integer} The desired amount, must be a whole number.

###### Returns
undefined

###### Side Effects
Changes the pane bounds.
Emits a 'changeBounds' event with the new pane bounds.
Throws if the direction is not one of up/down/left/right
Throws if amount is not an integer.
Throws if direction is horizontal and amount + pane.width is greater than the grid width.
Throws if direction is vertical and amount + pane.height is greater than the grid height.

##### **pane.increaseAndFillSize**(direction, amount)
Increases the size of the pane in the specified direction by the specified amount. Squashes panes out of the way as necessary. (See pane.squashIntoLocation)
Note: the decision not to have a 'decreaseAndFillSize' method is intentional. If this behaviour is desired, it can be achieved by using the 'increaseSizeDirectional' method followed by the grid.maxAllPanes method.

###### Arguments
  * **direction** {string} The desired direction, one of up/down/left/right
  * **amount** {integer} The desired amount, must be a whole number.

###### Returns
undefined

###### Side Effects
Changes the pane bounds.
Emits a 'changeBounds' event with the new pane bounds.
Throws if the direction is not one of up/down/left/right
Throws if amount is not an integer.
Throws if direction is horizontal and amount + pane.width is greater than the grid width.
Throws if direction is vertical and amount + pane.height is greater than the grid height.

##### **pane.close**(direction, amount)
Emits the 'close' event. This method is used internally by the grid when a pane is removed from the grid. It should probably not be used on its own, seeing as it does not remove the pane from the grid.

###### Arguments
None

###### Returns
undefined

###### Side Effects
Emits a 'close' event.

## License
MIT
