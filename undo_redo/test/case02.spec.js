const chai = require('chai')
const expect = chai.expect
const undoRedo = require('../undoRedo')


it('adds and removes to undo redo history que as specified', () => {
  obj = { x: 0 }
  const testCase = undoRedo(obj)
  testCase.set('x', 10)
  testCase.set('x', 100)
  testCase.set('x', 150)
  testCase.set('x', 50)
  testCase.undo()
  expect(testCase.get('x')).to.equal(150)
  testCase.undo()
  expect(testCase.get('x')).to.equal(100)
  testCase.redo()
  expect(testCase.get('x')).to.equal(150)
  testCase.redo()
  expect(testCase.get('x')).to.equal(100)

})
