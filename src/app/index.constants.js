/* global malarkey:false, moment:false */
(function() {
  'use strict';

  angular
    .module('dassimFrontendV03')
    .constant('malarkey', malarkey)
    .constant('moment', moment)
    .constant('DRIVE_COLORS', {
      blue: '#7cb5ec',
      blue_dark: '#1f77b4',
      red : '#D2527F',
      orange : '#FF7F0E',
      green : '#2ca02c',
      green_actual : '#5FD35F',
      green_light : '#ABFFAB',
      black : '#000000',
      brown : '#8c564b'
    })
  
})();
