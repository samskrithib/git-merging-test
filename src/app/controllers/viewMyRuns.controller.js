/** Created by Samskrithi on 10/27/2016. */
(function () {
  'use strict';

  angular
    .module('dassimFrontendV03')
    .factory('$exceptionHandler', function ($log) {
      return function (exception, cause) {
        $log.debug(exception, cause);
      }
    })
    .controller('ViewMyRunsController', ViewMyRunsController);

  function ViewMyRunsController($scope, $log, UrlGenerator, httpCallsService, unitPerformanceScoreFactory,
    energySummaryFactory, latenessSummaryFactory, speedDistanceDataFactory, speedDistanceChartFactory, UtilityService) {
    var vm = this;
    vm.tabs = [];
    //Color code for links displayed in dropdown list
    vm.getLinkClass = function (link) {
      if (link.linkPerformanceIndicator == "POOR") {
        return "POOR"
      } else if (link.linkPerformanceIndicator == "AVERAGE") {
        return "AVERAGE"
      } else if (link.linkPerformanceIndicator == "GOOD") {
        return "GOOD"
      }

    };
    UtilityService.addTab('Unit Performance', '0')
    UtilityService.addTab('Energy & Lateness Summary', '1')
    UtilityService.addTab('Speed Distance', '2')
    vm.tabs = UtilityService.getTab();
    var viewRunsUrl = UrlGenerator.getData().viewRunsUrl;
    $log.info("url " + viewRunsUrl)
    vm.promise = httpCallsService.getByUrl(viewRunsUrl)
      // vm.promise = httpCallsService.getByJson(viewRunsUrl)
      .then(function (response) {
        vm.response = response;
        vm.trainIdentifiers = vm.response.trainIdentifier
        $log.info(vm.response)
        vm.chartSubtitle = UrlGenerator.getData().subtitle
          + '<div>' +
          vm.trainIdentifiers.unitNumber
          + '<span ng-show=' + vm.trainIdentifiers.headcode + '> - ' + vm.trainIdentifiers.headcode + ' </span >'
          + ' </div>';
        _.each(vm.tabs, function (val, key) {
          switch (vm.tabs[key].id) {
            case "0": {
              vm.unitPerformanceScores = vm.response.trainUnitPerformancePerJourney;
              vm.trainUnitPerformancePerLinks_allRuns = [vm.unitPerformanceScores.trainUnitPerformancePerLink]
              vm.stationToStationLinks = _.pluck(vm.unitPerformanceScores.trainUnitPerformancePerLink, 'link')
              vm.unitPerformanceScoreChartLabels = unitPerformanceScoreFactory.getUnitPerformanceScoreChartLabels();
              vm.chartIndicators = [vm.unitPerformanceScores.journeyPerformanceIndicator]
              vm.energyPerformanceIndicators = [vm.unitPerformanceScores.energyPerformanceIndicator]
              vm.latenessPerformanceIndicators = [vm.unitPerformanceScores.runtimePerformanceIndicator]
              vm.trainUnitPerformancePerJourneyMessage = vm.unitPerformanceScores.message
              unitPerformanceScoreFactory.getUnitPerformanceScoreChart([vm.unitPerformanceScores], vm.chartIndicators, vm.unitPerformanceScoreChartLabels)
              break;
            }
            case "2": {
              vm.speedDistanceLinks_allRuns = [vm.response.speedDistanceReportPerJourney.speedDistanceReports]
              vm.speedDistanceChartLabels = speedDistanceDataFactory.getSpeedDistanceGraphLabels();
              speedDistanceData_All(vm.speedDistanceLinks_allRuns[0])
              vm.speedDistanceData_Kph = speedDistanceDataFactory.getSpeedDistanceData_Kph();
              vm.speedDistanceData_Mph = speedDistanceDataFactory.getSpeedDistanceData_Mph();

              break;
            }
            case "1": {
              //energy Summary
              vm.energySummaries = vm.response.energySummaryReportPerJourney
              vm.totalEnergySummaries = [vm.energySummaries.energySummaryPerJourney]
              vm.energySummaryChartLabels = energySummaryFactory.getEnergySummaryGraphLabels();
              energySummaryFactory.getEnergySummaryChart(vm.totalEnergySummaries, vm.energySummaryChartLabels, vm.energyPerformanceIndicators)
              vm.energySummaryLinks_allRuns = [vm.energySummaries.energySummaryLinks]

              // Lateness Summary
              vm.latenessSummaries = vm.response.latenessSummaryReportPerJourney
              vm.totalLatenessSummaries = [vm.latenessSummaries.latenessSummaryPerJourney]
              vm.avglatenessSummaryChartLabels = latenessSummaryFactory.getavgLatenessSummaryChartLabels();
              vm.latenessSummaryChartLabelsPerLink = latenessSummaryFactory.getLatenessSummaryChartLabels();
              latenessSummaryFactory.getLatenessSummaryChart(vm.totalLatenessSummaries, vm.avglatenessSummaryChartLabels, vm.latenessPerformanceIndicators)
              vm.latenessSummaryLinks_allRuns = [vm.latenessSummaries.latenessSummaries]
              break;
            }
            default: {
              break;
            }
          }

        })
      }).catch(function (error) {

      })

    function speedDistanceData_All(data) {
      speedDistanceDataFactory.getSpeedDistanceLinks(data)
      speedDistanceDataFactory.getActualSpeedDistance(data);
      speedDistanceDataFactory.getFlatoutSpeedDistance(data);
      speedDistanceDataFactory.getOptimalSpeedDistance(data);
      speedDistanceDataFactory.getElevation(data)
      speedDistanceDataFactory.getSpeedLimits(data)
      vm.getDriverAdvice = speedDistanceDataFactory.getDriverAdvice(data)
    };

    vm.linkOnselect = function (selectedLink) {
      if (selectedLink) {
        vm.arrayOfSelectedLinksPerformanceIndicators = []
        vm.arrayOfSelectedLinksEnergyPerformanceIndicators = []
        vm.arrayOfSelectedLinksRuntimePerformanceIndicators = []
        //find index of links 
        _.each(vm.stationToStationLinks, function (val, key) {
          if (vm.stationToStationLinks[key].stations == selectedLink) {
            vm.indexOfSelectedLink = key
            return vm.indexOfSelectedLink;
          }
        })
        $log.info(vm.indexOfSelectedLink)
        // vm.indexOfSelectedLink = _.indexOf(vm.unitPerformanceScores.trainUnitPerformancePerLink, selectedLink)
        unitPerformanceScoreOnSelectLink();
        energySummaryOnSelectLink();
        latenessSummaryOnSelectLink();
        speedDistanceOnselectLink();
      } else {
        unitPerformanceScoreFactory.setUnitPerformanceScoreChart([vm.unitPerformanceScores], vm.chartIndicators)
        energySummaryFactory.setEnergySummaryChart(vm.totalEnergySummaries, vm.energyPerformanceIndicators)
        latenessSummaryFactory.setLatenessSummaryChart(vm.totalLatenessSummaries, vm.avglatenessSummaryChartLabels, vm.latenessPerformanceIndicators)
      }

    };

    function unitPerformanceScoreOnSelectLink() {
      vm.arrayOfSelectedLinksUnitPerformanceScore = []
      vm.arrayOfSelectedLinksPerformanceMessage = []

      _.each(vm.trainUnitPerformancePerLinks_allRuns, function (val, key) {
        vm.arrayOfSelectedLinksUnitPerformanceScore.push(vm.trainUnitPerformancePerLinks_allRuns[key][vm.indexOfSelectedLink])
        vm.arrayOfSelectedLinksPerformanceIndicators.push(vm.trainUnitPerformancePerLinks_allRuns[key][vm.indexOfSelectedLink].linkPerformanceIndicator)
        vm.arrayOfSelectedLinksEnergyPerformanceIndicators.push(vm.trainUnitPerformancePerLinks_allRuns[key][vm.indexOfSelectedLink].energyPerformanceIndicator)
        vm.arrayOfSelectedLinksRuntimePerformanceIndicators.push(vm.trainUnitPerformancePerLinks_allRuns[key][vm.indexOfSelectedLink].runtimePerformanceIndicator)
        vm.arrayOfSelectedLinksPerformanceMessage.push(vm.trainUnitPerformancePerLinks_allRuns[key][vm.indexOfSelectedLink].message)
      })
      unitPerformanceMessage()
      unitPerformanceScoreFactory.setUnitPerformanceScoreChart(vm.arrayOfSelectedLinksUnitPerformanceScore, vm.arrayOfSelectedLinksPerformanceIndicators)
    }

    function unitPerformanceMessage() {
      vm.performanceMessage = vm.arrayOfSelectedLinksPerformanceMessage[0]
      // $log.info(vm.performanceMessage)
    }
    function energySummaryOnSelectLink() {
      vm.arrayOfSelectedLinksEnergySummary = []
      _.each(vm.energySummaryLinks_allRuns, function (val, key) {
        vm.arrayOfSelectedLinksEnergySummary.push(vm.energySummaryLinks_allRuns[key][vm.indexOfSelectedLink].energySummary)
      })
      // $log.info(vm.arrayOfSelectedLinksEnergyPerformanceIndicators)
      energySummaryFactory.setEnergySummaryChart(vm.arrayOfSelectedLinksEnergySummary, vm.arrayOfSelectedLinksEnergyPerformanceIndicators)
    }

    function latenessSummaryOnSelectLink() {
      vm.arrayOfSelectedLinksLatenessSummary = []
      _.each(vm.latenessSummaryLinks_allRuns, function (val, key) {
        vm.arrayOfSelectedLinksLatenessSummary.push(vm.latenessSummaryLinks_allRuns[key][vm.indexOfSelectedLink].latenessSummary)
      })
      latenessSummaryFactory.setLatenessSummaryChart(vm.arrayOfSelectedLinksLatenessSummary, vm.latenessSummaryChartLabelsPerLink, vm.arrayOfSelectedLinksRuntimePerformanceIndicators)
    }

    function speedDistanceOnselectLink() {
      speedDistanceDriverAdviceOfSelectedLink();
      speedDistanceChartFactory.getSpeedDistanceChart(vm.speedDistanceData_Kph, vm.speedDistanceChartLabels);
      if (vm.radioModel === 'Kph') {
        speedDistanceChartFactory.setSpeedDistanceChart(vm.speedDistanceData_Kph, vm.indexOfSelectedLink)
      } else if (vm.radioModel === 'Mph') {
        speedDistanceChartFactory.setSpeedDistanceChart(vm.speedDistanceData_Mph, vm.indexOfSelectedLink)
      }
    }
    function speedDistanceDriverAdviceOfSelectedLink() {
      vm.runtimeDescription = vm.getDriverAdvice[vm.indexOfSelectedLink].runtimeDescription
      vm.earlyDepartureAdvice = vm.getDriverAdvice[vm.indexOfSelectedLink].earlyDepartureAdvice
      vm.earlyArrivalAdvice = vm.getDriverAdvice[vm.indexOfSelectedLink].earlyArrivalAdvice
      vm.timeSavedAdvice = vm.getDriverAdvice[vm.indexOfSelectedLink].timeSavedAdvice
      vm.energyAdvice = vm.getDriverAdvice[vm.indexOfSelectedLink].energyAdvice
      vm.goodDrivingAdvice = vm.getDriverAdvice[vm.indexOfSelectedLink].goodDrivingAdvice
      vm.spareTimeAdvice = vm.getDriverAdvice[vm.indexOfSelectedLink].spareTimeAdvice
      vm.speedingAdvice = vm.getDriverAdvice[vm.indexOfSelectedLink].speedingAdvice
    }

    vm.radioModel = 'Kph';
    $scope.$watch('vm.radioModel', function (newValue, oldValue) {
      if (newValue !== oldValue) {
        if (newValue == 'Kph') {
          speedDistanceChartFactory.setSpeedDistanceKph(vm.speedDistanceData_Kph, vm.indexOfSelectedLink)
        } else {
          speedDistanceChartFactory.setSpeedDistanceMph(vm.speedDistanceData_Mph, vm.indexOfSelectedLink)
        }
      }
    })

    vm.gridOnOff = true;
    vm.gridbtnOnChange = function (btn) {
      speedDistanceChartFactory.setGridOnOff(btn)
    }

  }
})();
