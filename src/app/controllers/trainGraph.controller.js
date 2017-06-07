/** Created by Samskrithi on 10/27/2016. */
(function () {
  'use strict';

  angular
    .module('dassimFrontendV03')
    .controller('TrainGraphController', TrainGraphController);

  function TrainGraphController(httpCallsService, UrlGenerator, $scope, $log, UtilityService, trainGraphFactory,
    timetableAdherencePercentilesFactory) {
    var vm = this;
    vm.TTadherencePercentileError = false;
    vm.TTAdherenceTrackTrainsError = false;
    vm.getTabs = UtilityService.getCheckedItems();
    var subtitle = UrlGenerator.getTTAdherenceUrl().data;
    $log.debug(subtitle)
    vm.subTitle = subtitle.fromStation.locationName + " - " + subtitle.toStation.locationName + 
    "<p>" + subtitle.fromDate + " to " + subtitle.toDate + "</p> " + "<p> DaysRange : " + subtitle.daysOfTheWeek + "</p>"

    // $log.debug(vm.getTabs)
    if (vm.getTabs == 'TTTrackTrains') {
      var TTAdherenceTrackTrainsUrl = UrlGenerator.getTTAdherenceUrl().trackTrains;
      vm.promise = httpCallsService.getByUrl(TTAdherenceTrackTrainsUrl)
        .then(function (response) {
          vm.response = response;
          if (!vm.response) {
            vm.TTAdherenceTrackTrainsError = true;
            vm.TTAdherenceTrackTrainsErrorMessage = response + "<h3> Error Message </h3>"
          } else {
            vm.lines = gridlines(vm.response.timetableAdherenceGraphLocationList);
            trainGraphFactory.getTrainGraphChart(vm.response);
            trainGraphFactory.LoadTrainGraphData(vm.response.timetableAdherenceGraphSeriesList, vm.lines)
          }

        }).catch(function (response) {
          vm.TTAdherenceTrackTrainsError = true;
          vm.TTAdherenceTrackTrainsErrorMessage = response + "<h3> Error Message </h3>"

        })
    }
    if (vm.getTabs == 'TTPercentile') {
      // vm.promise1 = httpCallsService.getByJson('assets/TTAdherencePercentiles.json')
     vm.subTitle += "<p> Percentile Selected : " + subtitle.percentileSingle + "% </p>"
      var percentileUrl = UrlGenerator.getTTAdherenceUrl().percentile;
      // $log.debug(percentileUrl)
      vm.promise1 = httpCallsService.getByUrl(percentileUrl)
        .then(function (response) {
          vm.response = response;
            $log.info(vm.response)
          if (!vm.response) {
            vm.TTadherencePercentileError = true;
            vm.TTadherencePercentileErrorMessage = response + "<h3> Error Message</h3>";
          } 
             vm.TTadherencePercentileError = false;
            vm.lines = gridlines(vm.response.timetableAdherenceGraphLocationList);
            timetableAdherencePercentilesFactory.getTTAdherencePercentileChart(vm.response)
            timetableAdherencePercentilesFactory.LoadTTAdherencePercentileChartData(vm.response.timetableAdherenceGraphSeriesList, vm.lines)
          
        }).catch(function (response) {
          vm.TTadherencePercentileError = true;
          vm.TTadherencePercentileErrorMessage = response + "<h3> Error Message</h3>";

        })
    }


    function gridlines(data) {
      var lines = [];
      _.each(data, function (val, key) {
        var obj = {};
        obj.value = data[key].distance;
        obj.text = data[key].locationName;
        obj.tiploc = data[key].tiploc;
        lines[lines.length] = obj;
      })
      return lines;
    }
    var time = moment().startOf('day').seconds(72270).format('H:mm:ss')
    // $log.debug(time)
    // $log.debug(moment({seconds:'58'}).format("HH:mm:ss"))
    // $log.debug(moment.unix(1318781876).format("h:mm:ss A"))
    // $log.debug(moment([2010, 0, 31, 0, 0, 0]).add(76920).format("h:mm:ss A"))
  }
})();
