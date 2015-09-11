'use strict';

describe('Controller: EntradaCtrl', function () {

  // load the controller's module
  beforeEach(module('sgasApp'));

  var EntradaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EntradaCtrl = $controller('EntradaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EntradaCtrl.awesomeThings.length).toBe(3);
  });
});
