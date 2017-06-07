/** Created by Samskrithi on 18/11/2016. */

(function () {
  'use strict';
  angular
    .module('dassimFrontendV03')
    .service('onTimeRunningFactory', onTimeRunningFactory);
  function onTimeRunningFactory($log, $window, c3LegendOnHoverFactory) {
    var onTimeChart;
    return {
      getOnTimeData: function (response) {
        var actualLateness = d3.values([(response.actualLatenessPercentages)][0]);
        var optimalLateness = d3.values([(response.optimalLatenessPercentages)][0]);
        var seriesNames = [
          "Actual Driving Style",
          "Optimal Driving Style"
        ];

        actualLateness.splice(0, 0, seriesNames[0]);
        optimalLateness.splice(0, 0, seriesNames[1]);
        return {
          actualLateness: actualLateness,
          optimalLateness: optimalLateness
        };
      },
      // Labels for on-time running report
      getonTimeGraphLabels: function (data) {
        var graphLabelsAndTitles = {
          "xAxisLabels": d3.keys([(data.actualLatenessPercentages)][0]),
          "yAxisLabel": "%",
          "graphTitle": "Actual vs Achievable On-Time Running",
          "seriesLabels": [
            "Actual Driving Style",
            "Optimal Driving Style"
          ]
        };
        return graphLabelsAndTitles;
      },

      //------------------------Generate OnTimeRunning chart -----------------------------------------//
      getOnTimeChart: function (data, graphLabels) {

        onTimeChart = c3.generate({
          bindto: '#chart1',
          size: {
            height: 400
          },
          data: {
            columns: [
              data.actualLateness,
              data.optimalLateness
            ],
            colors:{
              'Actual Driving Style': '#1f77b4',
              'Optimal Driving Style' : '#2ca02c'

            },
            type: 'bar',
            labels: {
              format: function (v, id, i, j) {
                var screenWidth = $window.innerWidth;
                if (screenWidth < 768) {
                  if (v == 0) {
                    return v + "%";
                  } else { return ""; }
                } else if (screenWidth >= 768) {
                  return v + "%";
                }
              }
            },
            
          },
          title: {
            text: graphLabels.graphTitle,
            position: 'top-center'
          },
          oninit: function () {
            // declare your extra long labels here
            var legendLongLabels = [
              '% of trains arriving in this lateness range',
              '% of trains which could arrive in this lateness range with best practice driving assuming actual departure time from previous station stop'
            ];
            this.legendHoverContent = c3LegendOnHoverFactory.generateLegendHoverLabels.call(this, legendLongLabels);
          },
          legend: c3LegendOnHoverFactory.legend(),
          axis: {
            y: {

              tick: {
                format: function (d) { return d + '%'; }
              }
            },
            x: {
              type: 'category',
              categories: graphLabels.xAxisLabels,
              height: 70

            }
          },
          regions: [
            { axis: 'x', start: 0.5, end: 1.5, class: 'regionX', opacity:0.3 },
          ],
          bar: {
            width: {
              ratio: 0.5 // this makes bar width 50% of length between ticks
            }
            // or
            //width: 100 // this makes bar width 100px
          },
          grid: {
            y: {
              show: false
            }
            /*x: {
             show : true,
           }*/
          }
        });
      }

    }
  }
})();

