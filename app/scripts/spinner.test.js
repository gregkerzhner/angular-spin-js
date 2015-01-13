describe('spinner', function(){
  var element, scope, $compile, $contr, $rootScope, $exceptionHandler, $compileProvider;

  beforeEach(module('angular-spinner'));

  beforeEach(inject(function(_$compile_, $controller, _$rootScope_, _$exceptionHandler_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $exceptionHandler = _$exceptionHandler_;
    $contr = $controller;
    scope = $rootScope.$new();
  }));


  it("uses default config if none are provided", function() {   
    controller = $contr('SpinnerController', {'$scope': scope, $element: {}, $attrs: {}})
    expect(scope.backgroundClass).toBe('opaque')
    expect(scope.spinnerOptions.lines).toBe(9)
  });

  it("can take params as attributes", function() {   
    controller = $contr('SpinnerController', {'$scope': scope, $element: {}, $attrs: {spinnerOptions: '{"lines": 1}', backgroundClass: 'foo'}})
    expect(scope.backgroundClass).toBe('foo')
    expect(scope.spinnerOptions.lines).toBe(1)
  });

  it("turns spinners on", function() {   
    controller = $contr('SpinnerController', {'$scope': scope, $element: {}, $attrs: {spinnerOptions: '{"lines": 1}', backgroundClass: 'foo', spinnerName: 'foo'}})
    scope.$digest();
    scope.spinner.start('foo');
    scope.$digest();
    expect(scope.spinnerEl).not.toBe(null)
  });

  it("turns spinners off", function() {   
    controller = $contr('SpinnerController', {'$scope': scope, $element: {}, $attrs: {spinnerOptions: '{"lines": 1}', backgroundClass: 'foo', spinnerName: 'foo'}})
    scope.$digest();
    scope.spinner.start('foo');
    scope.$digest();
    scope.spinner.stop('foo');
    scope.$digest();
    expect(scope.spinnerEl).toBe(null)
  });
})
