/** Created by Samskrithi on 18/11/2016. */

(function() {
  'use strict';
  angular
  .module('dassimFrontendV03')
  .service('onTimeRunningCompareFactory', onTimeRunningCompareFactory);
  function onTimeRunningCompareFactory($log, $window) {
    var onTimeChart;

    return{
     getOnTimeData : function (response) {
        var actualLateness =  d3.values([(response.actualLatenessPercentages)][0]);
        var actualLateness1 =  d3.values([(response.actualLatenessPercentages1)][0]);
        var optimalLateness = d3.values([(response.optimalLatenessPercentages)][0]);
        var optimalLateness1 = d3.values([(response.optimalLatenessPercentages1)][0]);
        var seriesNames = [
          "Actual Driving Style 1",
          "Actual Driving Style 2",
          "Improved Driving Style 1",  
          "Improved Driving Style 2",  
        ];
         
        actualLateness.splice(0,0, seriesNames[0]);    
        actualLateness1.splice(0,0, seriesNames[1]);    
        optimalLateness.splice(0,0, seriesNames[2]);
        optimalLateness1.splice(0,0, seriesNames[3]);
        return{
          actualLateness: actualLateness,
          actualLateness1: actualLateness1,
          optimalLateness: optimalLateness,
          optimalLateness1: optimalLateness1
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
            "Improved Driving Style"
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
            data.actualLateness1,
            data.optimalLateness,
            data.optimalLateness1
            ],
            type: 'bar',
            groups: [
                ['Actual Driving Style 1', 'Actual Driving Style 2'],
                ['Improved Driving Style 1', 'Improved Driving Style 2']
            ],
         },
         title: {
          text: graphLabels.graphTitle,
          position: 'top-center'
         },

         axis: {
          y : {
              
              tick: {
                format: function(d) { return d + '%'; }
              }
            },
            x: {
              type: 'category',
              categories: graphLabels.xAxisLabels,
              height: 70
              
           }
         },
         bar: {
          width: {
              ratio: 0.5 // this makes bar width 50% of length between ticks
            }
            // or
            //width: 100 // this makes bar width 100px
          },
          grid: {
            y: {
              show:false
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

