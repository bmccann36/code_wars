const chai = require('chai')
const expect = chai.expect
const restoreObj = require('../restoreObj')

describe('RESTORE OBJECT', () => {

  it('resets a key back when values differ', () => {
    const originalState = { x: 1, y: 2 }
    const newState = { x: 1, y: 3 }
    const restoredState = restoreObj(newState, originalState)
    expect(restoredState).to.deep.equal(originalState)

  })

  it('deletes prop in new obj when it doesnt exist in old object', () => {
    const originalState = { y: 3 }
    const newState = { x: 1, y: 3 }
    const restoredState = restoreObj(newState, originalState)
    expect(restoredState).to.deep.equal(originalState)

  })

  it('adds prop to newObj when it exists in previous', () => {
    const originalState = { x: 1, y: 3 }
    const newState = { y: 3 }
    const restoredState = restoreObj(newState, originalState)
    expect(restoredState).to.deep.equal(originalState)

  })


})


