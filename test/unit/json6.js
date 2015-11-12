'use strict';
var json6 = require('../../lib/index.js');

describe('json6', function() {
  it("json6('{}') is {}", function() {
    expect(json6('{}')).to.deep.equal({});
  });

  it("json6('[]') is []", function() {
    expect(json6('[]')).to.deep.equal([]);
  });

  it("json6('0') is 0", function() {
    expect(json6('0')).to.deep.equal(0);
  });

  it("json6('asdf') is 'asdf'", function() {
    expect(json6("'asdf'")).to.deep.equal('asdf');
  });

  it("json6('[]') is []", function() {
    expect(json6('[]')).to.deep.equal([]);
  });

  it('parses a complex object', function() {
    var out = json6(
      '{'
    + 'es6: "is",'
    + 'awesome: [1, 2, "three", false, true]'
    + '}');

    expect(out).to.deep.equal({
      es6: 'is',
      awesome: [1, 2, 'three', false, true]
    });
  });
});
