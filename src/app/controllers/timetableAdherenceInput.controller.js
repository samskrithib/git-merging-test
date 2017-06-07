/** Created by Samskrithi on 10/27/2016. */
(function () {
    'use strict';

    angular
        .module('dassimFrontendV03')
        .controller('TimetableAdherenceInputController', TimetableAdherenceInputController);

    function TimetableAdherenceInputController(httpCallsService, UrlGenerator, $scope, $location, $log, typeaheadService, UtilityService, trainGraphFactory) {
        var vm = this;
        var defaultStartTime = function () {
            var d = new Date()
            d.setHours(6);
            d.setMinutes(0);
            d.setSeconds(0)
            return d;
        }
        var defaultEndTime = function () {
            var d = new Date()
            d.setHours(12);
            d.setMinutes(0);
            d.setSeconds(0)
            return d;
        }
        vm.templates = [
            { name: 'TTPercentile', url: 'views/trainGraph/ttadherencePercentileInput.tmpl.html' },
            { name: 'TTTrackTrains', url: 'views/trainGraph/ttadherenceTrackTrainsInput.tmpl.html' }
        ];
        vm.RadioButtonModel = vm.templates[0].name;
        vm.template=vm.templates[0]
        $scope.$watch('vm.RadioButtonModel', function (newVal, oldVal) {
            $log.debug(" " + newVal)
            if (newVal != oldVal) {
                vm.RadioButtonModel = newVal;
                var index= _.findLastIndex(vm.templates, {name: newVal})
                vm.template = vm.templates[index];
            }

        })

        vm.selectWeekdayOrWeekend = [
            { name: 'Weekdays' },
            { name: 'Weekends' },
        ]

        vm.weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        vm.weekends = ['Saturday', 'Sunday'];

        vm.percentilesList = [
            '10%', '20%', '30%', '40%', '50%',
            '60%', '70%', '80%', '90%', '100%',
        ]

        //order station names with leading character on higher rank
        vm.smartOrder = function (obj) {
            var queryObj = typeaheadService.getQueryObject(),
                key = Object.keys(queryObj)[0],
                query = queryObj[key];
            if (obj[key].toLowerCase().indexOf(query.toLowerCase()) === 0) {
                return ('a' + obj[key]);
            }
            return ('b' + obj[key]);
        };
        vm.getStations = function () {
           httpCallsService.getStations().then(function (data) {
                if (data.length <= 0) {
                    vm.state = "NORESULTS";
                    vm.statusmessage = "No results";
                }
                else {
                    vm.state = "SUCCESS";
                    vm.statusmessage = "Enter station name";
                    vm.stations = data;
                }
            }).catch(function (response) {
                vm.state = "NORESULTS";
                vm.statusmessage = "No Results";
                $log.debug(/*"controller response: " +*/response);
            });
        };

        vm.stations = [];
        vm.getStations();
        vm.modelOptions = {
            debounce: {
                default: 500,
                blur: 250
            },
            getterSetter: true
        };

        vm.opened = false;
        vm.open1 = function () {
            vm.popup1.opened = true;
        };
        vm.popup1 = {
            opened: false
        };
        vm.open2 = function () {
            vm.popup2.opened = true;
        };
        vm.popup2 = {
            opened: false
        };

        vm.formData = {};


        vm.formData.startTime = defaultStartTime();
        vm.formData.endTime = defaultEndTime();
        vm.formData.weekdays = vm.weekdays;
        vm.formData.weekends = vm.weekends;
        vm.rollingStockChoices = [];
        vm.serviceCodeChoices = [];
        vm.daysRangeOptionSelected = '';
        $scope.$watchGroup(['vm.daysRangeOptionSelected', 'vm.formData.weekdays', 'vm.formData.weekends'], function (newVal, oldVal) {
            // $log.debug(vm.daysRangeOptionSelected)
            if (newVal != oldVal) {
                if (vm.daysRangeOptionSelected == 'Weekdays') {
                    vm.formData.daysRange = vm.formData.weekdays
                } else if (vm.daysRangeOptionSelected == 'Weekends') {
                    vm.formData.daysRange = vm.formData.weekends
                }
                // $log.debug(vm.formData)
            }
        })

        httpCallsService.getByUrl('servicecodes')
            .then(function (response) {
                vm.serviceCodeChoices = response;
                vm.formData.serviceCode = vm.serviceCodeChoices;
            })

        vm.timetableAdherenceSubmit = function (isValid) {
            if (isValid) {
                $log.debug(vm.formData)
                UtilityService.addCheckedItems(vm.RadioButtonModel)
                UrlGenerator.generateTTAdherenceUrls(vm.formData)
                $location.path("/timetableAdherence");
            }
        }

    }
})();