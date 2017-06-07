/** Created by Samskrithi on 18/11/2016. */

(function () {
  'use strict';
  angular
    .module('dassimFrontendV03')
    .service('latenessSummaryCompareFactory', latenessSummaryCompareFactory);
  function latenessSummaryCompareFactory($log, $window, DRIVE_COLORS) {
    var acheivableArrivalLatenessInSeconds, actualArrivalEarlinessInSeconds, actualArrivalLatenessInSeconds;
    var latenessSummary_allLinks;
    var latenessSummaryChart;
    return {
      getLatenessSummaryData: function (latenessSummaries) {
        var acheivableArrivalLatenessInSeconds_array = [],
          actualArrivalEarlinessInSeconds_array = [],
          actualArrivalLatenessInSeconds_array = [],
          latenessSummaryData = {};
        _.each(latenessSummaries, function (val, key) {
          acheivableArrivalLatenessInSeconds = latenessSummaries[key].acheivableArrivalLatenessInSeconds
          actualArrivalEarlinessInSeconds = latenessSummaries[key].actualArrivalEarlinessInSeconds
          actualArrivalLatenessInSeconds = latenessSummaries[key].actualArrivalLatenessInSeconds
          
          acheivableArrivalLatenessInSeconds_array.push(acheivableArrivalLatenessInSeconds)
          actualArrivalEarlinessInSeconds_array.push(actualArrivalEarlinessInSeconds)
          actualArrivalLatenessInSeconds_array.push(actualArrivalLatenessInSeconds)
        })
        latenessSummaryData = {
          'actualArrivalLatenessInSeconds': actualArrivalLatenessInSeconds_array,
          'actualArrivalEarlinessInSeconds': actualArrivalEarlinessInSeconds_array,
          'acheivableArrivalLatenessInSeconds': acheivableArrivalLatenessInSeconds_array,
        }
        return latenessSummaryData;
      },

      getLatenessSummaryLinksData: function (latenessSummaries, links) {
        var indexesOfSelectedLinks = []
        // latnessSummaries for each run
        var arrayOflatenessSummaries_eachRun = _.pluck(latenessSummaries, 'latenessSummaries');

        //find indexes of selected links in all LatenessSummaryLinks array
        _.each(links, function (val, key) {
          indexesOfSelectedLinks.push(_.indexOf(latenessSummary_allLinks, links[key]));
        })
        var array = []
        _.each(arrayOflatenessSummaries_eachRun, function (val_1, key_1) {
          _.each(indexesOfSelectedLinks, function (val_2, key_2) {
            array.push(arrayOflatenessSummaries_eachRun[key_1][val_2].latenessSummary)
          })
        })
        return array;
      },

      getLatenessSummaryLinks: function (latenessSummaries) {
        latenessSummary_allLinks = _.pluck(latenessSummaries, 'link');
        return (_.pluck(latenessSummaries, 'link'));
      },

      // Labels for lateness summary report
      getlatenessSummaryChartLabels: function (data) {
        var graphLabelsAndTitles = {
          "xAxisLabels": "",
          "yAxisLabel": "Lateness (seconds)",
          //   "graphTitle": "Actual vs Achievable On-Time Running",

        };
        return graphLabelsAndTitles;
      },

      //------------------------Generate OnTimeRunning chart -----------------------------------------//
      getLatenessSummaryChart: function (data, graphLabels) {
        latenessSummaryChart = c3.generate({
          bindto: '#chart1',
          size: {
            height: 400
          },
          data: {
            json: data,
            type: 'bar',
            labels: true,
            colors: {
              'actualArrivalEarlinessInSeconds': DRIVE_COLORS.blue,
              'acheivableArrivalLatenessInSeconds': DRIVE_COLORS.green
            }
          },
          axis: {

            y: {
              //min: 0,
              label: {
                text: graphLabels.yAxisLabel,
                position: 'outer-middle'
              },
              padding: {
                top: 100
              }
            }
          },
          bar: {
            width: {
              ratio: 0.3 // this makes bar width 50% of length between ticks
            }

          },

        });
      },

      setLatenessSummaryChart: function (data) {
        latenessSummaryChart.load({
          json: data,
          keys: {
            value: ['actualArrivalLatenessInSeconds', 'actualArrivalEarlinessInSeconds', 'acheivableArrivalLatenessInSeconds'],
          }
        })
      }

    }
  }
})();

