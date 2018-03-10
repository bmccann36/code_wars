const chai = require('chai')
const assert = chai.assert
const expect = chai.expect
const undoRedo = require('../undoRedo')

describe.only('UNDO REDO FUNCTIONS', function () {

  it('get/set ', function () {
    var obj = { x: 1, y: 2 };
    var unRe = undoRedo(obj);
    assert(unRe.get('x') === 1, 'The get method returns the value of a key');
    unRe.set('x', 3);
    assert(unRe.get('x') === 3, 'The set method change the value of a key');
  });
  // undo() Undo the last operation (set or del) on the object. Throws an exception if there is lyno operation to undo.
  it('simple undo', function () {
    let errorMessage
    var obj = { x: 1, y: 2 };
    var unRe = undoRedo(obj);
    unRe.set('y', 10);
    assert(unRe.get('y') === 10, 'y is set to ten');
    unRe.undo();
    expect(unRe.get('y')).to.equal(2)
    try {
      unRe.undo()
      expect(unRe.get('y')).to.equal(2)
    } catch (e) {
      errorMessage = e
    }
    expect(errorMessage).to.exist
  });

  it('simple redo', function () {
    var obj = {
      x: 1,
      y: 2
    };

    var unRe = undoRedo(obj);
    unRe.set('y', 10);
    assert(unRe.get('y') === 10, 'The get method returns the value of a key');
    unRe.undo();
    assert(unRe.get('y') === 2, 'The undo method restores the previous state');
    unRe.redo();
    assert(unRe.get('y') === 10, 'The redo method restores the previous state');
    try {
      unRe.redo();
      expect(false, 'It should have thrown an exception');
    } catch (e) {
      assert(unRe.get('y') === 10, 'the value is not effected by redo attempt');
    }

  });

  it('undo/redo', function () {
    var obj = { x: 1, y: 2 };

    var unRe = undoRedo(obj);
    unRe.set('y', 10);
    unRe.set('y', 100);
    unRe.set('x', 150);
    unRe.set('x', 50);
    assert(unRe.get('y') === 100, 'The get method returns the value of a key');
    assert(unRe.get('x') === 50, 'The get method returns the value of a key');

    unRe.undo(); // set x back to what is was
    // x was 50 now is 150

    assert(unRe.get('x') === 150, 'The undo method restores the previous state');
    assert(unRe.get('y') === 100, 'The y key stays the same');

    unRe.redo(); // set x back to what is was before 1st undo
    // PUSH THAT STATE BACK INTO PREV STATES
    // x was 150 no make it 50 again


    assert(unRe.get('x') === 50, 'Undo the x value');
    assert(unRe.get('y') === 100, 'The y key stays the same');
    // now we're back where we were before undo or redo
    unRe.undo(); //2nd time we call it
    // x=150 y=100
    unRe.undo(); //3rd time
    // undo the set of x to 150
    // x goes back to x = 1 y was changed time before
    // so y still = 100

    assert(unRe.get('x') === 1, 'Undo the x value');

    expect(unRe.get('y')).to.equal(100) // re write**

    // assert(unRe.get('y') === 100, 'The y key stays the same');


    unRe.undo();
    unRe.undo();
    assert(unRe.get('y') === 2, 'Undo the y value');
    assert(unRe.get('x') === 1, 'The x key stays the same');
    try {
      unRe.undo();
      expect(false, 'It should have thrown an exception');

    } catch (e) {
      // console.log(e)
      assert(unRe.get('y') === 2, 'There is nothing to undo');
    }

    unRe.redo(); // 2nd time
    unRe.redo();
    unRe.redo();
    unRe.redo();
    // Test.assertEquals(unRe.get('y'), 100, 'y key redo state');
    expect(unRe.get('y')).to.equal(100)
    assert(unRe.get('x') === 50, 'y key redo state');
    try {
      unRe.redo();
      expect(false, 'It should have thrown an exception');

    } catch (e) {
      assert(unRe.get('y') === 100, 'There is nothing to redo');
    }
  })


  it('new key', function () {
    var obj = {
      x: 1,
      y: 2
    };

    var unRe = undoRedo(obj);
    unRe.set('z', 10);
    assert(unRe.get('z') === 10, 'A new key has been added');
    unRe.undo();
    assert(unRe.get('z') === undefined, 'The z key should not exist');
    unRe.redo();
    assert(unRe.get('z') === 10, 'A new key has been added');
  });


  it('delete key', function () {
    var obj = {
      x: 1,
      y: 2
    };

    var unRe = undoRedo(obj);
    unRe.del('x');
    assert(unRe.get('x') === undefined, 'The x key should not exist');
    expect(!obj.hasOwnProperty('x'), 'The x key should be deleted');
    unRe.undo();
    assert(unRe.get('x') === 1, 'A new key has been added');
    unRe.redo();
    assert(unRe.get('x') === undefined, 'The x key should not exist');
    expect(!obj.hasOwnProperty('x'), 'The x key should be deleted');
  });


});
