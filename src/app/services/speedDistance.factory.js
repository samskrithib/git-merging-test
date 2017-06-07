/** Created by Samskrithi on 18/11/2016. */

(function () {
  'use strict';
  angular
    .module('dassimFrontendV03')
    .factory('speedDistanceChartFactory', speedDistanceChartFactory);
  function speedDistanceChartFactory($log, $window, DRIVE_COLORS, mathUtilsService) {
    var SpeedDistanceChart;
    var formatter, distanceUnits,speedUnits,TooltipTitleformatter;
    var gridOnOff = true;
    function updatexaxisTickFormatter(Mph) {
      distanceUnits = (Mph ? ' Miles': 'm')
      speedUnits = (Mph ? ' Mph': ' Kph')
      formatter = (Mph ? function(num) {return num} :   mathUtilsService.formatNumToSIUnits)
      TooltipTitleformatter = d3.format(Mph ? ',.2f' : '.3s')
    }
    updatexaxisTickFormatter();
    return {
      getSpeedDistanceChart: function (data, graphLabels) {
        SpeedDistanceChart = c3.generate({
          bindto: '#chart2',
          size: {
            height: 400
          },
          data: {
            xs: {
              'ActualDriving': 'actualPosition',
              'FlatoutDriving': 'flatoutPosition',
              'EcoDriving': 'optimalPosition',
              'SpeedLimit': 'endPoint',
              'Elevation': 'scaledPosition'
            },
            names: {
              ActualDriving: 'Actual Driving',
              FlatoutDriving: 'Optimal Driving (Flatout)',
              EcoDriving: 'Optimal Driving (Eco)',
              SpeedLimit: 'Speed Limit'
            },
            columns: [
              data.actualPosition[0],
              data.flatoutPosition[0],
              data.optimalPosition[0],
              data.endPoint[0],
              data.actualDriving[0],
              data.flatoutDriving[0],
              data.ecoDriving[0],
              data.speedLimit[0],
              data.Elevation[0],
              data.scaledPosition[0]
            ],
            axes: {
              Elevation: 'y2'
            },
            xSort: false,
            labels: false,
            colors: {
              'ActualDriving': DRIVE_COLORS.blue_dark,
              'FlatoutDriving': DRIVE_COLORS.green,
              'EcoDriving': DRIVE_COLORS.green,
              'SpeedLimit': DRIVE_COLORS.black,
              'Elevation': DRIVE_COLORS.brown
            }
            
          },
          zoom: {
            enabled: false
          },
          point: {
            show: true,
            r: 0
          },
          grid: {
            y: {
              show: gridOnOff
            },
            x: {
             show : gridOnOff,
           }
          },
          tooltip: {
            format: {
              title: function (d) { return 'Position : ' + TooltipTitleformatter(d) + distanceUnits; },
              value: function (value, ratio, id) {
                var format = d3.format(',.0f');
                var units = id === 'Elevation' ? ' meters' : speedUnits;
                return format(value) + units;
            }
            },

          },
          axis: {
            y: {
              min: 0,
              padding: { bottom: 0 },
              label: {
                text: graphLabels.yAxisLabel,
                position: 'outer-middle'
              }
            },
            y2: {
              max: 80,
              min: -80,
              label: {
                text: "Elevation change (m)",
                position: 'outer-middle'
              },
              show: true
            },
            x: {
              label: {
                text: 'Distance (km)',
                position: 'outer-center',
              },
              height: 50,
              tick: {
                format: function (x) { return formatter(x); },
                fit: false,
                outer: false,
                rotate: 0,
                multiline: false,
                culling: {
                  max: 5
                }
              }
            }
          }
        });
      },
      setSDMarker: function (data) {
        /*var x = ".c3-circle-"+data;
        d3.select('.c3-circles-ActualDriving')
        .select('.c3-circle-50')
        .style('fill', 'red')
        .attr('r', 10)
        .on("mouseover", mouseover)
        
        function mouseover() {
         var self = d3.select('.c3-circles-ActualDriving .c3-circle-50');
         $log.debug(self.attr('cx'));
       }*/
        // $log.debug('tezxt')
      },
      setGridOnOff: function(value){
        if(value == true){
          d3.selectAll('.c3-grid line')
            .style('visibility', 'visible')
        }else{
          d3.selectAll('.c3-grid line')
            .style('visibility', 'hidden')
        }
      },
      setSpeedDistanceChart: function (data, selected) {
        SpeedDistanceChart.unload({
          done: function () {
            SpeedDistanceChart.load({
              columns: [
                data.actualPosition[selected],
                data.flatoutPosition[selected],
                data.optimalPosition[selected],
                data.endPoint[selected],
                data.actualDriving[selected],
                data.flatoutDriving[selected],
                data.ecoDriving[selected],
                data.speedLimit[selected],
                data.Elevation[selected],
                data.scaledPosition[selected]
              ]
            })
          }
        })

        // $log.debug(data.ecoDriving[selected])
        /* var x= ".c3-circle-100"
         d3.select('.c3-circles-ecoDriving .c3-circle-100')
         .style('fill', 'red')
         .attr('r', 10);*/
      },

      setSpeedDistanceKph: function (data, selected) {
        SpeedDistanceChart.axis.labels({
          y: 'Speed (Kph)',
          x: 'Distance (Km)'
        })
        updatexaxisTickFormatter(false)
        // SpeedDistanceChart.axis.range({max: {y2: 150}, min: { y2: -150}})
        SpeedDistanceChart.unload({
          done: function () {
            SpeedDistanceChart.load({
              columns: [
                data.actualPosition[selected],
                data.flatoutPosition[selected],
                data.optimalPosition[selected],
                data.endPoint[selected],
                data.actualDriving[selected],
                data.flatoutDriving[selected],
                data.ecoDriving[selected],
                data.speedLimit[selected],
                data.Elevation[selected],
                data.scaledPosition[selected]
              ]
            })
          }
        })
        // $log.debug("length" + data.ecoDriving[selected].length)
      },
      setSpeedDistanceMph: function (data, selected) {
        SpeedDistanceChart.unload({
          done: function () {
            SpeedDistanceChart.load({
              columns: [
                data.actualPosition[selected],
                data.flatoutPosition[selected],
                data.optimalPosition[selected],
                data.endPoint[selected],
                data.actualDriving[selected],
                data.flatoutDriving[selected],
                data.ecoDriving[selected],
                data.speedLimit[selected],
                data.Elevation[selected],
                data.scaledPosition[selected]
              ]
            })
          }
        })
        updatexaxisTickFormatter(true)
        // $log.debug(data.ecoDriving[selected])
        SpeedDistanceChart.axis.labels({
          y: 'Speed (Mph)',
          x: 'Distance (Miles)'
        })
        // SpeedDistanceChart.axis.range({max: {y2: 80}, min: { y2: -80}})
        // SpeedDistanceChart.axis.tick.format({
        //   x: { function(x) { return (x) } }
        // })

      }

    }
  }
})();

