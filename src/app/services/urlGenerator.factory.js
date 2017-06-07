/** Created by Samskrithi on 10/14/2016. */

(function () {
  'use strict';
  angular
    .module('dassimFrontendV03')
    .factory('UrlGenerator', function UrlGenerator($filter, $log, UtilityService) {
      var url,viewRunsUrl, subtitle, TTAdherencePercentile, TTAdherenceTrackTrains, dwellTimesUrl;
      var modifiedData = {};
      return {
        generateTrainTimesUrl: function (a, b, c) {
          url = 'viewmyruns/departuretimes?date=' + a + '&origin=' + b + '&destination=' + c;
          return url;
        },

        generateReportsUrl: function (date, time, from, to) {
          var formatdate = $filter('date')(date, 'dd-MM-yyyy')
          // speedDistanceUrl = 'speeddistancegraph?plannedDepDateTime=' + date + ' ' + time + '&originTiploc=' + from.tiploc + '&destinationTiploc=' + to.tiploc;
          subtitle = from.locationName +' to ' + to.locationName + ' at ' + time + ' on ' + formatdate;
          viewRunsUrl = 'driverRuns/single?scheduledDepDateTime='+formatdate+' '+ time + '&originTiploc='+ from.tiploc + '&destinationTiploc=' +to.tiploc
          // viewRunsUrl = 'assets/UnitPerformance_updated.json';
          
          // return viewRunsUrl;
        },
        generateDwellTimesUrl: function(date, time, from, to){
          var formatdate = $filter('date')(date, 'dd-MM-yyyy')
          dwellTimesUrl = 'dwelltimeReports/perJourney?originTiploc='+from.tiploc+'&destinationTiploc='+ to.tiploc+'&scheduledDepDateTime='+ formatdate +' '+ time ;
        },
        getDwellTimesUrl: function(){
          return dwellTimesUrl;
        },
        getData: function () {
          // $log.debug(viewRunsUrl)
          return {
            subtitle: subtitle,
            viewRunsUrl: viewRunsUrl
          }
        },

        generateTTAdherenceUrls: function (data) {
          
          var getTab = UtilityService.getCheckedItems();
          modifiedData.fromStation = data.fromStation;
          modifiedData.toStation = data.toStation;
          modifiedData.fromDate = $filter('date')(data.fromDate, 'yyyy-MM-dd')
          modifiedData.toDate = $filter('date')(data.toDate, 'yyyy-MM-dd')
          modifiedData.fromTime = $filter('date')(data.startTime, 'hh:mm:ss')
          modifiedData.toTime = $filter('date')(data.endTime, 'hh:mm:ss')
          modifiedData.serviceCodes = data.serviceCode.join();
          modifiedData.daysOfTheWeek = data.daysRange.join();
          if (getTab == 'TTPercentile') {
           modifiedData.percentile = data.percentileSelected.split("%")
           modifiedData.percentileSingle = modifiedData.percentile[0];
            // percentile=80
            TTAdherencePercentile = "timetableadherenceaverage?fromTiploc=" + data.fromStation.tiploc + "&toTiploc=" + data.toStation.tiploc + "&fromDate=" + modifiedData.fromDate + "&toDate=" + modifiedData.toDate + "&fromTime=" + modifiedData.fromTime + "&toTime=" + modifiedData.toTime + "&serviceCodes=" + modifiedData.serviceCodes + "&daysOfTheWeek=" + modifiedData.daysOfTheWeek + "&percentile=" + modifiedData.percentile[0]
          }

          TTAdherenceTrackTrains = "timetableadherence?fromTiploc=" + data.fromStation.tiploc + "&toTiploc=" + data.toStation.tiploc + "&fromDate=" + modifiedData.fromDate + "&toDate=" + modifiedData.toDate + "&fromTime=" + modifiedData.fromTime + "&toTime=" + modifiedData.toTime + "&serviceCodes=" + modifiedData.serviceCodes + "&daysOfTheWeek=" + modifiedData.daysOfTheWeek

          
        },

        getTTAdherenceUrl: function () {
          return {
            percentile: TTAdherencePercentile,
            trackTrains: TTAdherenceTrackTrains,
            data: modifiedData
          }
        }

      }
    });
})();
