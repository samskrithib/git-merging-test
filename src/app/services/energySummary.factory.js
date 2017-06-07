/** Created by Samskrithi on 18/11/2016. */

(function () {
    'use strict';
    angular
        .module('dassimFrontendV03')
        .factory('energySummaryFactory', energySummaryFactory)

    function energySummaryFactory($log, $window, $filter, chartColors, c3LegendOnHoverFactory, DRIVE_COLORS) {

        var EnergySummaryChart;
        return {

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
                    "seriesLabels": {
                        actualEnergyConsumption: "Actual",
                        optimalEnergyConsumption: "Optimised Achievable",
                        onTimeOptimalEnergyConsumption: "Optimised With On-Time Departure"
                    }
                }
                return graphLabelsAndTitles;
            },

            //------------------------------Generate c3 chart----------------------------------------------//
            getEnergySummaryChart: function (energySummary, graphLabels, graphIndicator) {
                EnergySummaryChart = c3.generate({
                    bindto: '#chart1',
                    size: {
                        height: 300
                    },
                    data: {
                        json: energySummary,
                        keys: {
                            value: ['actualEnergyConsumption', 'optimalEnergyConsumption', 'onTimeOptimalEnergyConsumption']
                        },
                        type: 'bar',
                        names: graphLabels.seriesLabels,
                        labels: true,
                        colors: {
                            'actualEnergyConsumption': function () {
                               
                                return chartColors.colors(graphIndicator)
                            },
                            'optimalEnergyConsumption': DRIVE_COLORS.green,
                            'onTimeOptimalEnergyConsumption': DRIVE_COLORS.green_light
                        }
                            
                    },
                    title: {
                        text: graphLabels.graphTitle
                    },
                    oninit: function () {
                        // declare your extra long labels here
                        var legendLongLabels = [
                            'Actual fuel consumption',
                            'Eco-Driving fuel consumption possible assuming actual departure time, or on-time if departing early, and arriving as close to on-time as possible at next station stop % of trains which could arrive in this lateness range with best practice driving assuming actual departure time from previous station stop',
                            'Ecodriving fuel consumption possible for on-time departure and on-time arrival at next station stop'
                        ];
                        this.legendHoverContent = c3LegendOnHoverFactory.generateLegendHoverLabels.call(this, legendLongLabels);
                    },
                    legend: c3LegendOnHoverFactory.legend(),
                    axis: {
                        x: {
                            tick: {
                                format: function () { return '' }
                            },
                            type: 'category',
                            //   categories: graphLabels.xAxisLabels,
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
                        width: 50
                    },
                    grid: {
                        lines: {
                            front: true
                        },
                        y: {
                            lines: [
                                { value: energySummary[0].targetEnergyConsumption, text: 'Energy Target ' + energySummary[0].targetEnergyConsumption, position: 'end' }
                            ]
                        }
                    }
                });
                d3.selectAll(".c3-bar")
                    .attr("transform", "translate(-5, 0)");
            },

            setEnergySummaryChart: function (energySummary, graphIndicator) {
                EnergySummaryChart.load({
                    json: energySummary,
                    keys: {
                        value: ['actualEnergyConsumption', 'optimalEnergyConsumption', 'onTimeOptimalEnergyConsumption']
                    },
                    
                    colors: {
                        'actualEnergyConsumption': function () {
                                return chartColors.colors(graphIndicator)
                        },
                        'optimalEnergyConsumption': DRIVE_COLORS.green,
                        'onTimeOptimalEnergyConsumption': DRIVE_COLORS.green_light
                    }
                    
                });
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

