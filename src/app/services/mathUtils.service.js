/** Created by Samskrithi on 10/14/2016. */

(function () {
    'use strict';
    angular
        .module('dassimFrontendV03')
        .factory('mathUtilsService', function mathUtilsService($log) {
            return {
                convertMetersToMiles: function (givenValue, convertedValue) {
                    var conversionValueforMeterstoMiles = 0.000621371;
                    _.each(givenValue, function (val, key) {
                        convertedValue[convertedValue.length] = givenValue[key] * conversionValueforMeterstoMiles;
                    })
                    return convertedValue;
                },
                convertKphtoMph: function (givenValue, convertedValue){
                     var conversionValueforKphtoMph = 0.621371;
                    _.each(givenValue, function (val, key) {
                        convertedValue[convertedValue.length] = givenValue[key] * conversionValueforKphtoMph;
                    })
                    return convertedValue;
                },
                formatNumToSIUnits: function (num) {
                    if (num >= 1000000000) {
                        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G'
                    }
                    if (num >= 1000000) {
                        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
                    }
                    if (num >= 100) {
                        return (num / 1000).toFixed(1).replace(/\.0$/, '')
                    }
                    return num;
                }
            }
        });
})();
