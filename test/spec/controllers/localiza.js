'use strict';

describe('Controller: LocalizaCtrl', function () {

  // load the controller's module
  beforeEach(module('sityooApp'));

  var LocalizaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LocalizaCtrl = $controller('LocalizaCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
