/** Created by Samskrithi on 24/11/2016. */
(function() {
  'use strict';
  angular
  .module('dassimFrontendV03')
  .factory('speedDistanceDataFactory', speedDistanceDataFactory);

  function speedDistanceDataFactory($log, $filter, mathUtilsService) {
    
    var links=[];
    var actualSpeed=[], actualPosition=[];
    var flatoutSpeed=[], flatoutPosition=[];
    var optimalSpeed=[],  optimalPosition=[];
    // var speedRestrictionValue = [], speedRestrictionendPoint = [], speedRestrictionbeginPoint=[];
    var scaledElevationValue=[],  scaledElevationPosition=[];
    var actualSpeedMph=[], actualPositionM=[];
    var flatoutSpeedMph=[], flatoutPositionM=[];
    var optimalSpeedMph=[], optimalPositionM=[];
    // var speedRestrictionValueMph=[], speedRestrictionendPointM=[], speedRestrictionbeginPointM=[];
    var scaledElevationValueMph=[],  scaledElevationPositionM=[];
    
    var speedRestrictionPointsM = [], speedValuesMph = [];
    var speedRestrictionPoints=[], speedValues = [];

    var seriesNameMatchers = [
    "ActualDriving", "actualPosition",  
    "FlatoutDriving", "flatoutPosition", 
    "EcoDriving", "optimalPosition",
    "SpeedLimit", "endPoint", "beginPoint",
    "scaledPosition", "Elevation"
    ];

    return{
    getSpeedDistanceGraphLabels: function () {
      var graphLabelsAndTitles = {
        "yAxisLabel": "Speed (Kph)",
        "graphTitle": "Speed Distance Graph",
        "seriesLabels": null
      }
      return graphLabelsAndTitles;
    },
    getDriverAdvice: function(data){
      var driverAdvice=[];
      _.each(data, function(val, key){
        driverAdvice[key] = data[key].driverAdvice;
        // $log.debug(driverAdvice[key])
      })
      return driverAdvice;
    },

    getActualSpeedDistance : function(data){
      actualSpeed=[], actualPosition=[];
      actualSpeedMph=[], actualPositionM=[];
      _.each(data, function(val,key){

       actualSpeed[key] = _.pluck(data[key].speedDistanceProfiles.actualSpeedAndPositions, 'speed');
       actualPosition[key] = _.pluck(data[key].speedDistanceProfiles.actualSpeedAndPositions, 'position');

       actualSpeedMph[key]=[];
       actualPositionM[key] =[];

       mathUtilsService.convertKphtoMph(actualSpeed[key], actualSpeedMph[key])
       mathUtilsService.convertMetersToMiles(actualPosition[key], actualPositionM[key])

       actualSpeed[key].splice(0,0, seriesNameMatchers[0]);
       actualPosition[key].splice(0,0, seriesNameMatchers[1]);
       actualSpeedMph[key].splice(0,0, seriesNameMatchers[0]);
       actualPositionM[key].splice(0,0, seriesNameMatchers[1]);
     })

    },

    getFlatoutSpeedDistance : function (data) {
      flatoutSpeed=[], flatoutPosition=[];
      flatoutSpeedMph=[], flatoutPositionM=[];
      _.each(data, function(val,key){
        flatoutSpeed[key]= _.pluck(data[key].speedDistanceProfiles.flatoutSpeedAndPositions, 'speed');
        flatoutPosition[key] = _.pluck(data[key].speedDistanceProfiles.flatoutSpeedAndPositions, 'position');

        flatoutSpeedMph[key]=[];
        flatoutPositionM[key]=[];

        mathUtilsService.convertKphtoMph(flatoutSpeed[key], flatoutSpeedMph[key])
        mathUtilsService.convertMetersToMiles(flatoutPosition[key], flatoutPositionM[key])

        flatoutSpeed[key].splice(0,0, seriesNameMatchers[2]);
        flatoutSpeedMph[key].splice(0,0, seriesNameMatchers[2]);
        flatoutPosition[key].splice(0,0, seriesNameMatchers[3])
        flatoutPositionM[key].splice(0,0, seriesNameMatchers[3])

      })
      
    },

    getOptimalSpeedDistance : function(data){
      optimalSpeed=[],  optimalPosition=[];
      optimalSpeedMph=[], optimalPositionM=[];
     _.each(data, function(val,key){
      optimalSpeed[key] = _.pluck(data[key].speedDistanceProfiles.optimalSpeedAndPositions, 'speed');
      optimalPosition[key] = _.pluck(data[key].speedDistanceProfiles.optimalSpeedAndPositions, 'position');

      optimalSpeedMph[key]=[];
      optimalPositionM[key]=[];

      mathUtilsService.convertKphtoMph(optimalSpeed[key], optimalSpeedMph[key])
      mathUtilsService.convertMetersToMiles(optimalPosition[key], optimalPositionM[key])

      optimalSpeed[key].splice(0,0, seriesNameMatchers[4]);
      optimalSpeedMph[key].splice(0,0, seriesNameMatchers[4]);
      optimalPosition[key].splice(0,0, seriesNameMatchers[5])
      optimalPositionM[key].splice(0,0, seriesNameMatchers[5])

    })
  },

  getSpeedLimits : function(data){
    speedValues = [], speedRestrictionPoints = [];
    speedValuesMph=[], speedRestrictionPointsM=[];
    _.each(data, function(val,key){
      speedValues[key] = _.pluck(data[key].speedRestrictions, 'value')
      speedRestrictionPoints[key] = _.pluck(data[key].speedRestrictions, 'point')

      speedValuesMph[key]=[];
      speedRestrictionPointsM[key]=[];

      mathUtilsService.convertKphtoMph(speedValues[key], speedValuesMph[key])
      mathUtilsService.convertMetersToMiles(speedRestrictionPoints[key], speedRestrictionPointsM[key])

      speedValues[key].splice(0,0,seriesNameMatchers[6]);
      speedValuesMph[key].splice(0,0,seriesNameMatchers[6]);
      speedRestrictionPoints[key].splice(0,0,seriesNameMatchers[7]);
      speedRestrictionPointsM[key].splice(0,0,seriesNameMatchers[7]);
    // $log.debug(speedRestrictionPointsM[key])

  })
  },

  getElevation : function(data){
    scaledElevationValue=[],  scaledElevationPosition=[];
    scaledElevationValueMph=[],  scaledElevationPositionM=[];
   _.each(data, function(val,key){
    scaledElevationValue[key] = _.pluck(data[key].scaledElevations, 'scaledElevation')
    scaledElevationPosition[key] = _.pluck(data[key].scaledElevations, 'position');
    scaledElevationValueMph[key]=[];
    scaledElevationPositionM[key]=[];
    // Elevation values should always be in Meters(Reqiurement)
    // mathUtilsService.convertToMph(scaledElevationValue[key], scaledElevationValueMph[key])
    mathUtilsService.convertMetersToMiles(scaledElevationPosition[key], scaledElevationPositionM[key])

    scaledElevationValue[key].splice(0,0, seriesNameMatchers[10])
    scaledElevationValueMph[key].splice(0,0, seriesNameMatchers[10])
    scaledElevationPosition[key].splice(0,0, seriesNameMatchers[9])
    scaledElevationPositionM[key].splice(0,0, seriesNameMatchers[9])
  })

},

getSpeedDistanceLinks: function(data){
  links = _.pluck(data, 'link')
  return links;
},

getSpeedDistanceData_Kph : function(){
  return{
    links: links,
    actualDriving : actualSpeed,
    actualPosition : actualPosition,
    flatoutDriving : flatoutSpeed,
    flatoutPosition : flatoutPosition,
    ecoDriving : optimalSpeed,
    optimalPosition : optimalPosition,
    speedLimit :  speedValues,
    endPoint : speedRestrictionPoints,
    scaledPosition : scaledElevationPosition,
    Elevation: scaledElevationValue
  }
},

getSpeedDistanceData_Mph: function(){
  return{
    links: links,
    actualDriving : actualSpeedMph,
    actualPosition : actualPositionM,
    flatoutDriving : flatoutSpeedMph,
    flatoutPosition : flatoutPositionM,
    ecoDriving : optimalSpeedMph,
    optimalPosition : optimalPositionM,
    speedLimit :  speedValuesMph,
    endPoint : speedRestrictionPointsM,
    scaledPosition : scaledElevationPositionM,
    Elevation: scaledElevationValue
  }
}



}

}
})();
