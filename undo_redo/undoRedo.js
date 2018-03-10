
function undoRedo(object) {
  let _prevStates = []  // keep track of deletes and sets
  let _undoneStates = [] // keep track of undos
  return {
    set: function (key, value) {
      _prevStates.unshift(Object.assign({}, object)) // clone the object for later reference
      object[key] = value
      _undoneStates = [] // prevent redos after set is called
      return object
    },
    get: function (key) {
      return object[key]
    },
    del: function (key) {
      _prevStates.unshift(Object.assign({}, object))
      delete object[key];
      _undoneStates = []
      return object
    },
    undo: function () {
      if (_prevStates.length == 0) {
        throw new Error('cant undo')
      }
      const restoredState = _prevStates.shift()  // retrieve the most recent state
      _undoneStates.unshift(Object.assign({}, object))  // store current state in case redo is called
      object = restoreObj(object, restoredState) // modify one property on the object ** can't reset the value must modify original
      return object
    },
    redo: function () {
      if (_undoneStates.length == 0) {
        throw new Error('cant redo')
      }
      _prevStates.unshift(Object.assign({}, object))
      const revertedUndo = _undoneStates.shift() // retrieve state from before the previous undo
      object = restoreObj(object, revertedUndo)
      return object
    },
  }
  function restoreObj(currentState, previousState) { // loop through object and change it at the one place where it differs from the state we are
    // trying to restore to. The previousState is used to reference which prop to set / what the value should be
    for (let prop in previousState) {
      if (currentState[prop]) {
        if (currentState[prop] !== previousState[prop]) {
          currentState[prop] = previousState[prop] // should return here to waste uneccesary work
        }
      } else {
        currentState[prop] = previousState[prop] // could return here as well
      }
    }
    for (let prop in currentState) {
      if (!previousState[prop]) {
        delete currentState[prop]
      }
    }
    return currentState;
  }
}


module.exports = undoRedo
