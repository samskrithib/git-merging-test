/*** Created by Samskrithi on 10/20/2016.*/
(function () {
  'use strict';
  angular
    .module('dassimFrontendV03')

    .controller('CompareMyRunsInputController', CompareMyRunsInputController);

  /** @ngInject */
  function CompareMyRunsInputController(UrlGenerator, $scope, $filter, $timeout, $log, $location, httpCallsService, UtilityService) {
    var vm = this;
    var _selectedFrom, _selectedTo, _selectedTime;
    vm.opened = false;
    vm.state = "LOADING";
    vm.statusmessage = "Loading...";
    vm.datePickerPopup = {};
    vm.compareRunsFormdata = [];
    vm.formData = [];
    vm.open = function () {
      vm.datePickerPopup.opened = true
    };
    vm.runslength = 2;
    vm.dateOptions = {
      // dateDisabled: disabled, check https://angular-ui.github.io/bootstrap/#!#datepickerPopup
      formatYear: 'yy',
      maxDate: new Date(),
      minDate: new Date(2015, 1, 1),
      startingDay: 1
    };

    vm.getStations = function () {
      httpCallsService.getStations()
      // httpCallsService.getByJson('assets/locationandTiplocs.json')
      .then(function (data) {
        if (data.length <= 0) {
          vm.state = "NORESULTS";
          vm.statusmessage = "No results";
        }
        else {
          vm.state = "SUCCESS";
          vm.statusmessage = "Enter station name";
          vm.stations = data;
        }
      }).catch(function (response) {
        vm.state = "NORESULTS";
        vm.statusmessage = "No Results";
        $log.debug(/*"controller response: " +*/response);
      });
    };

    vm.stations = [];
    vm.getStations();

    //order station names with leading character on higher rank
    vm.smartOrder = UtilityService.searchBySmartOrder;

    //check if the from-station and to-station inputs are filled
    //call function if both stations are filled and valid
    // $log.debug(vm.date);
    $scope.$watchGroup(['vm.compareRunsFormdata.date', 'vm.originTiploc', 'vm.destinationTiploc'], function (newValues, oldValues) {
      vm.inputDate = $filter('date')(vm.compareRunsFormdata.date, 'yyyy-MM-dd');
      if (newValues != oldValues) {
        if (typeof newValues[0] === 'undefined' || typeof newValues[1] === 'undefined' || typeof newValues[2] === 'undefined') {
          return ''
        } else if (newValues[0] === '' || newValues[1] === '' || newValues[2] === '') {
          $log.debug(" null values" + newValues);
          return ''
        } else {
          $log.debug("newValues" + newValues);
          vm.tstate = "LOADING";
          vm.timePlaceholder = "Loading.."
          vm.url = UrlGenerator.generateTrainTimesUrl(vm.inputDate, vm.originTiploc, vm.destinationTiploc);
          $log.info(vm.url);
          httpCallsService.getByUrl(vm.url)
          // httpCallsService.getByJson("assets/old/times.json")
            .then(function (data) {
              vm.tstate = "SUCCESS";
              vm.compareRunsFormdata.departureTime = '';
              vm.timePlaceholder = "Enter scheduled time of train";
              if (data.length <= 0) {
                vm.tstate = "NORESULTS";
                vm.timePlaceholder = "No results";
                vm.compareRunsFormdata.departureTime = '';
              } else {
                vm.times = $filter('orderBy')(data, data.value);
              }
            }).catch(function (response) {
              vm.tstate = "NORESULTS";
              vm.timePlaceholder = "No results";
              alert(response.status);
              $log.debug("controller response: " + response.status);
            })
        }
      }

    });
    vm.fromStation = function (value) {
      if (arguments.length) {
        _selectedFrom = value;
        vm.compareRunsFormdata.origin = _selectedFrom;
        vm.originTiploc = _selectedFrom.tiploc;
        $log.debug(_selectedFrom)
      } else {
        return _selectedFrom;
      }
    };
    vm.toStation = function (value) {
      if (arguments.length) {
        _selectedTo = value;
        vm.compareRunsFormdata.destination = _selectedTo;
        vm.destinationTiploc = _selectedTo.tiploc
        $log.debug(vm.compareRunsFormdata.destination)
      } else {
        return _selectedTo;
      }
    }
    vm.compareRunsFormdata.departureTime = function (value) {
      if (arguments.length) {
        _selectedTime = value;
        vm.time = _selectedTime;
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

 

  

    vm.submit = function (isValid) {
      if (isValid) {
        UtilityService.addCheckedItems(vm.checkedItems);
        UrlGenerator.generateReportsUrl(vm.inputDate, vm.compareRunsFormdata.departureTime, _selectedFrom, _selectedTo);
        $location.path("/comparemyruns");
      }
    };

    vm.reset = function (form) {
      _selectedTo = ''
      _selectedFrom = ''
      vm.times = []
      vm.compareRunsFormdata.origin = ''
      vm.compareRunsFormdata.destination = ''
      vm.compareRunsFormdata.departureTime = ''
      vm.compareRunsFormdata.date = ''
      vm.allRuns = [];
      vm.tstate = "Loading";
      vm.timePlaceholder = ''
      form.$setUntouched();
      form.$setPristine();
    }


    vm.allRuns = [];

    vm.remove = function(allRuns, index){
      alert("Deleteing row entry.");
      vm.allRuns.splice(index, 1);
    };

    vm.pushDataToArray = function (){
      vm.allRuns.push({
              'date': vm.compareRunsFormdata.date,
              'origin': vm.compareRunsFormdata.origin,
              'destination': vm.compareRunsFormdata.destination,
              'departureTime': vm.compareRunsFormdata.departureTime
            });
            vm.compareRunsFormdata.date = undefined;
            // vm.fromStation = undefined;
            // vm.toStation = undefined;
            vm.compareRunsFormdata.departureTime = undefined;
            vm.tstate = "Loading";
            vm.timePlaceholder = ''
            //  vm.times = undefined;
            form.$setUntouched();
            form.$setPristine();
            // $log.info(vm.allRuns)
    };

    vm.addRun = function (form) {
      if (form) {
        $log.debug(vm.allRuns.length)
        if(vm.allRuns.length <= vm.runslength){
          
          if (vm.allRuns.length == 0) {
            vm.pushDataToArray();
          }else{
            var duplicatedData=false;
            for (var i=0; i<vm.allRuns.length; i++){
              if (  vm.allRuns[i].date.getTime() === vm.compareRunsFormdata.date.getTime() &&
                      vm.allRuns[i].origin === vm.compareRunsFormdata.origin &&
                        vm.allRuns[i].destination === vm.compareRunsFormdata.destination &&
                          vm.allRuns[i].departureTime === vm.compareRunsFormdata.departureTime){
                duplicatedData=true;
                alert("Duplicate Data please enter another run to compare.")
                {break}
              }
            }

            if (duplicatedData == false) {
              vm.pushDataToArray();
            } 
          }        
        } else {
          alert("You can only add 3 input runs.");
        }
        
      }

    };


  }
})();
