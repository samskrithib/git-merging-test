/** Created by Samskrithi on 10/14/2016. */

(function() {
'use strict';
angular
.module('dassimFrontendV03')
.factory('httpCallsService', function httpCallsService($http, $q, $log) {

  // var path = '/dassim/';

  var path = 'http://localhost:8080/dassim/';
  var newpath = "jfdkljkldl";


  return {

    getByParams: function (url, params) {
      var deferred = $q.defer();
      $http({
        url: path+url,
        method: "GET",
        params: params
      }).then(function (response) {
        // $log.debug(response)
          deferred.resolve(response);
      }).catch(function (response) {
          deferred.reject(response);
      });
      return deferred.promise;
    },
    get: function (url) {
      var deferred = $q.defer();
      $http.get(path +url,{cache: false})
        .then(function (response) {
          deferred.resolve(response.data);
        })
        .catch(function (response) {
          deferred.reject(response);
        });
      return deferred.promise;
    },
    getStations: function () {
      var deferred = $q.defer();
      $http.get(path +'locationnamesandtiplocs', {cache: true})
      // $http.get('assets/data.json')
        .then(function (response) {
          deferred.resolve(response.data);
        })
        .catch(function (response) {
          deferred.reject(response.data);
        });
      return deferred.promise;
    },
     getByUrl: function(url){
      var deferred = $q.defer();
      $http({
        url: path+url,
        method: "GET",
      }).then(function (response) {
          deferred.resolve(response.data);
      }).catch(function (response) {
          deferred.reject(response);
      });
      return deferred.promise;
    },

    getByJson: function(json){
      var deferred = $q.defer();
      $http({
        url: json,
        method: "GET",
      }).then(function (response) {
          deferred.resolve(response.data);
      }).catch(function (response) {
          deferred.reject(response);
      });
      return deferred.promise;
    },

  }
});
})();
