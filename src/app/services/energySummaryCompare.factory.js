/** Created by Samskrithi on 18/11/2016. */

(function () {
    'use strict';
    angular
        .module('dassimFrontendV03')
        .factory('energySummaryCompareFactory', energySummaryCompareFactory);
    function energySummaryCompareFactory($log, $window, $filter, energySummaryBarColors, DRIVE_COLORS) {
        var actualEnergyTotal, optimalEnergyTotal, onTimeOptimalEnergyTotal, targetEnergyTotal;
        var energySummaryValues = [];
        var EnergySummaryChart;
        var energySummaryDataAllRuns_array = [];
        var eachRunallLinks;
        return {
            getEnergySummaryData: function (energySummaries) {
                energySummaryDataAllRuns_array = [];
                _.each(energySummaries, function (val, key) {
                    eachRunallLinks = _.pluck(energySummaries[key].energySummaryLinks, 'energySummary');
                    energySummaryDataAllRuns_array.push(eachRunallLinks)
                })
                // $log.debug(energySummaryDataAllRuns_array);
                return energySummaryDataAllRuns_array;
            },
            // Data to generate Total or Sum of selected links Energy sumamry report
            getEnergySummarySumofLinks: function (energySummaryDataAllRuns_array) {
                var SumOfLinksEnergySummaryDataAllRuns_array = [];
                _.each(energySummaryDataAllRuns_array, function (val, key) {
                    // _.reduce sums up all the values and adds to memo
                    actualEnergyTotal = $filter('number')(_.reduce(energySummaryDataAllRuns_array[key], function (memo, num) { return memo + num.actualEnergyConsumption; }, 0), 2);
                    optimalEnergyTotal = $filter('number')(_.reduce(energySummaryDataAllRuns_array[key], function (memo, num) { return memo + num.optimalEnergyConsumption; }, 0), 2);
                    onTimeOptimalEnergyTotal = $filter('number')(_.reduce(energySummaryDataAllRuns_array[key], function (memo, num) { return memo + num.onTimeOptimalEnergyConsumption; }, 0), 2);
                    targetEnergyTotal = $filter('number')(_.reduce(energySummaryDataAllRuns_array[key], function (memo, num) { return memo + num.targetEnergyConsumption; }, 0), 2);
                    //    $log.debug(energySummaryDataAllRuns_array[key])
                    energySummaryValues = {
                        'name': 'Run_' + (key + 1),
                        'actualEnergyConsumption': actualEnergyTotal,
                        'optimalEnergyConsumption': optimalEnergyTotal,
                        'onTimeOptimalEnergyConsumption': onTimeOptimalEnergyTotal,
                        'targetEnergyConsumption': targetEnergyTotal
                    };
                    SumOfLinksEnergySummaryDataAllRuns_array.push(energySummaryValues)
                })
                return SumOfLinksEnergySummaryDataAllRuns_array;
            },
            /// Data for view specific links in Energy summary report
            getenergySummaryLinksData: function (data, links) {
                var energySummaryLinksData_array = [];
                var graphIndicators_array=[];
                _.each(data, function (val, key) {
                    var arr = [];
                    var GI = [];
                    var energySummaryAdvice_array = [];
                    var indexes = [];
                    var foo = _.pluck(data[key].energySummaryLinks, 'link');
                    _.each(links, function (val, key1) {
                        indexes.push(_.indexOf(foo, links[key1]));
                    });
                    // $log.debug(indexes);
                    _.each(indexes, function (val, key2) {
                        arr.push(data[key].energySummaryLinks[indexes[key2]].energySummary);
                    });
                    //get graphIndicators 
                    _.each(arr, function(val, key3){
                        GI.push(arr[key3].energySummaryAdvice.graphIndicator)
                    })
                     graphIndicators_array.push(GI)
                    energySummaryLinksData_array.push(arr)
                })
                    
                return {
                    energySummaryLinksData_array : energySummaryLinksData_array,
                    graphIndicators_array: graphIndicators_array
                }
            },

            getEnergySummaryGraphLinks: function (data) {
                return (_.pluck(data, 'link'));
            },

            getEnergySummaryGraphIndicators: function (energySummaries) {

            },

            //------------------------------Graph Labels --------------------------------------------------//
            getEnergySummaryGraphLabels: function () {
                var graphLabelsAndTitles = {
                    "xAxisLabels": {
                        actualEnergyConsumption: "Actual Driving & Actual Time",
                        optimalEnergyConsumption: "Eco Driving & Actual Time",
                        onTimeOptimalEnergyConsumption: "Eco Driving & On-Time Running"
                    },
                    "yAxisLabel": "Fuel (litres)",
                    "graphTitle": "Actual vs Achievable Fuel Consumption",
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
                        json: energySummary,
                        keys: {
                            x: 'name',
                            value: ['actualEnergyConsumption', 'optimalEnergyConsumption', 'onTimeOptimalEnergyConsumption']
                        },
                        type: 'bar',
                        names: graphLabels.xAxisLabels,
                        labels: true,
                        
                        colors: energySummaryBarColors.barColors_JsonInput(graphIndicator)
                    },
                    title: {
                        text: graphLabels.graphTitle
                    },

                    legend: {
                        show: true
                    },
                    axis: {
                        x: {
                            type: 'category',
                            // categories: graphLabels.xAxisLabels,
                            height: 50
                        },
                        y: {
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
                    }

                });
            },


            setEnergySummaryChart: function (dataColumns, graphIndicator) {
                EnergySummaryChart.load({
                    json: dataColumns,
                    keys: {
                        value: ['actualEnergyConsumption', 'onTimeOptimalEnergyConsumption', 'optimalEnergyConsumption']
                    },
                    colors: energySummaryBarColors.barColors_JsonInput(graphIndicator)
                    
                });
            },



        }
    }
})();

