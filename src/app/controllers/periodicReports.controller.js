/**
 * Created by Samskrithi on 10/12/2016.
 */
 (function() {
  'use strict';

  angular
  .module('dassimFrontendV03')
  .controller('PeriodicReportsController', PeriodicReportsController);

  /** @ngInject */
  function PeriodicReportsController(UtilityService, $scope, $log, $filter, 
    $http, energySummaryPeriodicFactory, onTimeRunningFactory, httpCallsService) {
    var vm = this;
    var energySummaryAvg, energySummaryTot, energySummarygraphLabels, nTrains, graphIndicator;
    var rollingStockSubTitle, serviceCodeSubTitle;
    var decimalPlace = 0;
    vm.periodicEnergySummaryError=false;
    vm.periodicOnTimeError=false;


    var formData = UtilityService.getCheckedItems();

    // var data = JSON.stringify(formData)
    // $log.debug(data)
    $log.debug(formData);
    if(formData){
    if(!formData.rollingStock){
      rollingStockSubTitle = "All"
    }else{
      rollingStockSubTitle = formData.rollingStock;
    }

    if(!formData.serviceCode){
      serviceCodeSubTitle = "All"
    }else{
      serviceCodeSubTitle = formData.serviceCode;
    }
    

    vm.subTitle="<p> From Date : " + formData.periodFromDate + ", To Date : " + formData.periodToDate +
    '</p> <p> Rollingstock : ' + rollingStockSubTitle + ', ServiceCode : ' + serviceCodeSubTitle + "</p>"
}
    vm.promise=httpCallsService.getByParams('periodicEnergySummary', formData)
    .then(function(response){
      vm.getResponse = response.data
      // $log.debug(response)
      if(response.status == 204){
        vm.periodicEnergySummaryError=true;
        vm.periodicEnergySummaryErrorMessage='<h1>'+response.statusText+' </h1> <p>'+ response.statusText + '</p>'
      }else{
        energySummaryTot = [vm.getResponse.actualEnergyConsumption, vm.getResponse.optimalEnergyConsumption, vm.getResponse.onTimeOptimalEnergyConsumption, vm.getResponse.targetEnergyConsumption]
        nTrains = vm.getResponse.numberOfTrains;
        vm.graphIndicator = vm.getResponse.energySummaryAdvice.graphIndicator;
        vm.energySummaryAdvice = vm.getResponse.energySummaryAdvice.energySummaryAdvice;
        energySummaryAvg = [
        $filter('number')(vm.getResponse.actualEnergyConsumption/nTrains, decimalPlace), 
        $filter('number')(vm.getResponse.optimalEnergyConsumption/nTrains, decimalPlace), 
        $filter('number')(vm.getResponse.onTimeOptimalEnergyConsumption/nTrains, decimalPlace), 
        $filter('number')(vm.getResponse.targetEnergyConsumption/nTrains, decimalPlace)]
        // $log.debug(energySummaryAvg)
        energySummarygraphLabels = energySummaryPeriodicFactory.getGraphLabelsPeriodic();
        // $log.debug(vm.energySummarygraphLabels);
        energySummaryPeriodicFactory.getEnergySummaryChart(energySummaryTot, energySummarygraphLabels, vm.graphIndicator);
      }
    }).catch(function(data){
      vm.periodicEnergySummaryError=true;
      vm.periodicEnergySummaryErrorMessage ='<h1>'+ data.status + data.data + '</h1>' + data;
      $log.debug(data)
    })

    vm.promise = httpCallsService.getByParams('periodicOntimeRunningReport', formData)
      .then(function(response){
        vm.response = response.data;
        // $log.debug(vm.response)
        if(response.status == 204){
        vm.periodicOnTimeError=true;
        vm.PeriodicOnTimeErrorMessage='<h1> On-Time Running'+response.statusText+' </h1> <p>'+ response.statusText + '</p>'
      }else{
        vm.dataFunc = onTimeRunningFactory.getOnTimeData(vm.response);
        vm.graphLabels = onTimeRunningFactory.getonTimeGraphLabels(vm.response);
        onTimeRunningFactory.getOnTimeChart(vm.dataFunc, vm.graphLabels);
      }
      }).catch(function(data){
        vm.periodicOnTimeError=true;
         vm.PeriodicOnTimeErrorMessage ='<h1>'+ data.status + data.data + '</h1>' + data;
        $log.debug("controller response: " +data.status)
      })
    
  vm.opened = false;
  vm.open = function() {
    vm.opened = true;
    var title = 'Actual vs Achievable Fuel Consumption (Average per Trip)'
    energySummaryPeriodicFactory.setEnergySummaryChartPeriodic(energySummaryAvg, energySummarygraphLabels, title, nTrains, vm.graphIndicator);
  }
  vm.close = function() {
    vm.opened = false;
    var title = 'Actual vs Achievable Fuel Consumption (Total)'
    energySummaryPeriodicFactory.setEnergySummaryChartPeriodic(energySummaryTot, energySummarygraphLabels, title, nTrains, vm.graphIndicator);
  }


  }
})();
