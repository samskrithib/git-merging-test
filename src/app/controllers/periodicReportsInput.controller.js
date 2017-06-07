/*** Created by Samskrithi on 10/20/2016.*/
(function() {
  'use strict';
  angular
    .module('dassimFrontendV03')
    .controller('PeriodicReportsInputController', PeriodicReportsInputController)
    .config(['$logProvider', function($logProvider){
      $logProvider.debugEnabled(false);
    }])
    .factory('$exceptionHandler', function($log){
      return function (exception, cause){
        $log.debug(exception, cause);
      }
    })

  
  /** @ngInject */
  function PeriodicReportsInputController($scope, $filter, $timeout, $log, $location, $http, httpCallsService, UtilityService) {
    var vm = this;
    var _selectedFrom;
    vm.opened = false;
    vm.open1 = function() {
      vm.popup1.opened = true;
    };
    vm.popup1 = {
      opened: false
    };
    vm.open2 = function() {
      vm.popup2.opened = true;
    };
    vm.popup2 = {
      opened: false
    };
    vm.dateOptions = {
      // dateDisabled: disabled,
      formatYear: 'yy',
      maxDate: new Date(),
      // minDate: new Date(),
      startingDay: 1
    };
    vm.dateOptions2 = {
      // dateDisabled: disabled,
      formatYear: 'yy',
      maxDate: new Date(),
      // minDate: vm.fromDate,
      startingDay: 1
    };

  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }
    vm.state = "LOADING" ;
    vm.statusmessage = "Loading..." ;
    
    vm.getStations = function () {
      httpCallsService.getStations().then(function (data) {
        //console.log(data);
        if (data.length <= 0 ){
          vm.state = "NORESULTS";
          vm.statusmessage = "No results" ;
        }
        else{
          vm.state = "SUCCESS";
          vm.statusmessage = "Enter station name" ;
          vm.stations = data;
        }
      }).catch(function(response){
        vm.state = "NORESULTS";
        vm.statusmessage = "No Results" ;
        $log.debug(/*"controller response: " +*/response);
      });
    };

    vm.stations = [];
    vm.getStations();

    /* date value is obtained here */
    
    
    vm.stationsModel = function(value) {
      if (arguments.length) {
        _selectedFrom = value;
        $scope.fromStat = _selectedFrom.tiploc;
        // $log.debug(_selectedFrom)
      } else {
        return _selectedFrom;
      }
    };
    
  vm.modelOptions = {
      debounce: {
        default: 500,
        blur: 250
      },
      getterSetter: true
    };

    vm.formData = {};
    // vm.formData.rollingStock = '156';
    // vm.formData.serviceCode = '21793000';
    // vm.data = {};
    vm.rollingStockChoices=[];
    vm.serviceCodeChoices=[];
    httpCallsService.getByUrl('rollingstockids')
    .then(function(response){
       vm.rollingStockChoices = response;
       $log.debug(response)
    })
    httpCallsService.getByUrl('servicecodes')
    .then(function(response){
       vm.serviceCodeChoices = response;
    })
   
    

    $scope.periodicSubmit = function (isValid) {
      if(isValid){
      vm.formData.periodFromDate = $filter('date')(vm.formData.periodFromDate, 'yyyy-MM-dd');
      vm.formData.periodToDate = $filter('date')(vm.formData.periodToDate, 'yyyy-MM-dd');
      UtilityService.addCheckedItems(vm.formData)
      // $log.debug(vm.data);
      $location.path("/periodicReports");
    }
    }
  }
})();
