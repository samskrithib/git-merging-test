/** Created by Samskrithi on 10/27/2016. */
(function () {
  'use strict';

  angular
    .module('dassimFrontendV03')

    .controller('CompareMyRunsController', CompareMyRunsController);

  function CompareMyRunsController(UrlGenerator, httpCallsService, 
    $scope, $log, energySummaryCompareFactory, latenessSummaryCompareFactory, UtilityService) {
    var vm = this;
    vm.tabs = [
      { id: "0", title: 'Energy Summary' },
      { id: "1", title: 'Lateness Summary' },
      { id: "2", title: 'Speed Distance' },
    ];
    vm.key = false;
    var energySummaryGraphLabels, energySummaryData, energySummaryTotals;
    vm.speedDistanceLinks = {};
    vm.chartSubtitle = UrlGenerator.getData().subtitle;
    vm.promise = httpCallsService.getByJson('assets/driverMultipleRunsResponse.json')
      .then(function (data) {
        vm.response = data;
        vm.error = false;
        _.each(vm.tabs, function (val, key) {
          switch (vm.tabs[key].id) {
            case "0": {
              vm.energySummaries = vm.response.energySummaries;
              // $log.debug(vm.energySummaries);
              // vm.graphIndicator = vm.energySummaries.energySummaryAdvice.graphIndicator;
              energySummaryData = energySummaryCompareFactory.getEnergySummaryData(vm.energySummaries)
              energySummaryTotals = energySummaryCompareFactory.getEnergySummarySumofLinks(energySummaryData);
              energySummaryGraphLabels = energySummaryCompareFactory.getEnergySummaryGraphLabels();
              energySummaryCompareFactory.getEnergySummaryChart(energySummaryTotals, energySummaryGraphLabels, vm.graphIndicators_array);
              $log.debug(energySummaryTotals)
              vm.graphLinks = energySummaryCompareFactory.getEnergySummaryGraphLinks(vm.energySummaries[0].energySummaryLinks);
              break;
            }

            case "1": {
              vm.latenessSummaries = vm.response.latenessSummaries;
              vm.latenessSummaryData = latenessSummaryCompareFactory.getLatenessSummaryData(vm.latenessSummaries)
              vm.latenessSummaryChartLabels = latenessSummaryCompareFactory.getlatenessSummaryChartLabels()
              latenessSummaryCompareFactory.getLatenessSummaryChart(vm.latenessSummaryData, vm.latenessSummaryChartLabels)
              vm.latenessSummaryChartLinks = latenessSummaryCompareFactory.getLatenessSummaryLinks(vm.latenessSummaries[0].latenessSummaries)
              $log.debug(vm.latenessSummaryChartLinks)
              break;
            }
            case "2": {

            }
            default: {
            }
          }
        })
        // end of each function
      }).catch(function (error) {

      })

    vm.getInclude = function (x) {
      if (x == 0) {
        return 'views/EnergySummaryChart.tmpl.html'
      } if (x == 1) {
        return 'views/LatenessSummaryChart.tmpl.html'
      } if (x == 2) {
        return 'views/SpeedDistanceChart.tmpl.html'
      } else return ''

    };

    vm.checkboxModel = function (key) {
      if (!$scope[key]) {
        //do something
        energySummaryCompareFactory.setEnergySummaryChart(energySummaryTotals)
        return;
      }
      //do nothing
    };

    
    vm.links = {};
    vm.energySummaryLinksOnselect = function () {
      // $log.debug(vm.links.selected);
      UtilityService.addCheckedItems(vm.links.selected);
      vm.newenergySummaryData = energySummaryCompareFactory.getenergySummaryLinksData(vm.energySummaries, vm.links.selected);
      vm.newEnergySummaryTotal = energySummaryCompareFactory.getEnergySummarySumofLinks(vm.newenergySummaryData.energySummaryLinksData_array);
      vm.graphIndicators_array = vm.newenergySummaryData.graphIndicators_array;
      // $log.debug(vm.newEnergySummaryTotal);
      energySummaryCompareFactory.setEnergySummaryChart(vm.newEnergySummaryTotal, vm.graphIndicators_array);
    };

    vm.latenessLinks = {}
    vm.latenessSummaryKeyOnChange = function(latenessSummaryKey){
      $log.debug(latenessSummaryKey)
      if (!latenessSummaryKey) {
        //do something
        latenessSummaryCompareFactory.setLatenessSummaryChart(vm.latenessSummaryData)
        return;
      }
    }
    vm.latenessSummaryLinksOnselect = function () {
      // $log.debug(vm.latenessLinks.selected)

      vm.newLatenessSummaryData = latenessSummaryCompareFactory.getLatenessSummaryLinksData( vm.latenessSummaries, vm.latenessLinks.selected)
      latenessSummaryCompareFactory.setLatenessSummaryChart(vm.newLatenessSummaryData)

    }
    

  }
})();
