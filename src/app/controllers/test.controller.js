/** Created by Samskrithi on 10/27/2016. */
(function () {
  'use strict';

  angular
    .module('dassimFrontendV03')

    .controller('testController', testController);

  function testController(httpCallsService, $scope, $log, UtilityService, testFactory) {
    var vm = this;
    vm.tabs = [
      { id: "0", title: 'LS + Energy Summary' },
      { id: "1", title: 'Lateness Summary' },

    ];

    vm.styleOptions = {"1":"blue","2":"violet","3":"yellow","4":"red"};
    _.each(vm.tabs, function (val, key) {
      switch (vm.tabs[key].id) {
        case "0": {
            vm.promise = httpCallsService.getByJson('assets/driverSingleRunResponse.json')
            .then(function (response) {
              vm.energySummaries = response.energySummaryReportPerJourney.energySummaryPerJourney;
              $log.debug(vm.energySummaries)
              testFactory.getESChart(vm.energySummaries)
            //  vm.chartLinks =  testFactory.getchartlinks(vm.energySummaries)
             $log.debug(vm.chartLinks)
              
            })
          break;
        }
        case "1": {
          vm.promise = httpCallsService.getByJson('assets/lateness_energy.json')
            .then(function (response) {
              vm.response = response;
              testFactory.getTestChart(vm.response)
            })
          break;
        }

        default: {

        }
      }

    });

    vm.linksOnselect = function(link){
      $log.debug(link)
      vm.energySummaryOfLink =  testFactory.getenergySummaryDataOfSelectedLink( vm.energySummaries, link)
      testFactory.setESchart(vm.energySummaryOfLink)
    }


  }
})();
