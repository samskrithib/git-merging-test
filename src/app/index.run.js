(function() {
  'use strict';

  angular
    .module('dassimFrontendV03')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
