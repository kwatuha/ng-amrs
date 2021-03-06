/*
jshint -W003, -W098, -W117, -W109
*/
(function() {
'use strict';

  angular
        .module('app.patientsearch')
        .controller('PatientSearchCtrl', PatientSearchCtrl);

  PatientSearchCtrl.$inject = ['$rootScope', 'OpenmrsRestService', '$scope', '$log', 'filterFilter', '$state'];

  function PatientSearchCtrl($rootScope, OpenmrsRestService, $scope, $log, filterFilter, $state) {
    $scope.filter = "";
    $scope.patients = [];

    $scope.isBusy = false;

    // pagination controls
  	$scope.currentPage = 1;
  	//$scope.totalItems = $scope.items.length;
  	$scope.entryLimit = 10; // items per page
  	$scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);

   $scope.$watch('searchString', function (searchString) {
     $scope.patients = [];
     if (searchString && searchString.length > 3) {
       $scope.isBusy = true;
       OpenmrsRestService.getPatientService().getPatientQuery({q:searchString},
         function(data) {
           $scope.isBusy = false;
           //if (data) data = data.results;
           //console.log(data);
           $scope.patients = data;
          //  for (var i in data) {
          //    $scope.patients.push(PatientService.Patient(data[i]));
          //  }
          $scope.totalItems = $scope.patients.length;
          $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
        	$scope.currentPage = 1;
         }
       );
     }
   });


   $scope.loadPatient = function (patientUuid){
     /*
     Get the selected patient and save the details in the root scope
     so that we don't do another round trip to get the patient details
     */
     $rootScope.broadcastPatient = _.find($scope.patients, function(patient){
       if(patient.uuid() === patientUuid)
       {return patient;}
     });
     $state.go('patient', {uuid:patientUuid});
   };


  //  $scope.currentPage = 1;

  //   $scope.setPage = function(pageNo) {
  //   $scope.currentPage = pageNo;
  // };

    $scope.pageChanged = function() {
    $log.log('Page changed to: ' + $scope.currentPage);
  };

    $scope.items = [];

	// create empty search model (object) to trigger $watch on update
	$scope.search = {};

	$scope.resetFilters = function () {
		// needs to be a function or it won't trigger a $watch
		$scope.search = {};
	};



	// $watch search to update pagination
	// $scope.$watch('search', function (newVal, oldVal) {
	// 	$scope.filtered = filterFilter($scope.items, newVal);
	// 	$scope.totalItems = $scope.filtered.length;
	// 	$scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
	// 	$scope.currentPage = 1;
	// }, true);
  }
})();
