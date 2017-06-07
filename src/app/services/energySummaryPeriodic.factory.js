/** Created by Samskrithi on 18/11/2016. */

(function () {
  'use strict';
  angular
    .module('dassimFrontendV03')
    .factory('energySummaryPeriodicFactory', energySummaryPeriodicFactory)
    .factory('energySummaryBarColors', energySummaryBarColors)
  function energySummaryBarColors(DRIVE_COLORS, $log) {
    return {
      barColors_JsonInput: function (graphIndicator) {
        return {
          'actualEnergyConsumption': function(color,d) {
             return DRIVE_COLORS.blue_dark;
          },
          'optimalEnergyConsumption': function(d){
            return DRIVE_COLORS.green
          },
          'onTimeOptimalEnergyConsumption': function(d){
            return DRIVE_COLORS.green_light
          }
        }
      },
      barColors: function (graphIndicator) {
        return {
          'Fuel': function (d) {
            // $log.debug(d)
            switch (d.x) {
              case 0: {
                if (graphIndicator === 'GOODDRIVING') {
                  return DRIVE_COLORS.green;
                } else if (graphIndicator === 'AVERAGEDRIVING') {
                  return DRIVE_COLORS.orange;
                } else if (graphIndicator === 'POORDRIVING') {
                  return DRIVE_COLORS.red;
                } else {
                  return DRIVE_COLORS.blue_dark;
                }
                break;
              }
              case 1: {
                return DRIVE_COLORS.green;
                break;
              }
              case 2: {
                return DRIVE_COLORS.green_light;
                // return d3.rgb(green).darker(d.value / 150);
                break;
              }
              default: {
                return DRIVE_COLORS.green;
                break;
              }
            }
          }
        }
      }
    }
  }
  function energySummaryPeriodicFactory($log, $window, $filter, energySummaryBarColors) {
    var actualEnergyTotal, optimalEnergyTotal, onTimeOptimalEnergyTotal, targetEnergyTotal;
    var energySummaryLinks = [];
    var EnergySummaryChart;
    return {
      getEnergySummaryData: function (data) {
        return _.pluck(data, 'energySummary');
      },
      // Data to generate Total or Sum of selected links Energy summary report
      getEnergySummarySumofLinks: function (bar) {
        // _.reduce sums up all the values and adds to memo
        actualEnergyTotal = $filter('number')(_.reduce(bar, function (memo, num) { return memo + num.actualEnergyConsumption; }, 0), 2);
        optimalEnergyTotal = $filter('number')(_.reduce(bar, function (memo, num) { return memo + num.optimalEnergyConsumption; }, 0), 2);
        onTimeOptimalEnergyTotal = $filter('number')(_.reduce(bar, function (memo, num) { return memo + num.onTimeOptimalEnergyConsumption; }, 0), 2);
        targetEnergyTotal = $filter('number')(_.reduce(bar, function (memo, num) { return memo + num.targetEnergyConsumption; }, 0), 2);
        energySummaryLinks = [actualEnergyTotal, optimalEnergyTotal, onTimeOptimalEnergyTotal, targetEnergyTotal];
        return energySummaryLinks;
      },
      /// Data for view specific links in Energy summary report
      getEnergySummarylinksData: function (data, links) {
        var arr = [];
        var indexes = [];
        var foo = _.pluck(data, 'link');
        _.each(links, function (val, key) {
          indexes.push(_.indexOf(foo, links[key]));
        });
        // $log.debug(indexes);
        _.each(indexes, function (val, key) {
          arr.push(data[indexes[key]].energySummary);
        });
        $log.debug(arr);
        return arr;
      },

      getEnergySummaryGraphLinks: function (data) {
        return (_.pluck(data, 'link'));
      },

      //------------------------------Graph Labels --------------------------------------------------//
      getEnergySummaryGraphLabels: function () {
        var graphLabelsAndTitles = {
          "xAxisLabels": [
            "Actual Driving & Actual Time",
            "Eco Driving & Actual Time (Achievable)",
            "Eco Driving & On-Time Running (Optimum)"
          ],
          "yAxisLabel": "Fuel (litres)",
          "graphTitle": "Actual vs Achievable Fuel Consumption",
          "seriesLabels": null
        }
        return graphLabelsAndTitles;
      },
      getGraphLabelsPeriodic: function () {
        var graphLabelsAndTitles = {
          "xAxisLabels": [
            "Actual",
            "Optimised Achievable",
            "Optimised With On-Time Departure"
          ],
          "yAxisLabel": "Fuel (litres)",
          "graphTitle": "Actual vs Achievable Fuel Consumption (Total)",
          "seriesLabels": null
        }
        return graphLabelsAndTitles;
      },
      //------------------------------Generate c3 chart----------------------------------------------//
      getEnergySummaryChart: function (energySummary, graphLabels, graphIndicator) {
        EnergySummaryChart = c3.generate({
          bindto: '#chart0',
          size: {
            height: 350
          },
          data: {
            columns: [
              ['Fuel', energySummary[0], energySummary[1], energySummary[2]]
            ],
            type: 'bar',
            labels: true,
            colors: energySummaryBarColors.barColors(graphIndicator)
          },
          title: {
            text: graphLabels.graphTitle
          },

          legend: {
            show: false,
            position: 'inset',
            inset: {
              anchor: 'top-right',
              x: 20,
              y: 10,
              step: 2
            }

          },
          axis: {
            x: {
              type: 'category',
              categories: graphLabels.xAxisLabels,
              height: 50
            },
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
              ratio: 0.3 // this makes bar width 30% of length between ticks
            }
          },
          tooltip: {
            contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
              var text;
              if (d[0].x == 0) {
                // Use default rendering
                text = "<div class='panel panel-info'>"
                text += "<div class='panel-body'>"
                text += "Actual fuel consumption"
                text += "</div></div>"
                return text;
              } else if (d[0].x == 1) {
                text = "<div class='panel panel-info'>"
                text += "<div class='panel-body'>"
                text += "Eco-Driving fuel consumption<br> possible, "
                text += "assuming actual departure time,<br> or on-time if departing early,<br> and arriving as close to on-time as possible";
                text += "<br>at next station stop"
                text += "</div></div>"
                return text;
              } else {
                text = "<div class='panel panel-info'>"
                text += "<div class='panel-body'>"
                text += "Ecodriving fuel consumption possible<br>"
                text += " for on-time departure and on-time arrival<br> at next station stop"
                text += "</div></div>"
                return text;
              }
            },
          },
          grid: {
            lines: {
              front: true
            },
            y: {
              lines: [
                { value: energySummary[3], text: 'Energy Target ' + energySummary[3], position: 'end' }
              ]
            }
          }
        });
      },

      setEnergySummaryChart: function (dataColumns, graphIndicator) {
        EnergySummaryChart.load({
          columns: [
            ['Fuel', dataColumns[0], dataColumns[1], dataColumns[2]]
          ],
          colors: energySummaryBarColors.barColors(graphIndicator)
        });
        EnergySummaryChart.ygrids([{ value: dataColumns[3], text: 'Energy Target ' + dataColumns[3], position: 'end' }]);
      },


      setEnergySummaryChartPeriodic: function (dataColumns, graphLables, title, nTrains, graphIndicator) {
        EnergySummaryChart.load({
          columns: [
            ['Fuel', dataColumns[0], dataColumns[1], dataColumns[2]]
          ],
          colors: energySummaryBarColors.barColors(graphIndicator)
        });
        d3.select('#chart0 .c3-title').node().innerHTML = title;
        var string = title;
        var expr = "Average";
        if (string.indexOf(expr) !== -1) {
          d3.select('#chart0 svg').append('text')
            .attr('x', d3.select('#chart0 svg').node().getBoundingClientRect().width / 2)
            .attr("class", "subTitle")
            .attr('y', 40)
            .attr('text-anchor', 'middle')
            .style('font-size', '1.4em')
            .text('No: of Trains: ' + nTrains);
        }
        EnergySummaryChart.ygrids([{ value: dataColumns[3], text: 'Energy Target ' + dataColumns[3], position: 'end' }]);
      },

      toggleEnergyTarget: function (isOn) {
        if (isOn) {
          d3.selectAll('.c3-grid line')
            .style('visibility', 'visible')
          d3.selectAll('.c3-ygrid-line text')
            .style('visibility', 'visible')
        } else {
          d3.selectAll('.c3-grid line')
            .style('visibility', 'hidden')
          d3.selectAll('.c3-ygrid-line text')
            .style('visibility', 'hidden')
        }

      }


    }
  }
})();

