'use strict';

describe('Filter: enKm', function () {

  // load the filter's module
  beforeEach(module('sityooApp'));

  // initialize a new instance of the filter before each test
  var enKm;
  beforeEach(inject(function ($filter) {
    enKm = $filter('enKm');
  }));

  it('should return the input prefixed with "enKm filter:"', function () {
    var text = 'angularjs';
    expect(enKm(text)).toBe('enKm filter: ' + text);
  });

});
