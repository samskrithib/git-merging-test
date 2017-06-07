/**
 * Created by Samskrithi on 06/12/2016.
 */

(function() {
  'use strict';
  angular
    .module('dassimFrontendV03')
    .directive('compileHtml', ['$sce', '$parse', '$compile',
      function($sce, $parse, $compile) {
        return {
          restrict: 'A',
          compile: function ngBindHtmlCompile(tElement, tAttrs) {
            var ngBindHtmlGetter = $parse(tAttrs.compileHtml);
            var ngBindHtmlWatch = $parse(tAttrs.compileHtml, function getStringValue(value) {
              return (value || '').toString();
            });
            $compile.$$addBindingClass(tElement);

            return function ngBindHtmlLink(scope, element, attr) {
              $compile.$$addBindingInfo(element, attr.compileHtml);

              scope.$watch(ngBindHtmlWatch, function ngBindHtmlWatchAction() {
                // we re-evaluate the expr because we want a TrustedValueHolderType
                // for $sce, not a string
                element.html($sce.getTrustedHtml(ngBindHtmlGetter(scope)) || '');
                $compile(element.contents())(scope);
              });
            };
          }
        };
      }
  ]);

})();
