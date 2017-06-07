/** Created by Samskrithi on 18/11/2016. */

(function () {
    'use strict';
    angular
        .module('dassimFrontendV03')
        .factory('testFactory', testFactory);
    function testFactory($log) {
        
        return {
            getchartlinks: function(data){
                return (_.pluck(data[0].energySummaryLinks, 'link'));
            },
            getenergySummaryDataOfSelectedLink: function(energySummaries, link){
                var Es;
                var allLinks = _.pluck(energySummaries[0].energySummaryLinks, 'link')
                 var indexOfLinkInArray = _.indexOf(allLinks, link )
                    $log.debug(link)
                    var energySummaryOfLink_array= []
                _.each(energySummaries, function(val, key){
                    //Find the index of link in energySummaryLinks Array
                   var energySummaryLinks_eachRun = energySummaries[key].energySummaryLinks
                   if(indexOfLinkInArray === -1 ){
                       Es = energySummaries[key].total
                   }else{
                     Es = energySummaryLinks_eachRun[indexOfLinkInArray].energySummary;
                   }
                   energySummaryOfLink_array.push(Es)
                })
                 $log.debug(energySummaryOfLink_array)
                 return energySummaryOfLink_array;
            },


           



        }
    }
})();

