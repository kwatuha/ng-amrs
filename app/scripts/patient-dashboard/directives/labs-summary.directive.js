/* global angular */
/*
jshint -W003, -W026
*/
(function () {
    'use strict';

    angular
        .module('app.patientdashboard')
        .directive('labsSummary', labsSummary);

    function labsSummary() {
        return {
            restict: "E",
            scope: { patientUuid: "@" },
            controller: labsSummaryController,
            link: labsSummaryLink,
            templateUrl: "views/patient-dashboard/labs-summary-pane.html"
        };
    }

    labsSummaryController.$inject = ['$scope', 'EtlRestService', 'PatientTestModel'];

    function labsSummaryController($scope, EtlRestService, patientTestModel) {
        $scope.injectedEtlRestService = EtlRestService;
        $scope.encounters = [];
        $scope.isBusy = false;
        $scope.nextStartIndex = 0;
        $scope.loadMoreLabs = loadMoreLabs;
        $scope.allDataLoaded = false;
        $scope.experiencedLoadingError = false;

        function loadMoreLabs() {
            if ($scope.isBusy === true) return;

            $scope.isBusy = true;
            $scope.experiencedLoadingError = false;

            if ($scope.patientUuid && $scope.patientUuid !== '')
                EtlRestService.getPatientTests($scope.patientUuid, $scope.nextStartIndex, 10, onFetchPatientTestsSuccess, onFetchPatientTestsFailed);
        }

        function onFetchPatientTestsSuccess(patientTestsData) {
            $scope.nextStartIndex = +patientTestsData.startIndex + patientTestsData.size;
            for (var e in patientTestsData.result) {
                $scope.encounters.push(new patientTestModel.patientTest(patientTestsData.result[e]));
            }
            if (patientTestsData.size !== 0) {
                $scope.isBusy = false;
            }
            else
                $scope.allDataLoaded = true;
        }

        function onFetchPatientTestsFailed(error) {
            $scope.experiencedLoadingError = true;
            $scope.isBusy = false;
        }
    }

    function labsSummaryLink(scope, element, attrs, vm) {
        attrs.$observe('patientUuid', onPatientUuidChanged);

        function onPatientUuidChanged(newVal, oldVal) {
            if (newVal && newVal != "") {
                scope.isBusy = false;
                scope.allDataLoaded = false;
                scope.nextStartIndex = 0;
                scope.encounters = [];
                scope.loadMoreLabs();
            }
        }
    }

})();