(function() {
  'use strict';
    var scope, mainService, q, testErrorMessage, testResponseSuccess,testResponseFailure, testItem, testItems, timeout, $httpBackend;
    describe('MainController', function () {
      var vm;
      beforeEach(function () {
        angular.mock.module('dassimFrontendV03');
            inject(function ($rootScope, $controller, $q, $timeout, _mainService_, _$httpBackend_) {
              scope = $rootScope.$new(); // create a scope for DemoCtrl to use
              //services
              mainService = _mainService_;
              q = $q;
              timeout = $timeout;
              $httpBackend = _$httpBackend_;
              // Controller setup
              $controller('MainController', {
                $scope: scope,
                mainService: mainService
              }); // give scope to DemoCtrl
              
            });
      });

      it('should have open in scope', function () {
        expect(scope.date).toBeDefined;
        expect(scope.getStations).toBeDefined;

      });

    });
  
})();
