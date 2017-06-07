/** Created by Samskrithi on 10/27/2016. */
(function () {
  'use strict';

  angular
    .module('dassimFrontendV03')
    .controller('dwellTimesController', dwellTimesController);

  function dwellTimesController($scope, $log, UrlGenerator, httpCallsService ) {
    var vm = this;
    vm.tabs = [];
    
    var dwellTimesUrl = UrlGenerator.getDwellTimesUrl();
    $log.debug(dwellTimesUrl)
    vm.promise = httpCallsService.getByUrl(dwellTimesUrl)
    // vm.promise = httpCallsService.getByJson(dwellTimesUrl)
      .then(function (response) {
        vm.response = response;
        vm.dwellTimes = vm.response.dwellTimes
        vm.headcode = vm.response.headcode
        $log.debug(vm.response)
       
       
      }).catch(function (error) {

      })

  }
})();
