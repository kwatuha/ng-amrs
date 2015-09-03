/* global _ */
/*jshint -W003, -W098, -W117, -W026 */
(function () {
  'use strict';

  angular
    .module('app.openmrsRestServices')
    .service('ConceptResService', ProviderResService);

  ProviderResService.$inject = ['OpenmrsSettings', '$resource','$q'];

  function ProviderResService(OpenmrsSettings, $resource,$q) {
    var serviceDefinition;
    serviceDefinition = {
      getResource: getResource,
      getConceptClassResource: getConceptClassResource,
      getSearchResource: getSearchResource,
      getConceptClasses: getConceptClasses,
      getConceptByUuid: getConceptByUuid,
      findConcept: findConcept,
      findConceptByConceptClassesUuid: findConceptByConceptClassesUuid,
      filterResultsByConceptClassesUuid: filterResultsByConceptClassesUuid,
      filterResultsByConceptClassesName:filterResultsByConceptClassesName,
      getConceptAnswers:getConceptAnswers,
      getConceptAnswersN:getConceptAnswersN
    };
    return serviceDefinition;

    function getResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase() + 'concept/:uuid?v=custom:(uuid,name,conceptClass)',
        { uuid: '@uuid' },
        { query: { method: 'GET', isArray: false } });
    }

    function getSearchResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase() + 'concept?q=:q&v=custom:(uuid,name,conceptClass)',
        { q: '@q' },
        { query: { method: 'GET', isArray: false } });
    }

    function getConceptClassResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase() + 'conceptclass',
        { uuid: '@uuid' },
        { query: { method: 'GET', isArray: false } });
    }

    function getConceptWithAnswersResource() {
      return $resource(OpenmrsSettings.getCurrentRestUrlBase() + 'concept/:uuid?v=custom:(uuid,name,answers)',
        { q: '@q' },
        { query: { method: 'GET', isArray: false } });
    }

    function getConceptClasses(successCallback, failedCallback) {
      var resource = getConceptClassResource();
      return resource.get({ v: 'default' }).$promise
        .then(function (response) {
          successCallback(response.results ? response.results : response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }

    function getConceptByUuid(uuid, successCallback, failedCallback) {
      var resource = getResource();
      return resource.get({ uuid: uuid }).$promise
        .then(function (response) {
          successCallback(response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }

    function getConceptAnswers(uuid) {
      var deferObject  =  deferObject || $q.defer();
      var resource = getConceptWithAnswersResource();
      var promise= resource.get({ uuid: uuid }).$promise;


      promise
        .then(function (response) {
          deferObject.resolve(response);
        })
        .catch(function (error) {
          deferObject.reject(error);
          console.error(error);
        });
      return deferObject.promise;
    }


    /*angular.module('services', [])
      .factory('MyService', function($q, $timeout){
        var getData = function getData() {

          var deferred = $q.defer;

          $timeout(function () {
            deferred.resolve('Foo');
          }, 5000);

          return deferred.promise;
        };

        return {
          getData: getData
        };
      });*/
    function getConceptAnswersN(params, callback) {
      var conceptResource = getConceptWithAnswersResource();
      var concepts = [];
      //console.log(params);
      conceptResource.query(params, false, function(data) {

        angular.forEach(data.results, function(value, key) {
          concepts.push({"concept":value.uuId,"label":value.display});
        });

        callback(concepts);
      });
    }

    function findConcept(searchText, successCallback, failedCallback) {
      var resource = getSearchResource();
      return resource.get({ q: searchText }).$promise
        .then(function (response) {
          successCallback(response.results ? response.results : response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }

    function findConceptByConceptClassesUuid(searchText, conceptClassesUuidArray, successCallback, failedCallback) {
      var resource = getSearchResource();

      return resource.get({ q: searchText }).$promise
        .then(function (response) {
          successCallback(response.results ? filterResultsByConceptClassesUuid(response.results, conceptClassesUuidArray) : response);
        })
        .catch(function (error) {
          failedCallback('Error processing request', error);
          console.error(error);
        });
    }

    function filterResultsByConceptClassesUuid(results, conceptClassesUuidArray) {
      var res = _.filter(results, function (result) {
        return _.find(conceptClassesUuidArray, function (uuid) {
          return result.conceptClass.uuid === uuid;
        });
      });
      return res;
    }

    function filterResultsByConceptClassesName(results, conceptClassesNameArray) {
      var res = _.filter(results, function (result) {
        return _.find(conceptClassesNameArray, function (name) {
          return result.conceptClass.name === name;
        });
      });
      return res;
    }

    function filterConceptAnswersByConcept(results, conceptUuid) {
      var res = _.filter(results, function (result) {
        return _.find(conceptUuid, function (name) {
          return result.uuid === name;
        });
      });
      return res;
    }

  }
})();
