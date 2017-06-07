/**
 * Created by Samskrithi on 18/11/2016.
 */
(function() {
  'use strict';
  var secretEmptyKey = '[$empty$]'
  angular
    .module('dassimFrontendV03')
    .directive('emptyTypeahead', function () {
      return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
          // this parser run before typeahead's parser
          modelCtrl.$parsers.unshift(function (inputValue) {
            var value = (inputValue ? inputValue : secretEmptyKey); // replace empty string with secretEmptyKey to bypass typeahead-min-length check
            modelCtrl.$viewValue = value; // this $viewValue must match the inputValue pass to typehead directive
            return value;
          });

          // this parser run after typeahead's parser
          modelCtrl.$parsers.push(function (inputValue) {
            return inputValue === secretEmptyKey ? '' : inputValue; // set the secretEmptyKey back to empty string
          });
        }
      }
    })
})();
