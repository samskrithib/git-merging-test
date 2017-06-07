/** Created by Samskrithi on 18/11/2016. */

(function () {
  'use strict';
  angular
    .module('dassimFrontendV03')
    .factory('timetableAdherencePercentilesFactory', timetableAdherencePercentilesFactory);
  function timetableAdherencePercentilesFactory($log, UtilityService) {
    var ModifiedData;
    var timetableAdherenceChart;
    
    // OVERLAP FIXING
    var fixOverlaps = function (data) {
      // sort from highest to smallest
      data = _.sortBy(data, 'value').reverse(); // using underscore.js here
      // get y-axis distance within which is considered 'overlap'
      // taken as a factor of highest value in series.. so it scales
      var tooClose = data[0].value / 35;
      // loop, find overlappers and write offset values into them
      _.each(data, function(val, key){
        data[key].class = data[key].tiploc
      })
      for (var i = 1; i < data.length; i++) {
        var prev = data[i - 1];
        var curr = data[i];
        if (prev.value - curr.value <= tooClose) {
          // set the offset based on the length of the previous item's name (cumulative) ..add 2 for padding
          curr.offset = ((!prev.offset) ? prev.text.length : prev.offset + prev.text.length) + 2;
        }
      }
      return data;
    };


    return {

      getTTAdherencePercentileChart: function (data) {
        ModifiedData = function () {
          var timeDistanceArray;
          var identifier, seriesName;
          var array = data.timetableAdherenceGraphSeriesList[0].timetableArray
          timeDistanceArray = array[0].timeAndDistanceList
          identifier = d3.keys(timeDistanceArray[0].identifierAndDistance)
          seriesName = 'identifierAndDistance.' + identifier;
          return {
            json: timeDistanceArray,
            keys: {
              x: 'timeInSeconds',
              xformat: '%Y-%m-%d %H:%M:%S',
              value: [seriesName]
            },
            xSort: false
          }
        }
        timetableAdherenceChart = c3.generate({
          bindto: '#TTAdherencePercentile',
          size: {
            height: 500
          },
          padding: {
            right: 50
          },
          data: ModifiedData(),
          legend: {
            show: false
          },
          axis: {
            y: {
              min: 0,
              padding: { bottom: 0 }

            },
            x: {
              type: "timeseries",
              tick: {
                  format: function(x){
                    return moment().startOf('day').seconds(x).format('h:mm:ss')
                  },
                centered: true,
                fit: false,
                culling: {
                  max: 5
                }
              }
            }

          },
          zoom: {
            enabled: true,
            rescale: true,
            extent: [1, 5000]
          },
          point: {
            r: 2
          },
          subchart: {
            show: true
          },
          grid: {
            lines: {
              front: false
            }
          },
          tooltip: {
            format: {
              title: function (d) {
                var x =  moment().startOf('day').seconds(d).format("h:mm:ss a")
                return x;
              },
              name: function (d) {
                var tooltip_name = d.split(".")
                return tooltip_name[1]
              }
            }
          }

        })

      },

      LoadTTAdherencePercentileChartData: function (data, gridlines) {
        timetableAdherenceChart.unload({
          done: function () {
            var newnames = {};
            var allNames = [];
            var ActualRunSeriesNames = [];
            var scheduledSeriesNames = [];
            _.each(data, function (val, key) {
              var array = data[key].timetableArray;

              _.each(array, function (val, index) {
                var timeDistanceArray = array[index].timeAndDistanceList
                var identifier = d3.keys(timeDistanceArray[0].identifierAndDistance)
                var seriesName = 'identifierAndDistance.' + identifier;
                var splitIdentifier = identifier.toString().split(" ");
                newnames[seriesName] = splitIdentifier[1] + ' ' + splitIdentifier[2];
                allNames[allNames.length] = seriesName;
                if (array[index].timetableType === 'SCHEDULED') {
                  scheduledSeriesNames[scheduledSeriesNames.length] = seriesName
                } else {
                  ActualRunSeriesNames.push(seriesName)
                }
                timetableAdherenceChart.load({
                  json: timeDistanceArray,
                  keys: {
                    x: 'timeInSeconds',
                    value: [seriesName],
                    xformat: '%Y-%m-%d %H:%M:%S'
                  }
                })
                // timetableAdherenceChart.data.colors({
                //    [seriesName]: d3.rgb('#f0ff00').darker(2)
                // })

              })
            })

            function toggle(id) {
              timetableAdherenceChart.toggle(id);
            }
            d3.select('#index1')
              .insert('div')
              .attr('class', 'legend')
              .insert('ul').attr('class', 'list-group')
              .selectAll('span')
              .data(ActualRunSeriesNames)
              .enter().append('li').attr('class', 'list-group-item')
              .attr('data-id', function (id) { return id; })
              .append('div', '.legend-label')
              .html(function (id) { return newnames[id]; })
              .on('mouseover', function (id) {
                var fields = id.split(".");
                var string = fields[1].slice(9)
                var newArray = [];
                var index_of_matchedString = UtilityService._findStringinArray(string, scheduledSeriesNames)
                newArray.push(scheduledSeriesNames[index_of_matchedString])
                newArray.push(id)
                d3.select(this).style("cursor", "pointer");
                timetableAdherenceChart.focus(newArray);
              })
              .on('mouseout', function (id) {
                d3.select(this).style("cursor", "pointer");
                timetableAdherenceChart.revert();
              })
              .on('click', function (id) {
                var fields = id.split(".");
                var string = fields[1].slice(7)
                var newArray = [];
                var index_of_matchedString = UtilityService._findStringinArray(string, scheduledSeriesNames)
                newArray.push(scheduledSeriesNames[index_of_matchedString])
                newArray.push(id)
                // d3.select(this).style("opacity", 0.2);
                timetableAdherenceChart.toggle(newArray);
              })
              .insert('span', '.legend-label').attr('class', 'badge-pill')
              .each(function (id) {
                d3.select(this).style('background-color', timetableAdherenceChart.color(id));
              })
              .html(function (id) {
                return '&nbsp&nbsp&nbsp&nbsp&nbsp'
              })

            // draw plotlines/gridlines
            fixOverlaps(gridlines).forEach(function (station) {
              timetableAdherenceChart.ygrids.add({
                value: station.value,
                text: station.text,
                class: station.class
              });
              var selector = ".c3-ygrid-line."+station.class;
            //   $log.debug(selector)
              d3.select(selector).select('text')
                .attr('dx', function (id) {
                  if (station.offset) {
                    // $log.debug(id)
                    return -station.offset*4;
                  }
                })

                
            });


          }
        })

      }



    }
  }
})();

