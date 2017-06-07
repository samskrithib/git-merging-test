/*** Created by Samskrithi on 10/20/2016.*/
(function() {
  'use strict';
  angular
  .module('dassimFrontendV03')
  .controller('ViewMyRunsInputController', ViewMyRunsInputController);
  
  /** @ngInject */
  function ViewMyRunsInputController(UrlGenerator, $scope, $filter, $timeout, $log, $location, typeaheadService, httpCallsService, UtilityService) {
    var vm = this;
    var _selectedFrom,_selectedTo,_selectedTime;
    vm.opened = false;
    vm.state = "LOADING" ;
    vm.statusmessage = "Loading..." ;
    vm.dpOpenStatus = {};
    var master = {};
    vm.input ={};

    vm.setDpOpenStatus = function(id) {
      vm.dpOpenStatus[id] = true
    };
    vm.getStations = function () {
      httpCallsService.getStations()
      // httpCallsService.getByJson('assets/locationandTiplocs.json')
      .then(function (data) {
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
    
    //order station names with leading character on higher rank
    vm.smartOrder = function (obj) {
      var queryObj = typeaheadService.getQueryObject(),
      key = Object.keys(queryObj)[0],
      query = queryObj[key];
      if (obj[key].toLowerCase().indexOf(query.toLowerCase()) === 0) {
        return ('a' + obj[key]);
      }
      return ('b' + obj[key]);
    };
    
    
    // to convert the time format
    function toTime(timeString){
      var timeTokens = timeString.split(':');
      return new Date(null,null,null, timeTokens[0], timeTokens[1]);
    }

    
    
    //check if the from-station and to-station inputs are filled
    //call function if both stations are filled and valid
    // $log.debug(vm.date);
    $scope.$watchGroup(['vm.input.date','vm.fromStat', 'vm.toStat'], function (newValues, oldValues) {
      vm.inputDate = $filter('date')(vm.input.date, 'yyyy-MM-dd');
      // var result = [];
      // $log.debug('inputDate,fromStat, toStat are changed');
      
        if (newValues != oldValues) {
          if(typeof newValues[0] === 'undefined' || typeof newValues[1] === 'undefined' || typeof newValues[2] === 'undefined'){
            return ''
          }else if(newValues[0] === '' || newValues[1] === '' ||  newValues[2] === ''){
            return ''
          }else{
            // $log.debug(newValues);
            vm.tstate = "LOADING";
            vm.timePlaceholder = "Loading.."
            vm.url = UrlGenerator.generateTrainTimesUrl(vm.inputDate, vm.fromStat, vm.toStat);
            httpCallsService.getByUrl(vm.url)
            // httpCallsService.getByJson("assets/old/times.json")
            .then(function (data) {
              vm.tstate = "SUCCESS";
              vm.customTimeSelected = '';
              vm.timePlaceholder = "Enter scheduled time of train";
              if(data.length <= 0){
                vm.tstate="NORESULTS";
                vm.timePlaceholder = "No results";
                vm.customTimeSelected = '';
              }else{
                vm.times = $filter('orderBy')(data, data.value);
              }
            }).catch(function(response) {
              vm.tstate="NORESULTS";
              vm.timePlaceholder = "No results";
              alert(response.status);
              $log.debug("controller response: " + response.status);
            })
          }
      }

    });
    vm.fromStation = function(value) {
      if (arguments.length) {
        _selectedFrom = value;
        vm.fromStat = _selectedFrom.tiploc;
        // $log.debug(_selectedFrom)
      } else {
        return _selectedFrom;
      }
    };
    vm.toStation = function (value) {
      if (arguments.length) {
        _selectedTo = value;
        vm.toStat = _selectedTo.tiploc;
        // $log.debug( vm.toStat)
      } else {
        return _selectedTo;
      }
    }
    vm.customTimeSelected = function (value) {
      if (arguments.length) {
        _selectedTime = value;
        vm.time = _selectedTime;
        // $log.debug( _selectedTime)
      } else {
        return _selectedTime;
      }
    }
    vm.modelOptions = {
      debounce: {
        default: 500,
        blur: 250
      },
      getterSetter: true
    };


    vm.formData = {};

    vm.itemsList =[
    { name:'Unit performance' , id: '0'},
    { name:'Energy & Lateness Summary', id: '1'},
    { name:'Speed Distance', id: '2'}];
    vm.checkedItems=["0", "1", "2"];
    vm.formData.selectedItems = [];
    vm.someSelected = function (object) {
      return Object.keys(object).some(function (key) {
        //$log.debug(object[key])
        return object[key];
      });
    };
    
    UtilityService.clearTab();
 
    vm.submit = function(isValid){
      if(isValid){
        UtilityService.addCheckedItems(vm.checkedItems);
        $log.debug(_selectedFrom, _selectedTo)
        UrlGenerator.generateReportsUrl(vm.inputDate, vm.customTimeSelected, _selectedFrom, _selectedTo);
        $location.path("/view-my-runs");
      }
    };
    vm.goToView = function(){
      $location.path("/view")
    };
    vm.reset = function(form){
      vm.input = angular.copy(master)
      _selectedTo = ''
      _selectedFrom = ''
      vm.times = []
      vm.fromStat=''
      vm.toStat=''
      vm.customTimeSelected = ''
      vm.tstate = "Loading";
      vm.timePlaceholder=''
      form.$setUntouched();
      form.$setPristine();
    }

    vm.periodicSubmit = function () {
      $location.path("/reports");
    }
  }
})();
