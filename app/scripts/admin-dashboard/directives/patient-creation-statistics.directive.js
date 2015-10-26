/* global angular */
/*
jshint -W003, -W026
*/
(function () {
    'use strict';

    angular
        .module('app.adminDashboard')
        .directive('patientCreationStatistics', patientCreationStatistics);

    function patientCreationStatistics() {
        return {
            restict: "E",
            scope: {
              location: "@", period: "@"
            },
            controller: patientCreationStatisticsController,
            templateUrl: "views/admin-dashboard/patient-creation-statistics.html"
        };
    }

    patientCreationStatisticsController.$inject = ['$scope', '$rootScope', 'EtlRestService', 
      'moment', '$state','$filter'];

    function patientCreationStatisticsController($scope, $rootScope, EtlRestService, 
          moment, $state, $filter) { 
        $scope.startDate = new Date();
        $scope.endDate = new Date();                     
        $scope.currentPage = 1;        
        $scope.startFrom='';
        
        $scope.statisticSearchString='';
        $scope.isBusyStatistics = false;
        $scope.experiencedStatisticsLoadError = false;        
        $scope.creationstatistics=false;
        $scope.showStatistics = false;
                       
        $scope.selectedDate = function (value) {
            if (value) {                
                $scope.startDate = value;
                $scope.showStatistics=false;
                $scope.showPatientsInLocation=false;  
            }
            else {
                return $scope.startDate;
            }
        };        
        
        $scope.selectedEndDate = function (value) {
            if (value) {               
                $scope.endDate = value;
                $scope.showStatistics=false; 
                $scope.showPatientsInLocation=false;               
            }
            else {
                return $scope.endDate;
            }
        };        

        $scope.openDatePopup = openDatePopup;
        $scope.dateControlStatus = {
            startOpened: false
        };       
        
        $scope.openEndDatePopup = openEndDatePopup;
        $scope.endDateControlStatus = {
            startOpened: false
        };      
        
        function openDatePopup ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.dateControlStatus.startOpened = true;
        };
        
         function openEndDatePopup ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.endDateControlStatus.startOpened = true;
        };

        $scope.loadPatientCreationStats=function(){       
           $scope.isBusyStatistics = true;
           $scope.patientCreationStatisticsLoadError=false;
           
           EtlRestService.getPatientsCreatedByPeriod(
                moment($scope.startDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
                moment($scope.endDate).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
                onSuccessPatientStatisticsQuery,
                onFailedPatientStatisticsQuery
           );
        };
        
        function onSuccessPatientStatisticsQuery(data){                   
                   $scope.showStatistics=true;                   
                   $scope.patientStatistics=data;
                   $scope.nextStartIndex = +data.startIndex + data.size;
                   $scope.isBusyStatistics = false;
                   $scope.experiencedStatisticsLoadError=false;
                   $scope.showCreationDetails=false;                  
        }
        
        function onFailedPatientStatisticsQuery(error){           
                   $scope.experiencedStatisticsLoadError=true;                                              
        }
        
        
    }    
})();
