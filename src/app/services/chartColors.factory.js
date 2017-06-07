/** Created by Samskrithi on 18/11/2016. */

(function () {
    'use strict';
    angular
        .module('dassimFrontendV03')
        .factory('chartColors', chartColors)
    function chartColors(DRIVE_COLORS) {
        return {
            colors: function (performanceIndicator) {
                var IndicatorVariable = ['GOOD', 'AVERAGE', 'POOR'];
                var indicator;
                switch (performanceIndicator[0]) {
                    case IndicatorVariable[0]: {
                        indicator = DRIVE_COLORS.green_actual;
                        break;
                    }
                    case IndicatorVariable[1]: {
                        indicator = DRIVE_COLORS.orange;
                        break;
                    }
                    case IndicatorVariable[2]: {
                        indicator = DRIVE_COLORS.red;
                        break;
                    }
                }
                return indicator;
            }
        }
    }
})();

