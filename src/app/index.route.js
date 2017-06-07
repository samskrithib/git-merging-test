(function() {
  'use strict';

  angular
    .module('dassimFrontendV03')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'views/login/login.html'
        
      })
      .state('view', {
        url: '/view',
        templateUrl: 'views/view-my-runs/view-my-runs-input.html',
        controller: 'ViewMyRunsInputController',
        controllerAs: 'vm'
      })
      .state('view-my-runs', {
        url: '/view-my-runs',
        templateUrl: 'views/view-my-runs/view-my-runs.html',
        controller: 'ViewMyRunsController',
        controllerAs: 'vm'
      })
      .state('periodicInput', {
        url: '/periodicInput',
        templateUrl: 'views/periodicReports/periodicReportsInput.html',
        controller: 'PeriodicReportsInputController',
        controllerAs: 'vm'
      })
      .state('periodicReports', {
        url: '/periodicReports',
        templateUrl: 'views/periodicReports/periodicReports.html',
        controller: 'PeriodicReportsController',
        controllerAs: 'vm'
      })
      .state('timetableAdherenceInput', {
        url: '/timetableAdherenceInput',
        templateUrl: 'views/trainGraph/trainGraphInput.html',
        controller: 'TimetableAdherenceInputController',
        controllerAs: 'vm'
      })
      .state('timetableAdherence', {
        url: '/timetableAdherence',
        templateUrl: 'views/trainGraph/trainGraph.html',
        controller: 'TrainGraphController',
        controllerAs: 'vm'
      })
      .state('test', {
        url: '/test',
        templateUrl: 'views/test.html',
        controller: 'testController',
        controllerAs: 'vm'
      })
      .state('dwellTimesInput',{
         url: '/dwellTimesInput',
        templateUrl: 'views/dwellTimes/dwellTimesPerJourneyInput.html',
        controller: 'dwellTimesInputController',
        controllerAs: 'vm'
      })
      .state('dwellTimes',{
         url: '/dwellTimes',
        templateUrl: 'views/dwellTimes/dwellTimesPerJourney.html',
        controller: 'dwellTimesController',
        controllerAs: 'vm'
      })
      .state('comparemyrunsInput', {
        url: '/comparemyrunsInput',
        templateUrl: 'views/compare-my-runs/compare-my-runs-input.html',
        controller: 'CompareMyRunsInputController',
        controllerAs: 'vm'
      })
      .state('comparemyruns', {
        url: '/comparemyruns',
        templateUrl: 'views/compare-my-runs/compare-my-runs.html',
        controller: 'CompareMyRunsController',
        controllerAs: 'vm'
      });

    $urlRouterProvider.otherwise('/login');
  }

})();
